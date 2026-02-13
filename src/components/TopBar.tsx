"use client";

import { MapPin, Clock, Phone } from "lucide-react";
import { useCity } from "@/context/CityContext";

export default function TopBar() {
  const { selectedCity, setIsCityModalOpen } = useCity();

  return (
    <div className="bg-brand-darker text-white text-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="flex items-center gap-1 hover:text-brand-gold transition-colors cursor-pointer"
          >
            <MapPin size={14} />
            <span>Entrega en: <strong>{selectedCity}</strong></span>
          </button>
          <div className="hidden md:flex items-center gap-1 text-gray-300">
            <Clock size={14} />
            <span>Abierto 23 horas al día</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-gray-300">
          <Phone size={14} />
          <span className="hidden sm:inline">Línea de pedidos: </span>
          <strong className="text-white">300 123 4567</strong>
        </div>
      </div>
    </div>
  );
}
