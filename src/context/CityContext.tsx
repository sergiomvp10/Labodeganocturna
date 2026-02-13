"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cities } from "@/data/products";

interface CityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isCityModalOpen: boolean;
  setIsCityModalOpen: (open: boolean) => void;
  hasSelectedCity: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState(cities[0]);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [hasSelectedCity, setHasSelectedCity] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("selected-city");
      if (saved) {
        setSelectedCityState(saved);
        setHasSelectedCity(true);
      }
    }
  }, []);

  const setSelectedCity = (city: string) => {
    setSelectedCityState(city);
    setHasSelectedCity(true);
    sessionStorage.setItem("selected-city", city);
  };

  return (
    <CityContext.Provider
      value={{ selectedCity, setSelectedCity, isCityModalOpen, setIsCityModalOpen, hasSelectedCity }}
    >
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) {
    throw new Error("useCity must be used within a CityProvider");
  }
  return context;
}
