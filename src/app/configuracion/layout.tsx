import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración | La Bodega Nocturna 23",
  robots: { index: false, follow: false },
};

export default function ConfiguracionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
