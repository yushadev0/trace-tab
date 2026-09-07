export type ThemeId = "dark" | "light" | "f1" | "minecraft" | "factorio" | "messi";

export type AppLanguage = "tr" | "en" | "de";

export const QUICK_ASK_PORT = "quick-ask";

export interface WebSourceDto {
  title: string;
  uri: string;
}

export type ChatRole = "user" | "model";

export interface ChatMessageDto {
  role: ChatRole;
  text: string;
}

export interface QuickAskRequest {
  prompt: string;
  /** true ise Google Search grounding ile gerçek zamanlı web sonuçları kullanılır. */
  grounded?: boolean;
  /** Bu isteğe kadarki önceki sohbet turları (görüntülenen soru/cevap metinleri). */
  history?: ChatMessageDto[];
}

export type QuickAskResponse =
  | { type: "chunk"; text: string }
  | { type: "done"; sources: WebSourceDto[] }
  | { type: "error"; message: string };

export const EMAIL_DIGEST_PORT = "email-digest";

export type EmailProvider = "gmail" | "outlook";

/** Bir sağlayıcıdan (Gmail/Outlook) getirilen ham e-posta bilgisi, özetlemeden önce. */
export interface EmailSummaryInput {
  id: string;
  provider: EmailProvider;
  /** Bu e-postanın geldiği bağlı hesabın adresi (ör. birden fazla Gmail hesabı bağlanınca ayırt etmek için). */
  accountEmail: string;
  subject: string;
  from: string;
  date: string;
  snippet: string;
  /** E-postayı Gmail/Outlook web arayüzünde doğrudan açan bağlantı. */
  link: string;
}

export interface EmailCardDto {
  provider: EmailProvider;
  accountEmail: string;
  from: string;
  date: string;
  priority: "low" | "medium" | "high";
  summary: string;
  link: string;
}

/** Önbellekte tutulan, daha önce özetlenmiş bir e-posta kaydı. */
export interface EmailCacheEntry extends EmailCardDto {
  id: string;
  cachedAt: number;
}

export type EmailDigestResponse =
  | { type: "status"; message: string }
  | { type: "progress"; processed: number; total: number }
  | { type: "cards"; cards: EmailCardDto[] }
  | { type: "done" }
  /** Hiçbir e-posta hesabı bağlı değil — hata değil, sessizce boş durum. */
  | { type: "noAccount" }
  | { type: "error"; message: string };

export interface EmailConnectionRequest {
  provider: EmailProvider;
  action: "connect" | "disconnect" | "status";
}

export interface EmailConnectionResponse {
  connected: boolean;
  email?: string;
  error?: string;
}
