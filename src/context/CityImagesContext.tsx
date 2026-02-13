"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface CityImageData {
  [city: string]: string;
}

const DEFAULT_IMAGES: CityImageData = {
  Duitama: "/images/duitama.jpg",
  Tunja: "https://picsum.photos/seed/tunja/800/400",
  Sogamoso: "https://picsum.photos/seed/sogamoso/800/400",
};

interface CityImagesContextType {
  cityImages: CityImageData;
  updateCityImage: (city: string, imageUrl: string) => void;
  resetCityImage: (city: string) => void;
}

const CityImagesContext = createContext<CityImagesContextType | undefined>(undefined);

function loadSavedImages(): CityImageData {
  if (typeof window === "undefined") return DEFAULT_IMAGES;
  try {
    const saved = localStorage.getItem("city-images");
    if (saved) {
      return { ...DEFAULT_IMAGES, ...JSON.parse(saved) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_IMAGES;
}

export function CityImagesProvider({ children }: { children: ReactNode }) {
  const [cityImages, setCityImages] = useState<CityImageData>(loadSavedImages);

  const updateCityImage = useCallback((city: string, imageUrl: string) => {
    setCityImages((prev) => {
      const updated = { ...prev, [city]: imageUrl };
      localStorage.setItem("city-images", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const resetCityImage = useCallback((city: string) => {
    setCityImages((prev) => {
      const updated = { ...prev, [city]: DEFAULT_IMAGES[city] || "" };
      localStorage.setItem("city-images", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <CityImagesContext.Provider value={{ cityImages, updateCityImage, resetCityImage }}>
      {children}
    </CityImagesContext.Provider>
  );
}

export function useCityImages() {
  const context = useContext(CityImagesContext);
  if (!context) {
    throw new Error("useCityImages must be used within a CityImagesProvider");
  }
  return context;
}

export { DEFAULT_IMAGES };
