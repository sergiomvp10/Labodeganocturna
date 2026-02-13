"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1600&h=700&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1600&h=700&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=1600&h=700&fit=crop",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="relative w-full overflow-hidden bg-brand-black">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="min-w-full relative" style={{ aspectRatio: "16/7" }}>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ))}
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-brand-gold/40 text-white p-2.5 rounded-full transition-colors cursor-pointer z-20"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-brand-gold/40 text-white p-2.5 rounded-full transition-colors cursor-pointer z-20"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${
              i === current ? "bg-brand-gold" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
