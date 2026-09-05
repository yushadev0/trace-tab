export type ThemeId = "dark" | "light" | "f1" | "minecraft" | "factorio" | "messi";

export interface Point {
  x: number;
  y: number;
}

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

export interface EmailCardDto {
  from: string;
  date: string;
  priority: "düşük" | "orta" | "yüksek";
  summary: string;
}

/** Önbellekte tutulan, daha önce özetlenmiş bir e-posta kaydı. */
export interface EmailCacheEntry extends EmailCardDto {
  id: string;
  cachedAt: number;
}

export type EmailDigestResponse =
  | { type: "status"; message: string }
  | { type: "cards"; cards: EmailCardDto[] }
  | { type: "done" }
  | { type: "error"; message: string };

export type GmailConnectionRequest =
  | { action: "connect" }
  | { action: "disconnect" }
  | { action: "status" };

export interface GmailConnectionResponse {
  connected: boolean;
  email?: string;
  error?: string;
}
