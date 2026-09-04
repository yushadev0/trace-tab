import { createGeminiProvider } from "./ai/geminiProvider";
import { connectGmail, disconnectGmail, fetchRecentEmails, getConnectedEmail } from "./email/gmail";
import { buildDigestPrompt, parseDigest } from "./email/summarizer";
import { buildGroundedPrompt, searchWeb } from "./search/tavilySearch";
import { getGeminiApiKey, getTavilyApiKey } from "../shared/storage";
import {
  EMAIL_DIGEST_PORT,
  QUICK_ASK_PORT,
  type EmailDigestResponse,
  type GmailConnectionRequest,
  type GmailConnectionResponse,
  type QuickAskRequest,
  type QuickAskResponse,
  type WebSourceDto,
} from "../shared/types";

chrome.runtime.onInstalled.addListener(() => {
  console.log("[AI New Tab] service worker installed");
});

chrome.runtime.onMessage.addListener((message: GmailConnectionRequest, _sender, sendResponse) => {
  handleGmailConnection(message).then(sendResponse);
  return true;
});

async function handleGmailConnection(message: GmailConnectionRequest): Promise<GmailConnectionResponse> {
  try {
    if (message.action === "connect") {
      const email = await connectGmail();
      return { connected: true, email };
    }
    if (message.action === "disconnect") {
      await disconnectGmail();
      return { connected: false };
    }
    // status: token varsa (etkileşimsiz) bağlıdır.
    const email = await getConnectedEmail();
    return email ? { connected: true, email } : { connected: false };
  } catch (err) {
    return { connected: false, error: err instanceof Error ? err.message : String(err) };
  }
}

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === QUICK_ASK_PORT) {
    handleQuickAsk(port);
  } else if (port.name === EMAIL_DIGEST_PORT) {
    handleEmailDigest(port);
  }
});

function handleQuickAsk(port: chrome.runtime.Port) {
  const controller = new AbortController();
  port.onDisconnect.addListener(() => controller.abort());

  port.onMessage.addListener(async (message: QuickAskRequest) => {
    const send = (response: QuickAskResponse) => {
      try {
        port.postMessage(response);
      } catch {
        // Port kapanmış olabilir; sessizce yok say.
      }
    };

    try {
      const apiKey = await getGeminiApiKey();
      if (!apiKey) {
        send({ type: "error", message: "Gemini API key ayarlanmamış. Ayarlar sayfasından ekleyin." });
        return;
      }

      let finalPrompt = message.prompt;
      let sources: WebSourceDto[] = [];

      if (message.grounded) {
        const tavilyKey = await getTavilyApiKey();
        if (!tavilyKey) {
          send({ type: "error", message: "Tavily API key ayarlanmamış. Ayarlar sayfasından ekleyin." });
          return;
        }

        const results = await searchWeb(message.prompt, tavilyKey, 5, controller.signal);
        sources = results.map((r) => ({ title: r.title, uri: r.url }));
        finalPrompt = buildGroundedPrompt(message.prompt, results);
      }

      const provider = createGeminiProvider(apiKey);
      await provider.streamGenerateText(finalPrompt, (text) => send({ type: "chunk", text }), controller.signal);
      send({ type: "done", sources });
    } catch (err) {
      send({ type: "error", message: err instanceof Error ? err.message : String(err) });
    }
  });
}

function handleEmailDigest(port: chrome.runtime.Port) {
  const controller = new AbortController();
  port.onDisconnect.addListener(() => controller.abort());

  port.onMessage.addListener(async () => {
    const send = (response: EmailDigestResponse) => {
      try {
        port.postMessage(response);
      } catch {
        // Port kapanmış olabilir; sessizce yok say.
      }
    };

    try {
      const apiKey = await getGeminiApiKey();
      if (!apiKey) {
        send({ type: "error", message: "Gemini API key ayarlanmamış. Ayarlar sayfasından ekleyin." });
        return;
      }

      send({ type: "status", message: "E-postalar getiriliyor…" });
      const emails = await fetchRecentEmails(10, controller.signal);

      if (emails.length === 0) {
        send({ type: "cards", cards: [] });
        send({ type: "done" });
        return;
      }

      send({ type: "status", message: "Özetleniyor…" });
      const provider = createGeminiProvider(apiKey);
      const prompt = buildDigestPrompt(emails);
      const raw = await provider.generateJson(prompt, controller.signal);
      const cards = parseDigest(raw, emails);
      send({ type: "cards", cards });
      send({ type: "done" });
    } catch (err) {
      send({ type: "error", message: err instanceof Error ? err.message : String(err) });
    }
  });
}
