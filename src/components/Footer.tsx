"use client";

import { Phone, Clock, MapPin, Instagram, Facebook } from "lucide-react";
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <MapPin size={18} className="text-brand-gold" />
              <h4 className="text-brand-gold font-bold text-sm uppercase tracking-wider">Ciudades</h4>
            </div>
            <div className="space-y-1 text-sm text-brand-muted">
              {footerConfig.cities.map((city) => (
                <p key={city}>{city}</p>
              ))}
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock size={18} className="text-brand-gold" />
              <h4 className="text-brand-gold font-bold text-sm uppercase tracking-wider">Horario</h4>
            </div>
            <p className="text-sm text-brand-muted">{footerConfig.schedule}</p>
            <p className="text-sm text-brand-muted">{footerConfig.scheduleSub}</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Phone size={18} className="text-brand-gold" />
              <h4 className="text-brand-gold font-bold text-sm uppercase tracking-wider">Contacto</h4>
            </div>
            <p className="text-sm text-brand-muted">WhatsApp: {footerConfig.whatsapp}</p>
          </div>
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
