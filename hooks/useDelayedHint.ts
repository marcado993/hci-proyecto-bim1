"use client";
// hooks/useDelayedHint.ts
// Si el niño no interactúa en `delay` ms → isHintVisible = true
// La pista se resetea al interactuar o cambiar de ejercicio

import { useState, useEffect, useRef, useCallback } from "react";

export interface UseDelayedHintReturn {
  isHintVisible: boolean;
  resetHint: () => void;
  triggerHintNow: () => void;
}

export function useDelayedHint(
  active: boolean,
  delay: number = 7000
): UseDelayedHintReturn {
  const [isHintVisible, setIsHintVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (active) {
      timerRef.current = setTimeout(() => {
        setIsHintVisible(true);
      }, delay);
    }
  }, [active, delay, clearTimer]);

  // Reinicia el hint (el niño interactuó)
  const resetHint = useCallback(() => {
    setIsHintVisible(false);
    startTimer();
  }, [startTimer]);

  // Forzar pista inmediata (para testing / accesibilidad)
  const triggerHintNow = useCallback(() => {
    clearTimer();
    setIsHintVisible(true);
  }, [clearTimer]);

  // Arrancar o limpiar cuando cambia `active`
  useEffect(() => {
    setIsHintVisible(false);
    if (active) {
      startTimer();
    } else {
      clearTimer();
    }
    return clearTimer;
  }, [active, startTimer, clearTimer]);

  return { isHintVisible, resetHint, triggerHintNow };
}
