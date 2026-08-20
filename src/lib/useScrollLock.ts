"use client";

import { useEffect } from "react";

let lockCount = 0;

export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;
    lockCount += 1;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
      }
    };
  }, [locked]);
}
