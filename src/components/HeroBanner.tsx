"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Truck, Clock, MapPin } from "lucide-react";

const slides = [
  {
    title: "Tu licorería de confianza",
    subtitle: "Servicio a domicilio 23 horas al día",
    cta: "Ver Catálogo",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&h=500&fit=crop",
  },
  {
    title: "Ofertas Exclusivas",
    subtitle: "Los mejores precios en whiskys y rones premium",
    cta: "Ver Ofertas",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1200&h=500&fit=crop",
  },
  {
    title: "Variedad Premium",
    subtitle: "Las mejores marcas nacionales e importadas",
    cta: "Explorar",
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=1200&h=500&fit=crop",
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
    <section>
      <div className="relative overflow-hidden bg-brand-black">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="min-w-full relative h-64 sm:h-80 md:h-96 lg:h-[28rem]"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30" />
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-6 md:px-10 w-full">
                  <div className="max-w-lg">
                    <div className="w-12 h-0.5 bg-brand-gold mb-4" />
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-brand-muted text-sm sm:text-base md:text-lg mb-8 tracking-wide">
                      {slide.subtitle}
                    </p>
                    <button className="bg-brand-gold hover:bg-brand-gold-light text-brand-black font-bold py-3 px-10 text-sm uppercase tracking-widest transition-colors cursor-pointer">
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-brand-gold/30 text-white p-2 rounded-full transition-colors cursor-pointer z-20 border border-white/20"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-brand-gold/30 text-white p-2 rounded-full transition-colors cursor-pointer z-20 border border-white/20"
        >
          <ChevronRight size={20} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-8 h-1 rounded-full transition-colors cursor-pointer ${
                i === current ? "bg-brand-gold" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="bg-brand-dark border-b border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Truck size={24} className="text-brand-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-brand-text">Domicilio Gratis</p>
              <p className="text-xs text-brand-muted">En pedidos mayores a $50.000</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <Clock size={24} className="text-brand-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-brand-text">23 Horas al Día</p>
              <p className="text-xs text-brand-muted">Servicio casi las 24 horas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-end">
            <MapPin size={24} className="text-brand-gold shrink-0" />
            <div>
              <p className="font-bold text-sm text-brand-text">3 Ciudades</p>
              <p className="text-xs text-brand-muted">Duitama, Tunja y Sogamoso</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
