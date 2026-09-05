import type { EmailSummaryInput } from "../../shared/types";

async function getAuthToken(interactive: boolean): Promise<string> {
  const result = await chrome.identity.getAuthToken({ interactive });
  if (!result.token) throw new Error("Gmail yetkilendirmesi alınamadı.");
  return result.token;
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
  const token = await getAuthToken(true);
  const profile = (await gmailFetch("profile", token)) as { emailAddress?: string };
  return profile.emailAddress ?? "";
}

/** Daha önce izin verilmişse (etkileşimsiz) bağlı hesabın e-posta adresini döndürür, yoksa undefined. */
export async function getConnectedEmail(): Promise<string | undefined> {
  try {
    const token = await getAuthToken(false);
    const profile = (await gmailFetch("profile", token)) as { emailAddress?: string };
    return profile.emailAddress;
  } catch {
    return undefined;
  }
}

export async function disconnectGmail(): Promise<void> {
  try {
    const token = await getAuthToken(false);
    await chrome.identity.removeCachedAuthToken({ token });
  } catch {
    // Zaten bağlı değilse yapacak bir şey yok.
  }
}

/** Son `maxResults` okunmamış e-postanın konu/gönderen/özet bilgisini getirir. */
export async function fetchRecentEmails(
  maxResults: number,
  accountEmail: string,
  signal?: AbortSignal,
): Promise<EmailSummaryInput[]> {
  const token = await getAuthToken(false);

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
      link: `https://mail.google.com/mail/u/0/#all/${messages[i].id}`,
    }),
  );
}
