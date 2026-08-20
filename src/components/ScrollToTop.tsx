"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Deja cada navegacion arriba del todo, incluso si el contenido cambia de alto al cargar. */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    const toTop = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    toTop();
    const raf = requestAnimationFrame(toTop);
    const timer = setTimeout(toTop, 200);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [pathname]);

  return null;
}
