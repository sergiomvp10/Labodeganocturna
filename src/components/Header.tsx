"use client";

import { useCity } from "@/context/CityContext";
import { MapPin, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { selectedCity, setIsCityModalOpen } = useCity();

  return (
    <header className="bg-brand-dark sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="relative flex items-center justify-center py-4 md:py-6">
          <button
            onClick={() => setIsCityModalOpen(true)}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <MapPin size={18} className="text-brand-muted" />
            <span className="text-sm font-bold tracking-widest text-brand-text uppercase">
              {selectedCity}
            </span>
          </button>

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
