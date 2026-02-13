"use client";

import { useCity } from "@/context/CityContext";
import { MapPin, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { selectedCity, setIsCityModalOpen } = useCity();

  return (
    <header className="bg-brand-dark sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between py-2 border-b border-brand-gold/10">
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <MapPin size={18} className="text-brand-muted" />
            <span className="text-sm font-semibold tracking-wide text-brand-text uppercase">
              {selectedCity}
            </span>
            <ChevronDown size={16} className="text-brand-muted" />
          </button>
        </div>

        <div className="flex items-center justify-center py-4 md:py-6">
          <Link href="/">
            <img
              src="/logo.png"
              alt="La Bodega Nocturna 23"
              className="h-20 md:h-28 lg:h-32 w-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
