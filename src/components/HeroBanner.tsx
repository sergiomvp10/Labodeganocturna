"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSiteConfig } from "@/context/SiteConfigContext";

const DEFAULT_SLIDES = [
  { image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&h=500&fit=crop" },
  { image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1200&h=500&fit=crop" },
  { image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=1200&h=500&fit=crop" },
];

export default function HeroBanner() {
  const { banners } = useSiteConfig();
  const [current, setCurrent] = useState(0);

  const activeBanners = banners.filter((b) => b.active);
  const slides = activeBanners.length > 0
    ? activeBanners.sort((a, b) => a.order - b.order).map((b) => ({ image: b.image }))
    : DEFAULT_SLIDES;

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    if (current >= slides.length) setCurrent(0);
  }, [slides.length, current]);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="w-full py-5 bg-brand-black flex justify-center">
      <div className="w-[78%] max-w-[1200px]">
        <div className="relative w-full overflow-hidden rounded-2xl">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div key={i} className="min-w-full">
                <img
                  src={slide.image}
                  alt=""
                  className="w-full h-auto block"
                />
              </div>
            ))}
          </div>

          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-brand-gold/40 text-white p-2 rounded-full transition-colors cursor-pointer z-20"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-brand-gold/40 text-white p-2 rounded-full transition-colors cursor-pointer z-20"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex justify-center gap-2.5 mt-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2.5 h-2.5 rounded-full transition-colors cursor-pointer ${
                i === current ? "bg-brand-gold" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
