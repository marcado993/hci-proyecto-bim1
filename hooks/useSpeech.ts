"use client";
// hooks/useSpeech.ts — Text-to-Speech con Web Speech API (español)

import { useCallback, useEffect, useRef } from "react";

export function useSpeech() {
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      // Pre-cargar voces disponibles (navegadores modernos)
      window.speechSynthesis.getVoices();
    }
  }, []);

  /** Habla un texto en español con velocidad adaptada para niños */
  const speak = useCallback((text: string, rate = 0.82, pitch = 1.05) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "es-ES";
    u.rate = rate;
    u.pitch = pitch;
    u.volume = 1;
    synthRef.current.speak(u);
  }, []);

  /** Lee la oración reemplazando ___ por la respuesta o una pausa */
  const speakSentence = useCallback((sentence: string) => {
    const clean = sentence.replace("___", "...");
    speak(clean, 0.78);
  }, [speak]);

  /** Feedback de éxito con mensaje */
  const speakSuccess = useCallback((name: string, word: string) => {
    speak(`¡Muy bien, ${name}! La palabra es: ${word}`, 0.82);
  }, [speak]);

  /** Feedback neutro (sin "error") */
  const speakTryAgain = useCallback(() => {
    speak("Inténtalo de nuevo. Mira bien el dibujo.", 0.80);
  }, [speak]);

  /** Lee la pista silábica */
  const speakHint = useCallback((syllables: string) => {
    speak(`Pista: ${syllables.split("-").join("... ")}`, 0.70);
  }, [speak]);

  const stop = useCallback(() => synthRef.current?.cancel(), []);

  return { speak, speakSentence, speakSuccess, speakTryAgain, speakHint, stop };
}
