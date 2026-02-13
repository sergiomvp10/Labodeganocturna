"use client";

import { MapPin, Clock, Phone, Mail, Facebook, Instagram, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-brand-black text-brand-muted border-t border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <img
              src="/logo.jpg"
              alt="La Bodega Nocturna 23"
              className="h-14 mb-4"
            />
            <p className="text-sm text-brand-muted mb-4">
              Tu licorería de confianza con servicio a domicilio 23 horas al día.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-white/5 border border-brand-gold/20 rounded-full flex items-center justify-center hover:bg-brand-gold/20 hover:border-brand-gold/40 transition-colors"
              >
                <Facebook size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/5 border border-brand-gold/20 rounded-full flex items-center justify-center hover:bg-brand-gold/20 hover:border-brand-gold/40 transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 bg-white/5 border border-brand-gold/20 rounded-full flex items-center justify-center hover:bg-brand-gold/20 hover:border-brand-gold/40 transition-colors"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-brand-gold font-bold text-xs uppercase tracking-widest mb-4">
              Categorías
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#whisky" className="hover:text-brand-gold transition-colors">
                  Whisky
                </Link>
              </li>
              <li>
                <Link href="/#tequila" className="hover:text-brand-gold transition-colors">
                  Tequila
                </Link>
              </li>
              <li>
                <Link href="/#ron" className="hover:text-brand-gold transition-colors">
                  Ron
                </Link>
              </li>
              <li>
                <Link href="/#cerveza" className="hover:text-brand-gold transition-colors">
                  Cerveza
                </Link>
              </li>
              <li>
                <Link href="/#vino" className="hover:text-brand-gold transition-colors">
                  Vino
                </Link>
              </li>
              <li>
                <Link href="/#aguardiente" className="hover:text-brand-gold transition-colors">
                  Aguardiente
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-brand-gold font-bold text-xs uppercase tracking-widest mb-4">
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
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-brand-gold font-bold text-xs uppercase tracking-widest mb-4">
              Contacto
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="shrink-0 mt-0.5 text-brand-gold" />
                <span>Duitama, Tunja y Sogamoso - Boyacá, Colombia</span>
              </li>
              <li className="flex items-center gap-2">
                <Clock size={14} className="shrink-0 text-brand-gold" />
                <span>Abierto 23 horas al día</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-brand-gold" />
                <span>300 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-brand-gold" />
                <span>info@labodeganocturna.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-brand-gold/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-brand-muted/60">
            © 2025 La Bodega Nocturna 23. Todos los derechos reservados.
          </p>
          <p className="text-xs text-brand-muted/60">
            Prohibida la venta de bebidas alcohólicas a menores de 18 años.
          </p>
        </div>
      </div>
    </footer>
  );
}
