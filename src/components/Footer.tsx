"use client";

import { MapPin, Clock, Phone, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-darker text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-brand-red rounded-lg p-2">
                <span className="text-white font-bold text-lg">LBN</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">
                  La Bodega
                </h3>
                <p className="text-brand-gold text-sm font-medium -mt-1">
                  Nocturna
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Tu licorería de confianza con servicio a domicilio 23 horas al día.
              Los mejores licores, vinos y cervezas a tu puerta.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-red transition-colors"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-4">
              Categorías
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#licores" className="hover:text-brand-gold transition-colors">
                  Licores
                </Link>
              </li>
              <li>
                <Link href="/#vinos" className="hover:text-brand-gold transition-colors">
                  Vinos
                </Link>
              </li>
              <li>
                <Link href="/#cervezas" className="hover:text-brand-gold transition-colors">
                  Cervezas
                </Link>
              </li>
              <li>
                <Link href="/#cocteles" className="hover:text-brand-gold transition-colors">
                  Cocteles
                </Link>
              </li>
              <li>
                <Link href="/#snacks" className="hover:text-brand-gold transition-colors">
                  Snacks y Acompañamientos
                </Link>
              </li>
              <li>
                <Link href="/#accesorios" className="hover:text-brand-gold transition-colors">
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-4">
              Información
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  Política de Entregas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  Política de Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brand-gold transition-colors">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wide mb-4">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="shrink-0 mt-0.5 text-brand-gold" />
                <span>Duitama, Tunja y Sogamoso - Boyacá, Colombia</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={16} className="shrink-0 text-brand-gold" />
                <span>Abierto 23 horas al día</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-brand-gold" />
                <span>300 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-brand-gold" />
                <span>info@labodeganocturna.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © 2025 La Bodega Nocturna. Todos los derechos reservados.
          </p>
          <p className="text-xs text-gray-500">
            Prohibida la venta de bebidas alcohólicas a menores de 18 años.
          </p>
        </div>
      </div>
    </footer>
  );
}
