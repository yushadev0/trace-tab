export interface AIProvider {
  /**
   * Streams a plain-text completion for `prompt`, invoking `onChunk` for
   * each piece of text as it arrives. Resolves once the stream ends.
   */
  streamGenerateText(prompt: string, onChunk: (text: string) => void, signal?: AbortSignal): Promise<void>;

  /** Non-streaming completion that asks the model to return structured JSON. Returns the raw JSON text. */
  generateJson(prompt: string, signal?: AbortSignal): Promise<string>;
}
