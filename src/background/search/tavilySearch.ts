export interface WebSearchResult {
  title: string;
  url: string;
  content: string;
}

interface TavilySearchResponse {
  results?: { title?: string; url?: string; content?: string }[];
}

export async function searchWeb(
  query: string,
  apiKey: string,
  maxResults = 5,
  signal?: AbortSignal,
): Promise<WebSearchResult[]> {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ query, max_results: maxResults, search_depth: "basic" }),
    signal,
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(`Tavily Search isteği başarısız oldu (${response.status}): ${body.slice(0, 300)}`);
  }

  const data = (await response.json()) as TavilySearchResponse;
  return (data.results ?? [])
    .filter((r): r is { title: string; url: string; content?: string } => Boolean(r.url))
    .slice(0, maxResults)
    .map((r) => ({ title: r.title || r.url, url: r.url, content: r.content ?? "" }));
}

export function buildGroundedPrompt(query: string, results: WebSearchResult[]): string {
  const context = results
    .map((r, i) => `${i + 1}. ${r.title}\n${r.content}\nKaynak: ${r.url}`)
    .join("\n\n");

  return `Kullanıcının sorusu: "${query}"

Aşağıda bu soruyla ilgili güncel web arama sonuçları var:

${context}

Bu sonuçları kullanarak kullanıcının sorusunu Türkçe, düzenli bir şekilde yanıtla. İddialarını mümkün olduğunca bu kaynaklara dayandır; sonuçlar yetersiz veya çelişkiliyse belirt.`;
}
