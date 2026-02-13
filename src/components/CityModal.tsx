"use client";

import { useCity } from "@/context/CityContext";
import { useCityImages } from "@/context/CityImagesContext";
import { X } from "lucide-react";
import { cities } from "@/data/products";

export default function CityModal() {
  const { selectedCity, setSelectedCity, isCityModalOpen, setIsCityModalOpen, hasSelectedCity } = useCity();
  const { cityImages } = useCityImages();

  const showModal = isCityModalOpen || !hasSelectedCity;

  if (!showModal) return null;

  const handleSelect = (city: string) => {
    setSelectedCity(city);
    setIsCityModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-brand-black/95 backdrop-blur-sm">
      <div className="w-full max-w-4xl mx-auto px-6 relative">
        <div className="flex flex-col items-center text-center mb-10">
          <img
            src="/logo.png"
            alt="La Bodega Nocturna 23"
            className="h-28 md:h-36 w-auto mb-6"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => handleSelect(city)}
              className={`group relative overflow-hidden rounded-xl cursor-pointer transition-all duration-300 border-2 ${
                selectedCity === city && hasSelectedCity
                  ? "border-brand-gold shadow-lg shadow-brand-gold/20"
                  : "border-brand-gold/10 hover:border-brand-gold/40"
              }`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={cityImages[city] || `https://picsum.photos/seed/${city.toLowerCase()}/400/300`}
                  alt={city}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-center">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-wider uppercase">
                  {city}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
