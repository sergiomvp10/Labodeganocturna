"use client";

import { useRef, useState, useCallback, useSyncExternalStore } from "react";
import { ChevronRight, Check } from "lucide-react";
import { useCity } from "@/context/CityContext";
import { useCityImages } from "@/context/CityImagesContext";
import { cities } from "@/data/products";

function getSnapshot() {
  return sessionStorage.getItem("onboarding-done") === "true";
}

function getServerSnapshot() {
  return true;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

const SLIDER_THUMB_SIZE = 52;
const COMPLETION_THRESHOLD = 0.85;

type Step = "age" | "city";

export default function AgeVerification() {
  const onboardingDone = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { setSelectedCity } = useCity();
  const { cityImages } = useCityImages();
  const [step, setStep] = useState<Step>("age");
  const [dragging, setDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [sliderCompleted, setSliderCompleted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);

  const getTrackWidth = useCallback(() => {
    if (!trackRef.current) return 300;
    return trackRef.current.clientWidth - SLIDER_THUMB_SIZE;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (sliderCompleted) return;
    setDragging(true);
    startXRef.current = e.clientX - offsetX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [sliderCompleted, offsetX]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || sliderCompleted) return;
    const trackWidth = getTrackWidth();
    const newOffset = Math.min(Math.max(0, e.clientX - startXRef.current), trackWidth);
    setOffsetX(newOffset);
  }, [dragging, sliderCompleted, getTrackWidth]);

  const handlePointerUp = useCallback(() => {
    if (!dragging || sliderCompleted) return;
    setDragging(false);
    const trackWidth = getTrackWidth();
    if (offsetX / trackWidth >= COMPLETION_THRESHOLD) {
      setOffsetX(trackWidth);
      setSliderCompleted(true);
      setTimeout(() => {
        setStep("city");
      }, 1000);
    } else {
      setOffsetX(0);
    }
  }, [dragging, sliderCompleted, offsetX, getTrackWidth]);

  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    sessionStorage.setItem("onboarding-done", "true");
    sessionStorage.setItem("selected-city", city);
    window.dispatchEvent(new Event("storage"));
  };

  if (onboardingDone) return null;

  const trackWidth = getTrackWidth();
  const progress = trackWidth > 0 ? offsetX / trackWidth : 0;

  return (
    <div className="fixed inset-0 bg-brand-black z-[100] flex items-center justify-center p-6">
      <div className="bg-brand-dark border border-brand-gold/30 rounded-2xl shadow-2xl max-w-lg w-full px-10 py-10 text-center">
        <img
          src="/logo.jpg"
          alt="La Bodega Nocturna 23"
          className="h-20 mx-auto mb-6"
        />

        {step === "age" && (
          <>
            <p className="text-brand-muted text-sm mb-8 tracking-wide">
              Para ingresar a este sitio debes ser mayor de 18 años.
            </p>

            <div
              ref={trackRef}
              className="relative h-14 rounded-full overflow-hidden select-none touch-none mx-auto"
              style={{
                background: sliderCompleted
                  ? "linear-gradient(90deg, #16a34a, #22c55e)"
                  : `linear-gradient(90deg, #c9a84c ${progress * 100}%, #2a2a2a ${progress * 100}%)`,
                transition: sliderCompleted ? "background 0.4s ease" : undefined,
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: sliderCompleted ? 0 : 1 - progress * 1.5 }}
              >
                <div className="flex items-center gap-1 text-sm font-semibold text-brand-muted">
                  <span>Desliza para confirmar</span>
                  <ChevronRight size={18} />
                  <ChevronRight size={18} className="-ml-3 opacity-60" />
                </div>
              </div>

              {sliderCompleted && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-pulse">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Check size={22} strokeWidth={3} />
                    <span>Soy mayor de 18 Años</span>
                  </div>
                </div>
              )}

              <div
                className="absolute top-1 left-1 flex items-center justify-center rounded-full shadow-lg cursor-grab active:cursor-grabbing"
                style={{
                  width: SLIDER_THUMB_SIZE - 8,
                  height: SLIDER_THUMB_SIZE - 8,
                  transform: `translateX(${offsetX}px)`,
                  transition: dragging ? "none" : "transform 0.3s ease, background-color 0.3s ease",
                  backgroundColor: sliderCompleted ? "#16a34a" : "#c9a84c",
                }}
                onPointerDown={handlePointerDown}
              >
                {sliderCompleted ? (
                  <Check size={24} className="text-white" strokeWidth={3} />
                ) : (
                  <ChevronRight size={24} className="text-brand-black" />
                )}
              </div>
            </div>

            <p className="text-xs text-brand-muted/60 mt-6">
              El consumo de alcohol es perjudicial para la salud.
              Prohíbase la venta a menores de edad.
            </p>
          </>
        )}

        {step === "city" && (
          <>
            <p className="text-brand-gold text-lg font-semibold mb-1 uppercase tracking-widest">
              Escoge tu ciudad
            </p>
            <p className="text-brand-muted text-sm mb-8">
              Entregamos a domicilio en las siguientes ciudades
            </p>

            <div className="space-y-4 px-2">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="w-full block rounded-xl overflow-hidden relative cursor-pointer group border border-brand-gold/20 hover:border-brand-gold/60 transition-colors"
                  style={{ aspectRatio: "16/7" }}
                >
                  <img
                    src={cityImages[city]}
                    alt={city}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 group-hover:from-black/90" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl md:text-3xl tracking-widest uppercase drop-shadow-lg">
                      {city}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-xs text-brand-muted/60 mt-6">
              Servicio a domicilio 23 horas al día
            </p>
          </>
        )}
      </div>
    </div>
  );
}
