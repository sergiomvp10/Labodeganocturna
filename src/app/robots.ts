import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seoKeywords";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    // Sin Disallow a proposito: /admin, /gracias y /configuracion llevan noindex en
    // su metadata, y bloquear el rastreo impediria que Google lea ese noindex y las
    // saque del indice (asi quedo /admin indexado en Bing).
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  };
}
