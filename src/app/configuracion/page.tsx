"use client";

import { useRef, useState } from "react";
import { Upload, RotateCcw, Check, MapPin, ArrowLeft, Settings } from "lucide-react";
import { useCityImages, DEFAULT_IMAGES } from "@/context/CityImagesContext";
import { cities } from "@/data/products";
import Link from "next/link";

export default function ConfiguracionPage() {
  const { cityImages, updateCityImage, resetCityImage } = useCityImages();
  const [savedCity, setSavedCity] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleFileUpload = (city: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === "string") {
        updateCityImage(city, result);
        setSavedCity(city);
        setTimeout(() => setSavedCity(null), 2000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (city: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(city, file);
    }
  };

  const handleReset = (city: string) => {
    resetCityImage(city);
    setSavedCity(city);
    setTimeout(() => setSavedCity(null), 2000);
  };

  return (
    <div className="min-h-screen bg-brand-black">
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link
            href="/"
            className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-dark border border-brand-gold/20 hover:border-brand-gold/40 transition-colors"
          >
            <ArrowLeft size={20} className="text-brand-gold" />
          </Link>
          <div className="flex items-center gap-2">
            <Settings size={24} className="text-brand-gold" />
            <h1 className="text-2xl font-bold text-brand-text">Configuración</h1>
          </div>
        </div>

        <div className="bg-brand-dark rounded-xl border border-brand-gold/10 p-6 mb-6">
          <h2 className="text-lg font-semibold text-brand-text mb-1 flex items-center gap-2">
            <MapPin size={20} className="text-brand-gold" />
            Fotos de Ciudades
          </h2>
          <p className="text-sm text-brand-muted mb-6">
            Estas fotos se muestran en la pantalla de selección de ciudad al ingresar al sitio.
            Sube imágenes horizontales (16:9 recomendado) para mejor visualización.
          </p>

          <div className="space-y-6">
            {cities.map((city) => {
              const isDefault = cityImages[city] === DEFAULT_IMAGES[city];
              const justSaved = savedCity === city;

              return (
                <div key={city} className="border border-brand-gold/10 rounded-xl overflow-hidden">
                  <div className="relative" style={{ aspectRatio: "16/7" }}>
                    <img
                      src={cityImages[city]}
                      alt={city}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-white font-bold text-lg tracking-widest uppercase">{city}</span>
                    </div>
                  </div>

                  <div className="p-4 flex items-center justify-between bg-brand-dark2">
                    <div className="flex items-center gap-2">
                      {justSaved && (
                        <span className="flex items-center gap-1 text-green-400 text-sm font-medium animate-pulse">
                          <Check size={16} />
                          Guardado
                        </span>
                      )}
                      {!justSaved && !isDefault && (
                        <span className="text-xs text-brand-muted">Imagen personalizada</span>
                      )}
                      {!justSaved && isDefault && (
                        <span className="text-xs text-brand-muted">Imagen por defecto</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isDefault && (
                        <button
                          onClick={() => handleReset(city)}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm rounded border border-brand-gold/20 text-brand-muted hover:text-brand-gold hover:border-brand-gold/40 transition-colors cursor-pointer"
                        >
                          <RotateCcw size={14} />
                          Restaurar
                        </button>
                      )}
                      <button
                        onClick={() => fileInputRefs.current[city]?.click()}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm rounded bg-brand-gold hover:bg-brand-gold-light text-brand-black font-medium transition-colors cursor-pointer"
                      >
                        <Upload size={14} />
                        Subir foto
                      </button>
                      <input
                        ref={(el) => { fileInputRefs.current[city] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleInputChange(city, e)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-brand-dark border border-brand-gold/10 rounded-xl p-4">
          <p className="text-sm text-brand-muted">
            <strong className="text-brand-gold">Nota:</strong> Las imágenes se guardan en el navegador (localStorage).
            Si limpias los datos del navegador, las fotos volverán a las imágenes por defecto.
          </p>
        </div>
      </div>
    </div>
  );
}
