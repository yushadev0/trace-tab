function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Basit kayan-pencere rate limiter. `maxPerWindow` dolduğunda, en eski isteğin
 * pencereden düşmesini bekler (hata fırlatmak yerine).
 */
function createRateLimiter(maxPerWindow: number, windowMs = 60_000): () => Promise<void> {
  const timestamps: number[] = [];

  return async function acquire() {
    for (;;) {
      const now = Date.now();
      while (timestamps.length > 0 && now - timestamps[0] >= windowMs) {
        timestamps.shift();
      }
      if (timestamps.length < maxPerWindow) {
        timestamps.push(now);
        return;
      }
      await sleep(windowMs - (now - timestamps[0]) + 25);
    }
  };
}

// Gemini ücretsiz plan (gemini-3.5-flash-lite): 15 RPM. Quick Ask ve Deep
// Research aynı API key'i paylaştığı için ortak bir limiter kullanıyoruz;
// 12 sınırı, ikisi aynı anda kullanılsa bile biraz tampon bırakıyor.
export const acquireGeminiSlot = createRateLimiter(12);
