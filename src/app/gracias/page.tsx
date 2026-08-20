"use client";

import { CheckCircle, ArrowLeft, Phone } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { LastOrder, loadLastOrder, buildOrderWhatsAppMessage } from "@/lib/lastOrder";

const WHATSAPP_NUMBER = "573112260769";

function GraciasContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("pedido") || "";
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    if (orderId) setOrder(loadLastOrder(orderId));
  }, [orderId]);

  const whatsappHref = order
    ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderWhatsAppMessage(order))}`
    : `https://wa.me/${WHATSAPP_NUMBER}${
        orderId ? `?text=${encodeURIComponent(`Hola, quiero consultar mi pedido #${orderId}`)}` : ""
      }`;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "384px", textAlign: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px auto" }}>
          <CheckCircle size={44} color="#22c55e" />
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#f5f5f5", marginBottom: "8px" }}>
          ¡Gracias por tu compra!
        </h1>
        <p style={{ color: "#999", fontSize: "14px", marginBottom: "24px", lineHeight: "1.6" }}>
          Tu pedido está siendo preparado. Te contactaremos pronto para coordinar la entrega.
        </p>

        {orderId && (
          <div style={{ backgroundColor: "#1a1a1a", borderRadius: "16px", border: "1px solid rgba(201,168,76,0.15)", padding: "16px 24px", marginBottom: "24px" }}>
            <p style={{ fontSize: "10px", color: "#999", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "4px" }}>Número de pedido</p>
            <p style={{ fontSize: "18px", fontWeight: "bold", color: "#c9a84c", fontFamily: "monospace" }}>{orderId}</p>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Link
            href="/"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "14px 0", background: "linear-gradient(to right, #c9a84c, #eab308)", color: "#0a0a0a", fontWeight: "bold", borderRadius: "16px", fontSize: "14px", textDecoration: "none" }}
          >
            <ArrowLeft size={16} />
            Volver a la tienda
          </Link>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "14px 0", backgroundColor: "#1a1a1a", color: "#f5f5f5", fontWeight: "bold", borderRadius: "16px", border: "1px solid rgba(201,168,76,0.2)", fontSize: "14px", textDecoration: "none" }}
          >
            <Phone size={16} color="#4ade80" />
            Contactar por WhatsApp
          </a>
        </div>

        <p style={{ color: "rgba(153,153,153,0.4)", fontSize: "10px", marginTop: "32px" }}>
          La Bodega Nocturna 23 · Licorería a domicilio
        </p>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense fallback={
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: "#0a0a0a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "rgba(34,197,94,0.15)", border: "2px solid rgba(34,197,94,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CheckCircle size={44} color="#22c55e" />
        </div>
      </div>
    }>
      <GraciasContent />
    </Suspense>
  );
}
