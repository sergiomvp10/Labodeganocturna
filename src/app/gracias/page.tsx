"use client";

import { CheckCircle, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GraciasContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("pedido") || "";

  return (
    <div className="fixed inset-0 z-[200] bg-brand-black flex items-center justify-center px-6 py-10 overflow-y-auto">
      <div className="w-full max-w-sm text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={44} className="text-green-500" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-brand-text mb-2 px-2">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-brand-muted text-sm sm:text-base mb-6 px-2 leading-relaxed">
          Tu pedido está siendo preparado. Te contactaremos pronto para coordinar la entrega.
        </p>

        {orderId && (
          <div className="bg-brand-dark2 rounded-2xl border border-brand-gold/15 px-6 py-4 mb-6 mx-auto">
            <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-1">Número de pedido</p>
            <p className="text-lg font-bold text-brand-gold font-mono">{orderId}</p>
          </div>
        )}

        <div className="space-y-3 px-2">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-brand-gold to-yellow-500 text-brand-black font-bold rounded-2xl hover:from-yellow-500 hover:to-brand-gold transition-all text-sm tracking-wide shadow-lg shadow-brand-gold/20"
          >
            <ArrowLeft size={16} />
            Volver a la tienda
          </Link>

          <a
            href="https://wa.me/57"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-dark2 text-brand-text font-bold rounded-2xl border border-brand-gold/20 hover:border-brand-gold/40 transition-all text-sm"
          >
            <Phone size={16} className="text-green-400" />
            Contactar por WhatsApp
          </a>
        </div>

        <p className="text-brand-muted/40 text-[10px] mt-8">
          La Bodega Nocturna 23 · Licorería a domicilio
        </p>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 z-[200] bg-brand-black flex items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/30 flex items-center justify-center mx-auto">
          <CheckCircle size={44} className="text-green-500" />
        </div>
      </div>
    }>
      <GraciasContent />
    </Suspense>
  );
}
