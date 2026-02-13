"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { cities } from "@/data/products";

interface CityContextType {
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  isCityModalOpen: boolean;
  setIsCityModalOpen: (open: boolean) => void;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);

  return (
    <CityContext.Provider
      value={{ selectedCity, setSelectedCity, isCityModalOpen, setIsCityModalOpen }}
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
