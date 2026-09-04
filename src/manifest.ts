import { defineManifest } from "@crxjs/vite-plugin";
import pkg from "../package.json" with { type: "json" };

export default defineManifest({
  manifest_version: 3,
  name: "AI New Tab",
  version: pkg.version,
  description: "Yapay zeka destekli yeni sekme: hızlı sorular, web'de arama ve e-posta özetleri.",
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
  ],
  oauth2: {
    client_id: "496477408238-2lp9kq5762lea1f0tju4vgi2lphulhdc.apps.googleusercontent.com",
    scopes: ["https://www.googleapis.com/auth/gmail.readonly"],
  },
});
