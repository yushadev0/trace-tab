const GEMINI_API_KEY = "geminiApiKey";
const TAVILY_API_KEY = "tavilyApiKey";

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
