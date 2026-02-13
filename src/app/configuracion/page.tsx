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
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div className="flex items-center gap-2">
          <Settings size={24} className="text-brand-red" />
          <h1 className="text-2xl font-bold text-brand-text">Configuración</h1>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-brand-text mb-1 flex items-center gap-2">
          <MapPin size={20} className="text-brand-red" />
          Fotos de Ciudades
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Estas fotos se muestran en la pantalla de selección de ciudad al ingresar al sitio.
          Sube imágenes horizontales (16:9 recomendado) para mejor visualización.
        </p>

        <div className="space-y-6">
          {cities.map((city) => {
            const isDefault = cityImages[city] === DEFAULT_IMAGES[city];
            const justSaved = savedCity === city;

            return (
              <div key={city} className="border border-gray-200 rounded-xl overflow-hidden">
                <div className="relative" style={{ aspectRatio: "16/7" }}>
                  <img
                    src={cityImages[city]}
                    alt={city}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <MapPin size={16} className="text-white" />
                    <span className="text-white font-bold text-base">{city.toUpperCase()}</span>
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between bg-gray-50">
                  <div className="flex items-center gap-2">
                    {justSaved && (
                      <span className="flex items-center gap-1 text-green-600 text-sm font-medium animate-pulse">
                        <Check size={16} />
                        Guardado
                      </span>
                    )}
                    {!justSaved && !isDefault && (
                      <span className="text-xs text-gray-400">Imagen personalizada</span>
                    )}
                    {!justSaved && isDefault && (
                      <span className="text-xs text-gray-400">Imagen por defecto</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!isDefault && (
                      <button
                        onClick={() => handleReset(city)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                      >
                        <RotateCcw size={14} />
                        Restaurar
                      </button>
                    )}
                    <button
                      onClick={() => fileInputRefs.current[city]?.click()}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg text-white transition-colors cursor-pointer"
                      style={{ backgroundColor: "#a31621" }}
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

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>Nota:</strong> Las imágenes se guardan en el navegador (localStorage).
          Si limpias los datos del navegador, las fotos volverán a las imágenes por defecto.
          Para imágenes permanentes, usa un servicio de almacenamiento externo.
        </p>
      </div>
    </div>
  );
}
