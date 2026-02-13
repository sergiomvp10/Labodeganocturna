"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Truck, Clock, MapPin } from "lucide-react";

const slides = [
  {
    title: "Tu licorería favorita a domicilio",
    subtitle: "Servicio 23 horas al día en Duitama, Tunja y Sogamoso",
    cta: "Ver Catálogo",
    bg: "from-brand-dark to-brand-red",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200&h=500&fit=crop",
  },
  {
    title: "Ofertas de la Semana",
    subtitle: "Hasta 20% de descuento en whiskys y rones seleccionados",
    cta: "Ver Ofertas",
    bg: "from-brand-red to-brand-dark",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=1200&h=500&fit=crop",
  },
  {
    title: "Cervezas Bien Frías",
    subtitle: "Las mejores marcas nacionales e importadas a tu puerta",
    cta: "Comprar Ahora",
    bg: "from-brand-darker to-brand-red",
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
      <div className="relative overflow-hidden bg-brand-dark">
        <div
          className="flex transition-transform duration-500 ease-in-out"
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
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative z-10 h-full flex items-center">
                <div className="max-w-7xl mx-auto px-4 w-full">
                  <div className="max-w-lg">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                      {slide.title}
                    </h2>
                    <p className="text-gray-200 text-base sm:text-lg md:text-xl mb-6">
                      {slide.subtitle}
                    </p>
                    <button className="bg-brand-red hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md text-sm md:text-base transition-colors cursor-pointer">
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
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors cursor-pointer z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors cursor-pointer z-20"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
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
      </div>

      <div className="bg-brand-light border-b border-brand-gray">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Truck size={28} className="text-brand-red shrink-0" />
            <div>
              <p className="font-bold text-sm text-brand-text">Domicilio Gratis</p>
              <p className="text-xs text-brand-muted">En pedidos mayores a $50.000</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center">
            <Clock size={28} className="text-brand-red shrink-0" />
            <div>
              <p className="font-bold text-sm text-brand-text">23 Horas al Día</p>
              <p className="text-xs text-brand-muted">Servicio casi las 24 horas</p>
            </div>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-end">
            <MapPin size={28} className="text-brand-red shrink-0" />
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
