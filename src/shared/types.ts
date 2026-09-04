export const QUICK_ASK_PORT = "quick-ask";

export interface WebSourceDto {
  title: string;
  uri: string;
}

export interface QuickAskRequest {
  prompt: string;
  /** true ise Google Search grounding ile gerçek zamanlı web sonuçları kullanılır. */
  grounded?: boolean;
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
