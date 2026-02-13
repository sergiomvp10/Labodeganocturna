"use client";

import { X, MapPin, Check } from "lucide-react";
import { useCity } from "@/context/CityContext";
import { cities } from "@/data/products";

export default function CityModal() {
  const { selectedCity, setSelectedCity, isCityModalOpen, setIsCityModalOpen } =
    useCity();

  if (!isCityModalOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsCityModalOpen(false)}
      />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl z-50 w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <MapPin size={22} className="text-brand-red" />
            <h2 className="font-bold text-lg text-brand-text">
              Selecciona tu Ciudad
            </h2>
          </div>
          <button
            onClick={() => setIsCityModalOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <X size={22} />
          </button>
        </div>
        <p className="text-sm text-brand-muted mb-4">
          Entregamos a domicilio en las siguientes ciudades:
        </p>
        <div className="space-y-2">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => {
                setSelectedCity(city);
                setIsCityModalOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-colors cursor-pointer ${
                selectedCity === city
                  ? "border-brand-red bg-red-50 text-brand-red"
                  : "border-gray-200 hover:border-brand-red hover:bg-red-50/50 text-brand-text"
              }`}
            >
              <span className="font-medium">{city}</span>
              {selectedCity === city && <Check size={18} />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
