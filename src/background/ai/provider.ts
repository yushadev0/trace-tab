import type { ChatMessageDto } from "../../shared/types";

export interface AIProvider {
  /**
   * Streams a plain-text completion for the given conversation turns
   * (in order, ending with the current user turn), invoking `onChunk` for
   * each piece of text as it arrives. Resolves once the stream ends.
   */
  streamGenerateText(messages: ChatMessageDto[], onChunk: (text: string) => void, signal?: AbortSignal): Promise<void>;

  /** Non-streaming completion that asks the model to return structured JSON. Returns the raw JSON text. */
  generateJson(prompt: string, signal?: AbortSignal): Promise<string>;
}
