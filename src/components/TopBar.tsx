"use client";

import { useCity } from "@/context/CityContext";
import { Phone, Truck } from "lucide-react";

export default function TopBar() {
  const { selectedCity } = useCity();

  return (
    <div className="bg-brand-black border-b border-brand-gold/10">
      <div className="w-full px-4 sm:px-8 lg:px-12 py-2 flex items-center justify-between text-[11px] text-brand-muted">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Truck size={12} className="text-brand-gold" />
            Domicilios 23 horas
          </span>
          <span className="hidden sm:flex items-center gap-1">
            <Phone size={12} className="text-brand-gold" />
            +57 300 000 0000
          </span>
        </div>
        <span className="text-brand-gold font-medium">
          {selectedCity}
        </span>
      </div>
    </div>
  );
}
