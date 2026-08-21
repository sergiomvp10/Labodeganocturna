import type { Metadata } from "next";
import type { ReactNode } from "react";
import AdminShell from "./AdminShell";

// robots.txt evita el rastreo, no la indexacion: el meta es lo que saca /admin del indice.
export const metadata: Metadata = {
  title: "Panel de Administración | La Bodega Nocturna 23",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
