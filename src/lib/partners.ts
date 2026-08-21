export const PARTNER_CATEGORIES: Record<string, string> = {
  "musica-en-vivo": "https://musicaenvivo.co",
};

export const PARTNER_REDIRECT_DELAY_MS = 1600;

export const partnerUrl = (slug: string): string | undefined =>
  PARTNER_CATEGORIES[slug];
