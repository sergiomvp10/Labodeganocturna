"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-brand-dark sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="relative flex items-center justify-center py-4 md:py-6">
          <Link href="/">
            <img
              src="/logo.png"
              alt="La Bodega Nocturna 23"
              className="h-20 md:h-28 lg:h-32 w-auto"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
