"use client";

import { useEffect } from "react";
import { PARTNER_REDIRECT_DELAY_MS } from "@/lib/partners";

export default function PartnerRedirect({ url }: { url: string }) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.href = url;
    }, PARTNER_REDIRECT_DELAY_MS);
    return () => clearTimeout(timeout);
  }, [url]);

  return (
    <div className="fixed inset-0 z-[400] flex flex-col items-center justify-center gap-6 bg-brand-black px-6 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-brand-gold/25 border-t-brand-gold" />
      <p className="text-lg md:text-2xl font-bold tracking-[0.2em] text-brand-gold uppercase">
        Conectándote con nuestro aliado
      </p>
      <a href={url} className="text-sm text-brand-muted underline">
        Continuar ahora
      </a>
    </div>
  );
}
