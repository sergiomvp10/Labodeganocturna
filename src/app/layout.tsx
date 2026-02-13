import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import TopBar from "@/components/TopBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartSidebar from "@/components/CartSidebar";
import CityModal from "@/components/CityModal";
import AgeVerification from "@/components/AgeVerification";
import PromoBanner from "@/components/PromoBanner";

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
          <AgeVerification />
          <TopBar />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <PromoBanner />
          <div className="h-10" />
          <CartSidebar />
          <CityModal />
        </Providers>
      </body>
    </html>
  );
}
