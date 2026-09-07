import type { AppLanguage } from "../../shared/types";

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

const GROUNDED_TEMPLATES: Record<AppLanguage, (query: string, context: string) => string> = {
  tr: (query, context) => `Kullanıcının sorusu: "${query}"

Aşağıda bu soruyla ilgili güncel web arama sonuçları var:

${context}

Bu sonuçları kullanarak kullanıcının sorusunu Türkçe, düzenli bir şekilde yanıtla. İddialarını mümkün olduğunca bu kaynaklara dayandır; sonuçlar yetersiz veya çelişkiliyse belirt.`,
  en: (query, context) => `The user's question: "${query}"

Below are up-to-date web search results related to this question:

${context}

Using these results, answer the user's question in English, in a well-organized way. Ground your claims in these sources as much as possible; if the results are insufficient or contradictory, say so.`,
  de: (query, context) => `Die Frage des Nutzers: "${query}"

Nachfolgend aktuelle Web-Suchergebnisse zu dieser Frage:

${context}

Beantworte die Frage des Nutzers anhand dieser Ergebnisse auf Deutsch und gut strukturiert. Stütze deine Aussagen so weit wie möglich auf diese Quellen; wenn die Ergebnisse unzureichend oder widersprüchlich sind, weise darauf hin.`,
};

export function buildGroundedPrompt(
  query: string,
  results: WebSearchResult[],
  lang: AppLanguage = "tr",
): string {
  const context = results
    .map((r, i) => `${i + 1}. ${r.title}\n${r.content}\nURL: ${r.url}`)
    .join("\n\n");

  return (GROUNDED_TEMPLATES[lang] ?? GROUNDED_TEMPLATES.tr)(query, context);
}
