import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedido confirmado | La Bodega Nocturna 23",
  robots: { index: false, follow: false },
};

export default function GraciasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
