"use client";

import { useRef, useState, useCallback, useSyncExternalStore } from "react";
import { ChevronRight, Check, MapPin } from "lucide-react";
import { useCity } from "@/context/CityContext";
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
  const [step, setStep] = useState<Step>("age");
  const [dragging, setDragging] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const [sliderCompleted, setSliderCompleted] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
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
    <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
        <div className="bg-brand-red rounded-lg p-3 inline-block mb-4">
          <span className="text-white font-bold text-2xl">LBN</span>
        </div>
        <h2 className="text-2xl font-bold text-brand-text mb-2">
          La Bodega Nocturna
        </h2>

        {step === "age" && (
          <>
            <p className="text-brand-muted text-sm mb-6">
              Para ingresar a este sitio debes ser mayor de 18 años.
            </p>

            <div
              ref={trackRef}
              className="relative h-14 rounded-full overflow-hidden select-none touch-none mx-auto"
              style={{
                background: sliderCompleted
                  ? "linear-gradient(90deg, #16a34a, #22c55e)"
                  : `linear-gradient(90deg, #a31621 ${progress * 100}%, #e5e7eb ${progress * 100}%)`,
                transition: sliderCompleted ? "background 0.4s ease" : undefined,
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
            >
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                style={{ opacity: sliderCompleted ? 0 : 1 - progress * 1.5 }}
              >
                <div className="flex items-center gap-1 text-sm font-semibold text-gray-500">
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
                  backgroundColor: sliderCompleted ? "#16a34a" : "#a31621",
                }}
                onPointerDown={handlePointerDown}
              >
                {sliderCompleted ? (
                  <Check size={24} className="text-white" strokeWidth={3} />
                ) : (
                  <ChevronRight size={24} className="text-white" />
                )}
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-5">
              El consumo de alcohol es perjudicial para la salud.
              Prohíbase la venta a menores de edad.
            </p>
          </>
        )}

        {step === "city" && (
          <>
            <div className="flex items-center justify-center gap-2 mb-2">
              <MapPin size={22} className="text-brand-red" />
              <p className="text-brand-muted text-base font-semibold">
                Escoge tu ciudad
              </p>
            </div>
            <p className="text-brand-muted text-sm mb-6">
              Entregamos a domicilio en las siguientes ciudades:
            </p>

            <div className="space-y-3">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  onMouseEnter={() => setHoveredCity(city)}
                  onMouseLeave={() => setHoveredCity(null)}
                  className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 cursor-pointer"
                  style={{
                    borderColor: hoveredCity === city ? "#a31621" : "#e5e7eb",
                    backgroundColor: hoveredCity === city ? "#fef2f2" : "#ffffff",
                    transform: hoveredCity === city ? "scale(1.02)" : "scale(1)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{
                        backgroundColor: hoveredCity === city ? "#a31621" : "#f3f4f6",
                      }}
                    >
                      <MapPin
                        size={20}
                        style={{
                          color: hoveredCity === city ? "#ffffff" : "#6b7280",
                        }}
                      />
                    </div>
                    <span className="font-semibold text-brand-text text-base">
                      {city}
                    </span>
                  </div>
                  <ChevronRight
                    size={20}
                    style={{
                      color: hoveredCity === city ? "#a31621" : "#9ca3af",
                    }}
                  />
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-400 mt-5">
              Servicio a domicilio 23 horas al día
            </p>
          </>
        )}
      </div>
    </div>
  );
}
