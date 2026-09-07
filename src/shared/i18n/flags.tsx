import type { ReactElement } from "react";
import type { AppLanguage } from "../types";

/**
 * Bayrak emojileri Windows'ta glyph olarak gelmediği için bayraklar inline SVG.
 * Harici istek yok; paket içinde gömülü, çevrimdışı çalışır.
 *
 * Her SVG'nin viewBox'ı KARE ve bayrak bu karenin içine ortalanmış/kırpılmış
 * çiziliyor. Böylece dairesel swatch içinde şerit gibi değil, tam daire görünür.
 */
const FLAGS: Record<AppLanguage, ReactElement> = {
  tr: (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Türkiye">
      <rect width="512" height="512" fill="#e30a17" />
      <circle cx="220" cy="256" r="118" fill="#fff" />
      <circle cx="250" cy="256" r="94" fill="#e30a17" />
      <path
        d="M260 256 311 238 312 185 344 228 396 212 365 256 396 300 344 285 312 327 311 274Z"
        fill="#fff"
      />
    </svg>
  ),
  en: (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="United Kingdom">
      <clipPath id="flag-gb-t">
        <path d="M256 256h256v256zv256h-256zh-256v-256zv-256h256z" />
      </clipPath>
      <rect width="512" height="512" fill="#012169" />
      <path d="M0 0 512 512M512 0 0 512" stroke="#fff" strokeWidth="102" />
      <path d="M0 0 512 512M512 0 0 512" clipPath="url(#flag-gb-t)" stroke="#c8102e" strokeWidth="68" />
      <path d="M256 0v512M0 256h512" stroke="#fff" strokeWidth="170" />
      <path d="M256 0v512M0 256h512" stroke="#c8102e" strokeWidth="102" />
    </svg>
  ),
  de: (
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Deutschland">
      <rect width="512" height="512" fill="#000" />
      <rect width="512" height="341" y="171" fill="#d00" />
      <rect width="512" height="170" y="342" fill="#ffce00" />
    </svg>
  ),
};

export function Flag({ lang }: { lang: AppLanguage }) {
  return FLAGS[lang];
}
