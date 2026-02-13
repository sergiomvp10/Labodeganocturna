"use client";

import { Phone, Clock, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark border-t border-brand-gold/10">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <div className="flex flex-col items-center mb-10">
          <img
            src="/logo.png"
            alt="La Bodega Nocturna 23"
            className="h-24 md:h-32 w-auto mb-4"
          />
          <p className="text-brand-muted text-sm text-center max-w-md">
            Tu licorería de confianza con servicio a domicilio 23 horas al día.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <MapPin size={18} className="text-brand-gold" />
              <h4 className="text-brand-gold font-bold text-sm uppercase tracking-wider">Ciudades</h4>
            </div>
            <div className="space-y-1 text-sm text-brand-muted">
              <p>Duitama</p>
              <p>Tunja</p>
              <p>Sogamoso</p>
            </div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Clock size={18} className="text-brand-gold" />
              <h4 className="text-brand-gold font-bold text-sm uppercase tracking-wider">Horario</h4>
            </div>
            <p className="text-sm text-brand-muted">Abierto 23 horas al día</p>
            <p className="text-sm text-brand-muted">Todos los días del año</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Phone size={18} className="text-brand-gold" />
              <h4 className="text-brand-gold font-bold text-sm uppercase tracking-wider">Contacto</h4>
            </div>
            <p className="text-sm text-brand-muted">WhatsApp: +57 300 000 0000</p>
          </div>
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
