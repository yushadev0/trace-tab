import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "../package.json" with { type: "json" };

export default defineManifest({
  manifest_version: 3,
  name: "Trace Tab",
  version: pkg.version,
  description: "Yapay zeka destekli yeni sekme: hızlı sorular, web'de arama ve e-posta özetleri.",
  // Chrome Web Store'daki öğenin ortak anahtarı — paketlenmemiş yerel yükleme de
  // aynı uzantı ID'sini (einifdamdgidjbeiodcegakdjfkckmeh) alsın diye. Böylece
  // Gmail OAuth client'ı tek bir ID'ye bağlanabiliyor.
  key: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2n4eayxrqZG+W7oS1XybRQwiEihAZS2A+nvwdGxWbS2mCJ9UZuG1F8TfEy61jEwAa9Obx2x1b5RLY1u1j2TwXwagZOYqD/P0WstyqRZBbEAKHX3dCBigOJUNnjRzWAPqqIwsMS/5dSDFMrbl6A7LNDFtCAQwvKZAS3VWKGOO5QeNxM1nxS+9J17Kbunzf6LErTWMj/Le8i8VgWRMt1aXYIByxcYFPzvARk/2I579PaOgO6ZOu8qsfEsaIuhEiD6VKIOWKMPxYIwLKUa4aJWU5RpmxLni8o9HI7b9YBLYdz+xJfSTyh8h1ulDDgmzQ0612ZeSRM5Fn0bpwDoVEkQ83wIDAQAB",
  icons: {
    16: "icons/icon-16.png",
    32: "icons/icon-32.png",
    48: "icons/icon-48.png",
    128: "icons/icon-128.png",
  },
  action: {
    default_icon: {
      16: "icons/icon-16.png",
      32: "icons/icon-32.png",
    },
  },
  chrome_url_overrides: {
    newtab: "src/newtab/index.html",
  },
  options_page: "src/options/index.html",
  background: {
    service_worker: "src/background/index.ts",
    type: "module",
  },
  permissions: ["storage", "identity"],
  host_permissions: [
    "https://generativelanguage.googleapis.com/*",
    "https://api.tavily.com/*",
    "https://gmail.googleapis.com/*",
    "https://graph.microsoft.com/*",
    "https://login.microsoftonline.com/*",
  ],
  oauth2: {
    client_id: "496477408238-2lp9kq5762lea1f0tju4vgi2lphulhdc.apps.googleusercontent.com",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
  },
});
