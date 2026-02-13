"use client";

import { MapPin, Clock, Phone } from "lucide-react";
import { useCity } from "@/context/CityContext";

export default function TopBar() {
  const { selectedCity, setIsCityModalOpen } = useCity();

  return (
    <div className="bg-brand-black text-brand-muted text-xs border-b border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-9">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="flex items-center gap-1.5 hover:text-brand-gold transition-colors cursor-pointer"
          >
            <MapPin size={12} className="text-brand-gold" />
            <span>Entrega en: <strong className="text-brand-gold">{selectedCity}</strong></span>
          </button>
          <div className="hidden md:flex items-center gap-1.5">
            <Clock size={12} className="text-brand-gold" />
            <span>Abierto 23 horas al día</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Phone size={12} className="text-brand-gold" />
          <span className="hidden sm:inline">Línea de pedidos: </span>
          <strong className="text-brand-gold">300 123 4567</strong>
        </div>
      </div>
    </div>
  );
}
