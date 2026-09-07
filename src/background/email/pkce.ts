/**
 * OAuth 2.0 PKCE + base64url yardımcıları. Hem Gmail hem Outlook, tarayıcıdan
 * bağımsız `chrome.identity.launchWebAuthFlow` akışında bunları paylaşır.
 */

export function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Kriptografik rastgele, URL-güvenli bir token (PKCE verifier / state için). */
export function randomUrlToken(byteLength = 32): string {
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

/** Verilen dizenin SHA-256 özetinin base64url hâli (PKCE S256 challenge). */
export async function sha256Base64Url(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(digest));
}
