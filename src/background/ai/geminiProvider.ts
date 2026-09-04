import type { AIProvider } from "./provider";
import { acquireGeminiSlot } from "./rateLimiter";

const MODEL = "gemini-3.5-flash-lite";
const STREAM_IDLE_TIMEOUT_MS = 30_000;

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: { parts?: GeminiPart[] };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
  error?: { message?: string };
}

function endpoint(apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse&key=${encodeURIComponent(apiKey)}`;
}

function generateEndpoint(apiKey: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(apiKey)}`;
}

function extractText(candidate?: GeminiCandidate): string {
  return candidate?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
}

const TIMEOUT_MESSAGE = "Gemini isteği zaman aşımına uğradı. Tekrar dene.";

/**
 * `externalSignal` iptal edildiğinde ya da veri akışı `idleMs` boyunca
 * durursa tetiklenen birleşik bir AbortSignal döndürür. `resetTimer` her
 * chunk alındığında çağrılarak boşta kalma süresi sıfırlanır.
 */
function withIdleTimeout(externalSignal: AbortSignal | undefined, idleMs: number) {
  const controller = new AbortController();
  let timedOut = false;
  let timer: ReturnType<typeof setTimeout>;

  const arm = () => {
    timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, idleMs);
  };
  arm();

  const onExternalAbort = () => controller.abort();
  externalSignal?.addEventListener("abort", onExternalAbort);

  return {
    signal: controller.signal,
    resetTimer() {
      clearTimeout(timer);
      arm();
    },
    wasTimeout: () => timedOut,
    cleanup() {
      clearTimeout(timer);
      externalSignal?.removeEventListener("abort", onExternalAbort);
    },
  };
}

async function fetchWithRateLimit(url: string, init: RequestInit): Promise<Response> {
  await acquireGeminiSlot();
  return fetch(url, init);
}

export function createGeminiProvider(apiKey: string): AIProvider {
  return {
    async streamGenerateText(prompt, onChunk, signal) {
      const timeout = withIdleTimeout(signal, STREAM_IDLE_TIMEOUT_MS);

      try {
        const response = await fetchWithRateLimit(endpoint(apiKey), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
          signal: timeout.signal,
        });

        if (!response.ok || !response.body) {
          const body = await response.text().catch(() => "");
          if (response.status === 429) {
            throw new Error(`Gemini API kotası aşıldı (429): ${body.slice(0, 300) || "detay yok"}`);
          }
          throw new Error(`Gemini isteği başarısız oldu (${response.status}): ${body.slice(0, 300)}`);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          timeout.resetTimer();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const json = line.slice("data: ".length).trim();
            if (!json) continue;

            const parsed = JSON.parse(json) as GeminiResponse;
            if (parsed.error?.message) {
              throw new Error(parsed.error.message);
            }
            const text = extractText(parsed.candidates?.[0]);
            if (text) onChunk(text);
          }
        }
      } catch (err) {
        if (timeout.wasTimeout()) throw new Error(TIMEOUT_MESSAGE);
        throw err;
      } finally {
        timeout.cleanup();
      }
    },

    async generateJson(prompt, signal) {
      const timeout = withIdleTimeout(signal, STREAM_IDLE_TIMEOUT_MS);

      try {
        const response = await fetchWithRateLimit(generateEndpoint(apiKey), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" },
          }),
          signal: timeout.signal,
        });

        if (!response.ok) {
          const body = await response.text().catch(() => "");
          if (response.status === 429) {
            throw new Error(`Gemini API kotası aşıldı (429): ${body.slice(0, 300) || "detay yok"}`);
          }
          throw new Error(`Gemini isteği başarısız oldu (${response.status}): ${body.slice(0, 300)}`);
        }

        const data = (await response.json()) as GeminiResponse;
        if (data.error?.message) throw new Error(data.error.message);
        return extractText(data.candidates?.[0]);
      } catch (err) {
        if (timeout.wasTimeout()) throw new Error(TIMEOUT_MESSAGE);
        throw err;
      } finally {
        timeout.cleanup();
      }
    },
  };
}
