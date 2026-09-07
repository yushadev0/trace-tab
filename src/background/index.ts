import { createGeminiProvider } from "./ai/geminiProvider";
import { connectGmail, disconnectGmail, fetchRecentEmails, getConnectedEmail } from "./email/gmail";
import { connectOutlook, disconnectOutlook, fetchRecentOutlookEmails, getConnectedOutlookEmail } from "./email/outlook";
import { buildDigestPrompt, parseDigest, type EmailCard } from "./email/summarizer";
import { buildGroundedPrompt, searchWeb } from "./search/tavilySearch";
import { getEmailCache, getGeminiApiKey, getTavilyApiKey, setEmailCache } from "../shared/storage";
import { getBackgroundI18n } from "../shared/i18n/background";
import {
  EMAIL_DIGEST_PORT,
  QUICK_ASK_PORT,
  type AppLanguage,
  type ChatMessageDto,
  type EmailCacheEntry,
  type EmailConnectionRequest,
  type EmailConnectionResponse,
  type EmailDigestResponse,
  type EmailSummaryInput,
  type QuickAskRequest,
  type QuickAskResponse,
  type WebSourceDto,
} from "../shared/types";

const EMAIL_CACHE_LIMIT = 300;
const EMAIL_DIGEST_LIMIT = 10;

chrome.runtime.onInstalled.addListener(() => {
  console.log("[Trace Tab] service worker installed");
});

chrome.runtime.onMessage.addListener((message: EmailConnectionRequest, _sender, sendResponse) => {
  handleEmailConnection(message).then(sendResponse);
  return true;
});

async function handleEmailConnection(message: EmailConnectionRequest): Promise<EmailConnectionResponse> {
  try {
    if (message.provider === "gmail") {
      if (message.action === "connect") return { connected: true, email: await connectGmail() };
      if (message.action === "disconnect") {
        await disconnectGmail();
        return { connected: false };
      }
      const email = await getConnectedEmail();
      return email ? { connected: true, email } : { connected: false };
    }

    if (message.action === "connect") return { connected: true, email: await connectOutlook() };
    if (message.action === "disconnect") {
      await disconnectOutlook();
      return { connected: false };
    }
    const email = await getConnectedOutlookEmail();
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
      const { lang, t } = await getBackgroundI18n();

      const apiKey = await getGeminiApiKey();
      if (!apiKey) {
        send({ type: "error", message: t("errors.geminiKeyMissing") });
        return;
      }

      let finalPrompt = message.prompt;
      let sources: WebSourceDto[] = [];

      if (message.grounded) {
        const tavilyKey = await getTavilyApiKey();
        if (!tavilyKey) {
          send({ type: "error", message: t("errors.tavilyKeyMissing") });
          return;
        }

        const results = await searchWeb(message.prompt, tavilyKey, 5, controller.signal);
        sources = results.map((r) => ({ title: r.title, uri: r.url }));
        finalPrompt = buildGroundedPrompt(message.prompt, results, lang);
      }

      const history = message.history ?? [];
      const contents: ChatMessageDto[] = [...history, { role: "user", text: finalPrompt }];

      const provider = createGeminiProvider(apiKey);
      await provider.streamGenerateText(
        contents,
        (text) => send({ type: "chunk", text }),
        controller.signal,
        t("ai.chatSystem"),
      );
      send({ type: "done", sources });
    } catch (err) {
      send({ type: "error", message: err instanceof Error ? err.message : String(err) });
    }
  });
}

function pruneEmailCache(cache: Record<string, EmailCacheEntry>): Record<string, EmailCacheEntry> {
  const entries = Object.entries(cache);
  if (entries.length <= EMAIL_CACHE_LIMIT) return cache;
  entries.sort((a, b) => b[1].cachedAt - a[1].cachedAt);
  return Object.fromEntries(entries.slice(0, EMAIL_CACHE_LIMIT));
}

function cacheKey(e: { provider: string; id: string }, lang: AppLanguage): string {
  return `${e.provider}:${e.id}:${lang}`;
}

const LEGACY_PRIORITY: Record<string, EmailCard["priority"]> = {
  düşük: "low",
  orta: "medium",
  yüksek: "high",
};

/**
 * Eski önbellek kayıtlarını yeni şemaya taşır: Gmail linkini #inbox'a çevirir ve
 * Türkçe öncelik değerlerini (düşük/orta/yüksek) sabit enum'a (low/medium/high) map'ler.
 */
function normalizeCard(card: EmailCard): EmailCard {
  let next = card;
  if (next.provider === "gmail" && next.link.includes("mail.google.com/mail/") && next.link.includes("#all/")) {
    next = { ...next, link: next.link.replace("#all/", "#inbox/") };
  }
  const mapped = LEGACY_PRIORITY[next.priority as string];
  if (mapped) next = { ...next, priority: mapped };
  return next;
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
      const { lang, t } = await getBackgroundI18n();

      const apiKey = await getGeminiApiKey();
      if (!apiKey) {
        send({ type: "error", message: t("errors.geminiKeyMissing") });
        return;
      }

      const [gmailEmail, outlookEmail] = await Promise.all([getConnectedEmail(), getConnectedOutlookEmail()]);
      if (!gmailEmail && !outlookEmail) {
        send({ type: "noAccount" });
        return;
      }

      send({ type: "status", message: t("digest.fetching") });
      const fetched: EmailSummaryInput[] = [];
      if (gmailEmail) fetched.push(...(await fetchRecentEmails(EMAIL_DIGEST_LIMIT, gmailEmail, controller.signal)));
      if (outlookEmail)
        fetched.push(...(await fetchRecentOutlookEmails(EMAIL_DIGEST_LIMIT, outlookEmail, controller.signal)));

      const emails = fetched
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, EMAIL_DIGEST_LIMIT);

      if (emails.length === 0) {
        send({ type: "cards", cards: [] });
        send({ type: "done" });
        return;
      }

      const cache = await getEmailCache();
      const cachedCards: EmailCard[] = [];
      const uncached: EmailSummaryInput[] = [];
      for (const email of emails) {
        const hit = cache[cacheKey(email, lang)];
        if (hit) cachedCards.push(hit);
        else uncached.push(email);
      }

      const newCards: EmailCard[] = [];
      if (uncached.length > 0) {
        send({ type: "status", message: t("digest.summarizingCount", { count: uncached.length }) });
        const provider = createGeminiProvider(apiKey);
        const updatedCache = { ...cache };

        for (let i = 0; i < uncached.length; i++) {
          send({ type: "progress", processed: i, total: uncached.length });
          const email = uncached[i];
          const prompt = buildDigestPrompt([email], lang);
          const raw = await provider.generateJson(prompt, controller.signal);
          const [card] = parseDigest(raw, [email]);
          if (card) {
            newCards.push(card);
            updatedCache[cacheKey(card, lang)] = { ...card, cachedAt: Date.now() };
          }
        }
        send({ type: "progress", processed: uncached.length, total: uncached.length });

        await setEmailCache(pruneEmailCache(updatedCache));
      }

      const byKey = new Map([...cachedCards, ...newCards].map((c) => [cacheKey(c, lang), c]));
      const cards = emails
        .map((e) => byKey.get(cacheKey(e, lang)))
        .filter((c): c is EmailCard => Boolean(c))
        .map(normalizeCard);

      send({ type: "cards", cards });
      send({ type: "done" });
    } catch (err) {
      send({ type: "error", message: err instanceof Error ? err.message : String(err) });
    }
  });
}
