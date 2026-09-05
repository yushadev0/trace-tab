import type { EmailCardDto, EmailSummaryInput } from "../../shared/types";

export type EmailCard = EmailCardDto & { id: string };

const PRIORITIES: EmailCardDto["priority"][] = ["düşük", "orta", "yüksek"];

export function buildDigestPrompt(emails: EmailSummaryInput[]): string {
  const list = emails
    .map((e, i) => `${i + 1}. Kimden: ${e.from}\nTarih: ${e.date}\nHam içerik: ${e.snippet}`)
    .join("\n\n");

  return `Aşağıda gelen kutusundaki en son ${emails.length} e-postanın bilgileri var:

${list}

Her e-posta için tam olarak şu alanları içeren bir JSON dizisi üret (dizi uzunluğu ${emails.length} olmalı, sırayı koru):
- "date": tarih, kısa ve okunabilir bir biçimde (örn. "4 Eyl, 14:32")
- "priority": sadece "düşük", "orta" veya "yüksek" değerlerinden biri — e-postanın aciliyetine/önemine göre
- "summary": 1-2 cümlelik Türkçe özet

Yalnızca JSON dizisini döndür, başka açıklama ekleme.`;
}

export function parseDigest(raw: string, emails: EmailSummaryInput[]): EmailCard[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item, i) => {
      const priority = PRIORITIES.includes(item?.priority) ? (item.priority as EmailCardDto["priority"]) : "orta";
      const source = emails[i];
      return {
        id: source?.id ?? String(i),
        provider: source?.provider ?? "gmail",
        // "from" her zaman kaynağın kendi başlığından gelir; modelin yeniden
        // biçimlendirmesine güvenilmiyor (bazı e-postalarda adresi düşürüyordu).
        from: source?.from ?? "(bilinmiyor)",
        date: typeof item?.date === "string" && item.date ? item.date : source?.date ?? "",
        priority,
        summary: typeof item?.summary === "string" ? item.summary : "",
      };
    });
  } catch {
    return [];
  }
}
