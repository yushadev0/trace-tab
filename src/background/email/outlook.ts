import { getOutlookAccount, getOutlookClientId, setOutlookAccount, clearOutlookAccount } from "../../shared/storage";
import type { EmailSummaryInput } from "../../shared/types";

const AUTHORITY = "https://login.microsoftonline.com/common/oauth2/v2.0";
const SCOPES = "offline_access Mail.Read User.Read";
/** Token'ı süresi dolmadan bir dakika önce yenilenmiş say. */
const EXPIRY_BUFFER_MS = 60_000;

function randomVerifier(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256Base64Url(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

async function requestClientId(): Promise<string> {
  const clientId = await getOutlookClientId();
  if (!clientId) {
    throw new Error("Outlook Client ID ayarlanmamış. Ayarlar sayfasından ekleyin.");
  }
  return clientId;
}

async function exchangeToken(params: URLSearchParams): Promise<TokenResponse> {
  const response = await fetch(`${AUTHORITY}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const data = (await response.json()) as TokenResponse;
  if (!response.ok || data.error) {
    throw new Error(data.error_description || "Outlook token isteği başarısız oldu.");
  }
  return data;
}

async function authorizeInteractive(clientId: string): Promise<TokenResponse> {
  const redirectUri = chrome.identity.getRedirectURL();
  const verifier = randomVerifier();
  const challenge = await sha256Base64Url(verifier);
  const state = randomVerifier();

  const authUrl = new URL(`${AUTHORITY}/authorize`);
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_mode", "query");
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");

  const resultUrl = await chrome.identity.launchWebAuthFlow({ url: authUrl.toString(), interactive: true });
  if (!resultUrl) throw new Error("Outlook yetkilendirmesi tamamlanmadı.");

  const params = new URL(resultUrl).searchParams;
  const error = params.get("error");
  if (error) throw new Error(params.get("error_description") ?? error);

  const code = params.get("code");
  if (!code) throw new Error("Outlook yetkilendirme kodu alınamadı.");

  return exchangeToken(
    new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
      scope: SCOPES,
    }),
  );
}

async function refreshAccessToken(clientId: string, refreshToken: string): Promise<TokenResponse> {
  return exchangeToken(
    new URLSearchParams({
      client_id: clientId,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      scope: SCOPES,
    }),
  );
}

async function graphFetch(path: string, token: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(`https://graph.microsoft.com/v1.0/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Outlook API isteği başarısız oldu (${response.status}): ${body.slice(0, 300)}`);
  }
  return response.json();
}

/** Geçerli bir access token döndürür; gerekirse refresh token ile sessizce yeniler. */
async function getValidAccessToken(): Promise<string> {
  const account = await getOutlookAccount();
  if (!account) throw new Error("Outlook bağlı değil.");

  if (Date.now() < account.expiresAt - EXPIRY_BUFFER_MS) {
    return account.accessToken;
  }

  if (!account.refreshToken) throw new Error("Outlook oturumu süresi doldu. Tekrar bağlanın.");

  const clientId = await requestClientId();
  const tokens = await refreshAccessToken(clientId, account.refreshToken);
  const updated = {
    email: account.email,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? account.refreshToken,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  };
  await setOutlookAccount(updated);
  return updated.accessToken;
}

/** Etkileşimli olarak Outlook'a bağlanır ve bağlı hesabın e-posta adresini döndürür. */
export async function connectOutlook(): Promise<string> {
  const clientId = await requestClientId();
  const tokens = await authorizeInteractive(clientId);

  const profile = (await graphFetch("me", tokens.access_token)) as {
    mail?: string;
    userPrincipalName?: string;
  };
  const email = profile.mail || profile.userPrincipalName || "";

  await setOutlookAccount({
    email,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  });

  return email;
}

/** Daha önce bağlanılmışsa (etkileşimsiz, gerekirse token yenileyerek) bağlı hesabın adresini döndürür. */
export async function getConnectedOutlookEmail(): Promise<string | undefined> {
  try {
    const account = await getOutlookAccount();
    if (!account) return undefined;
    await getValidAccessToken();
    return account.email;
  } catch {
    return undefined;
  }
}

export async function disconnectOutlook(): Promise<void> {
  await clearOutlookAccount();
}

/** Son `maxResults` okunmamış Outlook e-postasının konu/gönderen/özet bilgisini getirir. */
export async function fetchRecentOutlookEmails(
  maxResults: number,
  accountEmail: string,
  signal?: AbortSignal,
): Promise<EmailSummaryInput[]> {
  const token = await getValidAccessToken();

  const query = new URLSearchParams({
    $filter: "isRead eq false",
    $top: String(maxResults),
    $orderby: "receivedDateTime desc",
    $select: "id,subject,from,receivedDateTime,bodyPreview",
  });

  const list = (await graphFetch(`me/mailFolders/inbox/messages?${query}`, token, signal)) as {
    value?: {
      id: string;
      subject?: string;
      from?: { emailAddress?: { name?: string; address?: string } };
      receivedDateTime?: string;
      bodyPreview?: string;
    }[];
  };

  return (list.value ?? []).map((m) => {
    const name = m.from?.emailAddress?.name;
    const address = m.from?.emailAddress?.address;
    const from = name && address ? `${name} <${address}>` : address || name || "(bilinmiyor)";

    return {
      id: m.id,
      provider: "outlook" as const,
      accountEmail,
      subject: m.subject || "(konu yok)",
      from,
      date: m.receivedDateTime || "",
      snippet: m.bodyPreview ?? "",
    };
  });
}
