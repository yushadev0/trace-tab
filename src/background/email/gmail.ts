import { getGoogleAccount, setGoogleAccount, clearGoogleAccount } from "../../shared/storage";
import type { EmailSummaryInput } from "../../shared/types";
import { randomUrlToken, sha256Base64Url } from "./pkce";

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const REVOKE_ENDPOINT = "https://oauth2.googleapis.com/revoke";
const SCOPE = "https://www.googleapis.com/auth/gmail.readonly";

/**
 * Google Cloud → "Web application" tipi OAuth 2.0 client.
 * Yetkili redirect URI olarak `chrome.identity.getRedirectURL()` değeri
 * (`https://einifdamdgidjbeiodcegakdjfkckmeh.chromiumapp.org/`) eklenmeli.
 *
 * `chrome.identity.launchWebAuthFlow` kullandığımız için akış Chrome'a bağlı
 * değil — Edge, Brave, Vivaldi gibi tüm Chromium tarayıcılarda çalışır.
 *
 * Not: "Web application" client'ları token isteğinde `client_secret` bekler.
 * Bir uzantıda bu değer gerçekten gizli tutulamaz; güvenlik, yalnızca bizim
 * redirect URI'mize dönülebilmesi kısıtına dayanır. (Google PKCE-only kabul
 * ederse secret'ı boş bırakabilirsiniz; boşsa isteğe eklenmez.)
 */
// "Web application" tipi OAuth client (getAuthToken için kullanılan "Chrome
// Extension" tipi client bu akışta çalışmaz). Değerler .env'den gelir
// (bkz. .env.example); build sırasında pakete gömülür, repoya girmez.
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET;

/** Token'ı süresi dolmadan bir dakika önce yenilenmiş say. */
const EXPIRY_BUFFER_MS = 60_000;

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  error?: string;
  error_description?: string;
}

function withClientAuth(params: Record<string, string>): URLSearchParams {
  const search = new URLSearchParams({ ...params, client_id: GOOGLE_CLIENT_ID });
  if (GOOGLE_CLIENT_SECRET) search.set("client_secret", GOOGLE_CLIENT_SECRET);
  return search;
}

async function exchangeToken(params: URLSearchParams): Promise<TokenResponse> {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  const data = (await response.json()) as TokenResponse;
  if (!response.ok || data.error) {
    throw new Error(data.error_description || data.error || "Google token isteği başarısız oldu.");
  }
  return data;
}

async function authorizeInteractive(): Promise<TokenResponse> {
  const redirectUri = chrome.identity.getRedirectURL();
  const verifier = randomUrlToken();
  const challenge = await sha256Base64Url(verifier);
  const state = randomUrlToken();

  const authUrl = new URL(AUTH_ENDPOINT);
  authUrl.searchParams.set("client_id", GOOGLE_CLIENT_ID);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("scope", SCOPE);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("code_challenge", challenge);
  authUrl.searchParams.set("code_challenge_method", "S256");
  authUrl.searchParams.set("access_type", "offline");
  // Her yetkilendirmede refresh_token dönmesini garantiler.
  authUrl.searchParams.set("prompt", "consent");

  const resultUrl = await chrome.identity.launchWebAuthFlow({ url: authUrl.toString(), interactive: true });
  if (!resultUrl) throw new Error("Gmail yetkilendirmesi tamamlanmadı.");

  const returned = new URL(resultUrl).searchParams;
  const error = returned.get("error");
  if (error) throw new Error(returned.get("error_description") ?? error);
  if (returned.get("state") !== state) throw new Error("Gmail yetkilendirme durumu (state) eşleşmedi.");

  const code = returned.get("code");
  if (!code) throw new Error("Gmail yetkilendirme kodu alınamadı.");

  return exchangeToken(
    withClientAuth({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
  );
}

async function refreshAccessToken(refreshToken: string): Promise<TokenResponse> {
  return exchangeToken(withClientAuth({ grant_type: "refresh_token", refresh_token: refreshToken }));
}

/** Geçerli bir access token döndürür; gerekirse refresh token ile sessizce yeniler. */
async function getValidAccessToken(): Promise<string> {
  const account = await getGoogleAccount();
  if (!account) throw new Error("Gmail bağlı değil.");

  if (Date.now() < account.expiresAt - EXPIRY_BUFFER_MS) {
    return account.accessToken;
  }

  if (!account.refreshToken) throw new Error("Gmail oturumu süresi doldu. Tekrar bağlanın.");

  const tokens = await refreshAccessToken(account.refreshToken);
  const updated = {
    email: account.email,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? account.refreshToken,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  };
  await setGoogleAccount(updated);
  return updated.accessToken;
}

async function gmailFetch(path: string, token: string, signal?: AbortSignal): Promise<unknown> {
  const response = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    signal,
  });
  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Gmail API isteği başarısız oldu (${response.status}): ${body.slice(0, 300)}`);
  }
  return response.json();
}

function headerValue(headers: { name?: string; value?: string }[] | undefined, name: string): string {
  return headers?.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value ?? "";
}

/** Etkileşimli olarak Gmail'e bağlanır ve bağlı hesabın e-posta adresini döndürür. */
export async function connectGmail(): Promise<string> {
  const tokens = await authorizeInteractive();

  const profile = (await gmailFetch("profile", tokens.access_token)) as { emailAddress?: string };
  const email = profile.emailAddress ?? "";

  await setGoogleAccount({
    email,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
    expiresAt: Date.now() + tokens.expires_in * 1000,
  });

  return email;
}

/** Daha önce bağlanılmışsa (etkileşimsiz, gerekirse token yenileyerek) bağlı hesabın adresini döndürür. */
export async function getConnectedEmail(): Promise<string | undefined> {
  try {
    const account = await getGoogleAccount();
    if (!account) return undefined;
    await getValidAccessToken();
    return account.email;
  } catch {
    return undefined;
  }
}

export async function disconnectGmail(): Promise<void> {
  const account = await getGoogleAccount();
  await clearGoogleAccount();

  const token = account?.refreshToken ?? account?.accessToken;
  if (token) {
    try {
      await fetch(`${REVOKE_ENDPOINT}?token=${encodeURIComponent(token)}`, { method: "POST" });
    } catch {
      // Revoke başarısız olsa bile yerel kayıt zaten silindi.
    }
  }
}

/** Son `maxResults` okunmamış e-postanın konu/gönderen/özet bilgisini getirir. */
export async function fetchRecentEmails(
  maxResults: number,
  accountEmail: string,
  signal?: AbortSignal,
): Promise<EmailSummaryInput[]> {
  const token = await getValidAccessToken();

  const list = (await gmailFetch(
    `messages?maxResults=${maxResults}&labelIds=INBOX&labelIds=UNREAD`,
    token,
    signal,
  )) as {
    messages?: { id: string }[];
  };

  const messages = list.messages ?? [];
  const details = await Promise.all(
    messages.map((m) =>
      gmailFetch(
        `messages/${m.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=Date`,
        token,
        signal,
      ),
    ),
  );

  return (details as { payload?: { headers?: { name?: string; value?: string }[] }; snippet?: string }[]).map(
    (d, i) => ({
      id: messages[i].id,
      provider: "gmail" as const,
      accountEmail,
      subject: headerValue(d.payload?.headers, "Subject") || "(konu yok)",
      from: headerValue(d.payload?.headers, "From") || "(bilinmiyor)",
      date: headerValue(d.payload?.headers, "Date") || "",
      snippet: d.snippet ?? "",
      link: `https://mail.google.com/mail/u/0/#inbox/${messages[i].id}`,
    }),
  );
}
