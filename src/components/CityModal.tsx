"use client";

import { useCity } from "@/context/CityContext";
import { useCityImages } from "@/context/CityImagesContext";
import { X } from "lucide-react";
import { cities, isCityEnabled } from "@/data/products";

export default function CityModal() {
  const { selectedCity, setSelectedCity, isCityModalOpen, setIsCityModalOpen, hasSelectedCity } = useCity();
  const { cityImages } = useCityImages();

  const showModal = isCityModalOpen || !hasSelectedCity;

  if (!showModal) return null;

  const handleSelect = (city: string) => {
    if (!isCityEnabled(city)) return;
    setSelectedCity(city);
    setIsCityModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-brand-black/95 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center mb-4 md:mb-14">
          <img
            src="/logo.png"
            alt="La Bodega Nocturna 23"
            className="h-16 md:h-36 w-auto mb-3 md:mb-6"
          />
          <h2 className="text-xl md:text-3xl font-bold text-brand-text">
            Selecciona tu ciudad
          </h2>
        </div>

        {hasSelectedCity && (
          <button
            onClick={() => setIsCityModalOpen(false)}
            className="absolute top-0 right-6 text-brand-muted hover:text-brand-gold cursor-pointer"
          >
            <X size={24} />
          </button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-5">
          {cities.map((city) => {
            const enabled = isCityEnabled(city);
            return (
              <button
                key={city}
                onClick={() => handleSelect(city)}
                disabled={!enabled}
                aria-disabled={!enabled}
                title={enabled ? undefined : `Próximamente en ${city}`}
                className={`group relative overflow-hidden rounded-lg md:rounded-xl transition-all duration-300 border-2 ${
                  !enabled
                    ? "cursor-not-allowed border-brand-gold/10"
                    : selectedCity === city && hasSelectedCity
                      ? "cursor-pointer border-brand-gold shadow-lg shadow-brand-gold/20"
                      : "cursor-pointer border-brand-gold/10 hover:border-brand-gold/40"
                }`}
              >
                <div className="aspect-[5/2] md:aspect-[4/3] overflow-hidden">
                  <img
                    src={cityImages[city] || `https://picsum.photos/seed/${city.toLowerCase()}/400/300`}
                    alt={city}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      enabled ? "group-hover:scale-110" : "grayscale opacity-50"
                    }`}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                {!enabled && (
                  <span className="absolute top-2 left-2 md:top-3 md:left-3 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-2.5 md:py-1 rounded tracking-wider uppercase">
                    Próximamente
                  </span>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 text-center">
                  <h3
                    className={`text-lg md:text-2xl font-bold tracking-wider uppercase ${
                      enabled ? "text-white" : "text-white/60"
                    }`}
                  >
                    {city}
                  </h3>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
