"use client";

import { CheckCircle, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GraciasContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("pedido") || "";

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-8">
          <CheckCircle size={56} className="text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-brand-text mb-3">
          ¡Gracias por tu compra!
        </h1>
        <p className="text-brand-muted text-base mb-8 max-w-sm mx-auto">
          Tu pedido está siendo preparado y alistado para enviarse. Te contactaremos pronto para coordinar la entrega.
        </p>

        {orderId && (
          <div className="bg-brand-dark2 rounded-2xl border border-brand-gold/15 px-8 py-5 mb-8 inline-block">
            <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">Número de pedido</p>
            <p className="text-xl font-bold text-brand-gold">{orderId}</p>
          </div>
        )}

        <div className="space-y-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-brand-gold to-yellow-500 text-brand-black font-bold rounded-2xl hover:from-yellow-500 hover:to-brand-gold transition-all text-base tracking-wide shadow-lg shadow-brand-gold/20"
          >
            <ArrowLeft size={18} />
            Volver a la tienda
          </Link>

          <a
            href="https://wa.me/57"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-brand-dark2 text-brand-text font-bold rounded-2xl border border-brand-gold/20 hover:border-brand-gold/40 transition-all text-base"
          >
            <Phone size={18} className="text-green-400" />
            Contactar por WhatsApp
          </a>
        </div>

        <p className="text-brand-muted/50 text-xs mt-10">
          La Bodega Nocturna 23 · Licorería a domicilio
        </p>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <CheckCircle size={56} className="text-green-500" />
        </div>
      </div>
    }>
      <GraciasContent />
    </Suspense>
  );
}
