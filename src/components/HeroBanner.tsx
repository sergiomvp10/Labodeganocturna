"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1600&h=600&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1600&h=600&fit=crop",
  },
  {
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=1600&h=600&fit=crop",
  },
];

export default function HeroBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 1) % slides.length);

  return (
    <section className="w-full px-6 sm:px-10 lg:px-16 py-4 bg-brand-black">
      <div className="relative w-full overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={i} className="min-w-full relative" style={{ aspectRatio: "2.8/1" }}>
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-black/20" />
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
    </section>
  );
}
