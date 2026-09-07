import type { AppLanguage, EmailCardDto, EmailSummaryInput } from "../../shared/types";

export type EmailCard = EmailCardDto & { id: string };

const PRIORITIES: EmailCardDto["priority"][] = ["low", "medium", "high"];

const FIELD_LABELS: Record<AppLanguage, { from: string; date: string; raw: string }> = {
  tr: { from: "Kimden", date: "Tarih", raw: "Ham içerik" },
  en: { from: "From", date: "Date", raw: "Raw content" },
  de: { from: "Von", date: "Datum", raw: "Rohinhalt" },
};

const PROMPT_TEMPLATES: Record<AppLanguage, (count: number, list: string) => string> = {
  tr: (count, list) => `Aşağıda gelen kutusundaki en son ${count} e-postanın bilgileri var:

${list}

Her e-posta için tam olarak şu alanları içeren bir JSON dizisi üret (dizi uzunluğu ${count} olmalı, sırayı koru):
- "date": tarih, kısa ve okunabilir bir biçimde (örn. "4 Eyl, 14:32")
- "priority": sadece "low", "medium" veya "high" değerlerinden biri — e-postanın aciliyetine/önemine göre
- "summary": 1-2 cümlelik Türkçe özet

Yalnızca JSON dizisini döndür, başka açıklama ekleme.`,
  en: (count, list) => `Below is information about the ${count} most recent emails in the inbox:

${list}

For each email, produce a JSON array containing exactly these fields (the array length must be ${count}, keep the order):
- "date": the date, short and readable (e.g. "Sep 4, 14:32")
- "priority": one of "low", "medium" or "high" — based on the email's urgency/importance
- "summary": a 1-2 sentence summary in English

Return only the JSON array, no other explanation.`,
  de: (count, list) => `Nachfolgend Informationen zu den ${count} neuesten E-Mails im Posteingang:

${list}

Erzeuge für jede E-Mail ein JSON-Array mit genau diesen Feldern (die Array-Länge muss ${count} sein, Reihenfolge beibehalten):
- "date": das Datum, kurz und lesbar (z. B. "4. Sep, 14:32")
- "priority": einer der Werte "low", "medium" oder "high" — je nach Dringlichkeit/Wichtigkeit der E-Mail
- "summary": eine Zusammenfassung in 1-2 Sätzen auf Deutsch

Gib nur das JSON-Array zurück, keine weitere Erklärung.`,
};

export function buildDigestPrompt(emails: EmailSummaryInput[], lang: AppLanguage = "tr"): string {
  const labels = FIELD_LABELS[lang] ?? FIELD_LABELS.tr;
  const list = emails
    .map(
      (e, i) => `${i + 1}. ${labels.from}: ${e.from}\n${labels.date}: ${e.date}\n${labels.raw}: ${e.snippet}`,
    )
    .join("\n\n");

  return (PROMPT_TEMPLATES[lang] ?? PROMPT_TEMPLATES.tr)(emails.length, list);
}

export function parseDigest(raw: string, emails: EmailSummaryInput[]): EmailCard[] {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.map((item, i) => {
      const priority = PRIORITIES.includes(item?.priority) ? (item.priority as EmailCardDto["priority"]) : "medium";
      const source = emails[i];
      return {
        id: source?.id ?? String(i),
        provider: source?.provider ?? "gmail",
        accountEmail: source?.accountEmail ?? "",
        link: source?.link ?? "",
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
