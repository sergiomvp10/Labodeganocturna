"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { createPortal } from "react-dom";

interface FlyItem {
  id: number;
  image: string;
  startX: number;
  startY: number;
}

interface FlyToCartContextType {
  fly: (image: string, startX: number, startY: number) => void;
}

const FlyToCartContext = createContext<FlyToCartContextType>({ fly: () => {} });

let nextId = 0;

export function FlyToCartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<FlyItem[]>([]);

  const fly = useCallback((image: string, startX: number, startY: number) => {
    const id = nextId++;
    setItems((prev) => [...prev, { id, image, startX, startY }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 700);
  }, []);

  return (
    <FlyToCartContext.Provider value={{ fly }}>
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <>
            {items.map((item) => (
              <FlyingImage key={item.id} item={item} />
            ))}
          </>,
          document.body
        )}
    </FlyToCartContext.Provider>
  );
}

function FlyingImage({ item }: { item: FlyItem }) {
  const cartEl = typeof document !== "undefined" ? document.getElementById("cart-icon-target") : null;
  const endX = cartEl ? cartEl.getBoundingClientRect().left + cartEl.offsetWidth / 2 : window.innerWidth - 40;
  const endY = cartEl ? cartEl.getBoundingClientRect().top + cartEl.offsetHeight / 2 : window.innerHeight / 2;

  const dx = endX - item.startX;
  const dy = endY - item.startY;

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: item.startX,
        top: item.startY,
        transform: "translate(-50%, -50%)",
        animation: "flyToCart 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards",
        ["--fly-dx" as string]: `${dx}px`,
        ["--fly-dy" as string]: `${dy}px`,
      }}
    >
      <img
        src={item.image}
        alt=""
        className="w-16 h-16 object-contain rounded-lg shadow-lg shadow-brand-gold/30 bg-brand-dark border border-brand-gold/30"
      />
    </div>
  );
}

export function useFlyToCart() {
  return useContext(FlyToCartContext);
}
