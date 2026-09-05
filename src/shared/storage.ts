import type { EmailCacheEntry, ThemeId } from "./types";

const GEMINI_API_KEY = "geminiApiKey";
const TAVILY_API_KEY = "tavilyApiKey";
const THEME_KEY = "theme";
const GREETING_TITLE_KEY = "greetingTitle";
const GREETING_SUBTITLE_KEY = "greetingSubtitle";
const EMAIL_CACHE_KEY = "emailCache";
const OUTLOOK_CLIENT_ID_KEY = "outlookClientId";
const OUTLOOK_ACCOUNT_KEY = "outlookAccount";

export interface OutlookAccount {
  email: string;
  accessToken: string;
  refreshToken?: string;
  /** Epoch ms cinsinden access token'ın geçerlilik bitişi. */
  expiresAt: number;
}

export const DEFAULT_GREETING_TITLE = "Merhaba, Yuşa";
export const DEFAULT_GREETING_SUBTITLE = "Daddy's Home? Bugün ne yapıyoruz.";

export async function getGeminiApiKey(): Promise<string | undefined> {
  const result = await chrome.storage.local.get(GEMINI_API_KEY);
  return result[GEMINI_API_KEY] as string | undefined;
}

export async function setGeminiApiKey(key: string): Promise<void> {
  await chrome.storage.local.set({ [GEMINI_API_KEY]: key });
}

export async function getTavilyApiKey(): Promise<string | undefined> {
  const result = await chrome.storage.local.get(TAVILY_API_KEY);
  return result[TAVILY_API_KEY] as string | undefined;
}

export async function setTavilyApiKey(key: string): Promise<void> {
  await chrome.storage.local.set({ [TAVILY_API_KEY]: key });
}

export async function getTheme(): Promise<ThemeId | undefined> {
  const result = await chrome.storage.local.get(THEME_KEY);
  return result[THEME_KEY] as ThemeId | undefined;
}

export async function setTheme(theme: ThemeId): Promise<void> {
  await chrome.storage.local.set({ [THEME_KEY]: theme });
}

export async function getGreetingTitle(): Promise<string | undefined> {
  const result = await chrome.storage.local.get(GREETING_TITLE_KEY);
  return result[GREETING_TITLE_KEY] as string | undefined;
}

export async function setGreetingTitle(title: string): Promise<void> {
  await chrome.storage.local.set({ [GREETING_TITLE_KEY]: title });
}

export async function getGreetingSubtitle(): Promise<string | undefined> {
  const result = await chrome.storage.local.get(GREETING_SUBTITLE_KEY);
  return result[GREETING_SUBTITLE_KEY] as string | undefined;
}

export async function setGreetingSubtitle(subtitle: string): Promise<void> {
  await chrome.storage.local.set({ [GREETING_SUBTITLE_KEY]: subtitle });
}

export async function getOutlookClientId(): Promise<string | undefined> {
  const result = await chrome.storage.local.get(OUTLOOK_CLIENT_ID_KEY);
  return result[OUTLOOK_CLIENT_ID_KEY] as string | undefined;
}

export async function setOutlookClientId(clientId: string): Promise<void> {
  await chrome.storage.local.set({ [OUTLOOK_CLIENT_ID_KEY]: clientId });
}

export async function getOutlookAccount(): Promise<OutlookAccount | undefined> {
  const result = await chrome.storage.local.get(OUTLOOK_ACCOUNT_KEY);
  return result[OUTLOOK_ACCOUNT_KEY] as OutlookAccount | undefined;
}

export async function setOutlookAccount(account: OutlookAccount): Promise<void> {
  await chrome.storage.local.set({ [OUTLOOK_ACCOUNT_KEY]: account });
}

export async function clearOutlookAccount(): Promise<void> {
  await chrome.storage.local.remove(OUTLOOK_ACCOUNT_KEY);
}

export async function getEmailCache(): Promise<Record<string, EmailCacheEntry>> {
  const result = await chrome.storage.local.get(EMAIL_CACHE_KEY);
  return (result[EMAIL_CACHE_KEY] as Record<string, EmailCacheEntry> | undefined) ?? {};
}

export async function setEmailCache(cache: Record<string, EmailCacheEntry>): Promise<void> {
  await chrome.storage.local.set({ [EMAIL_CACHE_KEY]: cache });
}

export async function clearEmailCache(): Promise<void> {
  await chrome.storage.local.remove(EMAIL_CACHE_KEY);
}
