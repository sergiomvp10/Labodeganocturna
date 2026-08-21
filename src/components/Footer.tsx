"use client";

import { Instagram, Facebook } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";

export default function Footer() {
  const { footerConfig } = useSiteConfig();

  return (
    <footer className="bg-brand-dark border-t border-brand-gold/10">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-12">
        <div className="flex flex-col items-center mb-10">
          <img
            src="/logo.png"
            alt="La Bodega Nocturna 23"
            className="h-24 md:h-32 w-auto mb-4"
          />
          <p className="text-brand-muted text-sm text-center max-w-md">
            {footerConfig.description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-4 mb-6">
          <a
            href="https://www.instagram.com/labodega23.col?igsh=NGx4bDJ3MWRmbjVm"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold hover:bg-brand-gold/20 transition-colors"
          >
            <Instagram size={20} />
          </a>
          <a
            href="https://www.facebook.com/share/17yxhCYN2C/?mibextid=wwXIfr"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold hover:bg-brand-gold/20 transition-colors"
          >
            <Facebook size={20} />
          </a>
        </div>

        <div className="border-t border-brand-gold/10 pt-6 text-center">
          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} La Bodega Nocturna 23. Todos los derechos reservados.
          </p>
          <p className="text-[10px] text-brand-muted/50 mt-2">
            Prohibida la venta de alcohol a menores de 18 años. El exceso de alcohol es perjudicial para la salud.
          </p>
        </div>
      </div>
    </footer>
  );
}
