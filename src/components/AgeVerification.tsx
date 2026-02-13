"use client";

import { useState, useRef, useCallback, useEffect } from "react";

const THUMB_SIZE = 52;

export default function AgeVerification() {
  const [verified, setVerified] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const v = sessionStorage.getItem("age-verified");
      if (v === "true") {
        setVerified(true);
        setHidden(true);
      }
    }
  }, []);

  const getProgress = useCallback((clientX: number) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const maxX = rect.width - THUMB_SIZE;
    const x = Math.min(Math.max(clientX - rect.left - THUMB_SIZE / 2, 0), maxX);
    return x / maxX;
  }, []);

  const handleStart = useCallback((clientX: number) => {
    if (completed) return;
    dragging.current = true;
    setProgress(getProgress(clientX));
  }, [completed, getProgress]);

  const handleMove = useCallback((clientX: number) => {
    if (!dragging.current || completed) return;
    const p = getProgress(clientX);
    setProgress(p);
    if (p >= 0.85) {
      dragging.current = false;
      setProgress(1);
      setCompleted(true);
      setTimeout(() => {
        sessionStorage.setItem("age-verified", "true");
        setVerified(true);
        setTimeout(() => setHidden(true), 500);
      }, 800);
    }
  }, [completed, getProgress]);

  const handleEnd = useCallback(() => {
    if (!dragging.current || completed) return;
    dragging.current = false;
    setProgress(0);
  }, [completed]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) handleMove(e.touches[0].clientX);
    };
    const onUp = () => handleEnd();
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [handleMove, handleEnd]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center bg-brand-black transition-opacity duration-500 ${
        verified ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-8 px-6 w-full max-w-md">
        <img
          src="/logo.png"
          alt="La Bodega Nocturna 23"
          className="h-32 md:h-40 w-auto"
        />

        <p className="text-brand-muted text-sm text-center">
          Confirma que eres mayor de 18 años deslizando a la derecha
        </p>

        <div
          ref={trackRef}
          className="relative w-full h-14 rounded-full overflow-hidden border border-brand-gold/30 bg-brand-dark2"
        >
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-gold/20 to-brand-gold/40 rounded-full transition-none"
            style={{ width: `${progress * 100}%` }}
          />
          {!completed && (
            <span className="absolute inset-0 flex items-center justify-center text-brand-muted text-sm pointer-events-none select-none">
              Desliza para confirmar →
            </span>
          )}
          {completed && (
            <span className="absolute inset-0 flex items-center justify-center text-green-400 text-sm font-bold pointer-events-none select-none gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#22c55e" />
                <path d="M6 10l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Soy mayor de 18 Años
            </span>
          )}
          <div
            className="absolute top-1/2 -translate-y-1/2 rounded-full bg-brand-gold flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing select-none"
            style={{
              width: THUMB_SIZE,
              height: THUMB_SIZE - 8,
              left: `calc(${progress * 100}% * (1 - ${THUMB_SIZE}px / 100%) + 4px)`,
              ...(completed ? { left: `calc(100% - ${THUMB_SIZE + 4}px)` } : {}),
            }}
            onMouseDown={(e) => handleStart(e.clientX)}
            onTouchStart={(e) => {
              if (e.touches[0]) handleStart(e.touches[0].clientX);
            }}
          >
            <span className="text-brand-black font-bold text-lg">→</span>
          </div>
        </div>

        <p className="text-brand-muted/50 text-[10px] text-center">
          Prohibida la venta de alcohol a menores de 18 años.
        </p>
      </div>
    </div>
  );
}
