import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import LayoutShell from "@/components/LayoutShell";

export const metadata: Metadata = {
  title: "La Bodega Nocturna | Licorería a Domicilio 23 Horas",
  description:
    "Tu licorería de confianza con servicio a domicilio 23 horas al día en Duitama, Tunja y Sogamoso. Licores, vinos, cervezas y más.",
  keywords: "licorería, domicilio, Duitama, Tunja, Sogamoso, licores, vinos, cervezas, aguardiente, whisky",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
