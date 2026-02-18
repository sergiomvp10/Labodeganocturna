import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import LayoutShell from "@/components/LayoutShell";

const cities = ["Duitama", "Tunja", "Sogamoso"];
const drinks = ["whisky", "ron", "aguardiente", "tequila", "vino", "cerveza", "vodka"];
const extras = ["cigarrillos", "pasabocas", "minibotellas"];

const cityKeywords = cities.flatMap((c) => [
  `licorería a domicilio ${c}`,
  `licorería ${c}`,
  `domicilios de licor ${c}`,
  `licores a domicilio ${c}`,
  `domicilios nocturnos ${c}`,
  `licor a domicilio ${c}`,
  `pedir licor ${c}`,
  `tienda de licores ${c}`,
]);

const drinkKeywords = drinks.flatMap((d) => [
  `${d} a domicilio`,
  `comprar ${d} online`,
  `${d} a domicilio Duitama`,
  `${d} a domicilio Tunja`,
  `${d} a domicilio Sogamoso`,
  `${d} barato Boyacá`,
]);

const extraKeywords = extras.flatMap((e) => [
  `${e} a domicilio`,
  `${e} a domicilio Duitama`,
]);

const brandKeywords = [
  "Old Parr a domicilio", "Buchanan's a domicilio", "Jack Daniels a domicilio",
  "Jose Cuervo a domicilio", "Don Julio a domicilio", "Aguardiente Antioqueño a domicilio",
  "Ron Viejo de Caldas", "Smirnoff a domicilio", "Johnnie Walker a domicilio",
  "Baileys a domicilio", "Absolut a domicilio",
];

const generalKeywords = [
  "licorería nocturna", "La Bodega Nocturna 23", "labodega23",
  "comprar licor online Colombia", "licorería 23 horas",
  "licores baratos Boyacá", "ofertas licores Boyacá",
  "tienda de licores online Colombia", "licorería Boyacá",
  "domicilio de licor nocturno", "licores originales Boyacá",
  "licorería con domicilio gratis", "mejores precios licores Boyacá",
  "licor para fiestas Duitama", "trago a domicilio",
  "bebidas alcohólicas a domicilio", "licor nocturno Boyacá",
];

export const metadata: Metadata = {
  title: "La Bodega Nocturna 23 | Licorería a Domicilio en Duitama, Tunja y Sogamoso",
  description:
    "Licorería a domicilio 23 horas en Duitama, Tunja y Sogamoso. Whisky, tequila, aguardiente, ron, vinos, cervezas, cigarrillos y más. Old Parr, Buchanan's, Jack Daniel's, Don Julio. Entrega rápida, productos 100% originales. Pide ahora por WhatsApp. Los mejores precios de Boyacá.",
  keywords: [...cityKeywords, ...drinkKeywords, ...extraKeywords, ...brandKeywords, ...generalKeywords].join(", "),
  openGraph: {
    title: "La Bodega Nocturna 23 | Licorería a Domicilio 23 Horas en Boyacá",
    description: "Licorería a domicilio en Duitama, Tunja y Sogamoso. Whisky, tequila, aguardiente, ron, vinos, cervezas y cigarrillos. Entrega rápida 23 horas. Los mejores precios.",
    url: "https://www.labodega23.co",
    siteName: "La Bodega Nocturna 23",
    locale: "es_CO",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.labodega23.co",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LiquorStore",
    name: "La Bodega Nocturna 23",
    url: "https://www.labodega23.co",
    description: "Licorería a domicilio 23 horas en Duitama, Tunja y Sogamoso. Whisky, tequila, aguardiente, ron, vinos, cervezas, cigarrillos y más.",
    telephone: "+573112260769",
    areaServed: cities.map((c) => ({
      "@type": "City",
      name: c,
      containedInPlace: { "@type": "AdministrativeArea", name: "Boyacá, Colombia" },
    })),
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:00",
    },
    priceRange: "$$",
    currenciesAccepted: "COP",
    paymentAccepted: "Efectivo, Nequi, Daviplata, Transferencia",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Catálogo de Licores",
      itemListElement: [
        ...drinks.map((d) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: d.charAt(0).toUpperCase() + d.slice(1) } })),
        ...extras.map((e) => ({ "@type": "Offer", itemOffered: { "@type": "Product", name: e.charAt(0).toUpperCase() + e.slice(1) } })),
      ],
    },
    sameAs: ["https://www.instagram.com/labodega23.col", "https://www.facebook.com/share/17yxhCYN2C/"],
  };

  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
