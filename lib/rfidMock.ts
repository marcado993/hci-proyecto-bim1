// lib/rfidMock.ts — Simulador de hardware RFID/Bluetooth
// Simula el payload que llegaría del bloque físico NFC/RFID

import { VOCABULARY, findByTagId, findByWord, type WordItem } from "./vocabulary";

export interface RFIDPayload {
  tagId: string;
  word: string;
  timestamp: number;
  rssi?: number; // Simulated signal strength
}

/** Construye el mapa tagId → word a partir del vocabulario */
export const RFID_TAG_MAP: Record<string, string> = Object.fromEntries(
  VOCABULARY.map((w) => [w.tagId, w.word])
);

/**
 * Función principal de simulación de lectura RFID.
 * En producción, esta función sería reemplazada por la
 * recepción real del evento WebBluetooth / WebUSB / WebSocket.
 *
 * @param word  Palabra a simular (busca su tagId automáticamente)
 * @returns     Payload RFID simulado
 */
export function simulateRFIDRead(word: string): RFIDPayload | null {
  const item = findByWord(word);
  if (!item) {
    console.warn(`[RFID] Palabra desconocida: "${word}"`);
    return null;
  }

  const payload: RFIDPayload = {
    tagId: item.tagId,
    word: item.word,
    timestamp: Date.now(),
    rssi: -(Math.floor(Math.random() * 30) + 50), // -50 a -80 dBm simulado
  };

  console.log(`[RFID] 📡 Tag detectado: ${JSON.stringify(payload)}`);
  return payload;
}

/**
 * Simula una lectura por tagId (como si el hardware enviara el ID raw)
 * @param tagId  ID del tag RFID (ej: "W001")
 */
export function simulateRFIDByTag(tagId: string): RFIDPayload | null {
  const item = findByTagId(tagId);
  if (!item) {
    console.warn(`[RFID] Tag desconocido: "${tagId}"`);
    return null;
  }

  return {
    tagId,
    word: item.word,
    timestamp: Date.now(),
    rssi: -(Math.floor(Math.random() * 30) + 50),
  };
}

/**
 * Simula una secuencia de lecturas con delay entre cada una
 * (útil para demos automáticas del hardware)
 */
export async function simulateRFIDSequence(
  words: string[],
  onRead: (payload: RFIDPayload, word: WordItem) => void,
  delayMs = 2000
): Promise<void> {
  for (const word of words) {
    await new Promise((r) => setTimeout(r, delayMs));
    const payload = simulateRFIDRead(word);
    const item = findByWord(word);
    if (payload && item) {
      onRead(payload, item);
    }
  }
}

/**
 * Construye los botones de simulación para una categoría.
 * SIEMPRE incluye la palabra `requiredWord` (respuesta correcta del ejercicio actual)
 * para que el niño siempre pueda encontrar la solución en los botones.
 */
export function getRFIDButtonsForCategory(
  categoryId: string,
  limit = 6,
  requiredWord?: string
): Array<{ word: string; tagId: string; emoji: string; color: string }> {
  const allWords = VOCABULARY.filter((w) => w.category === categoryId);

  // Si hay una palabra requerida, aseguramos que esté incluida
  let selected = allWords.slice(0, limit);
  if (requiredWord) {
    const isIncluded = selected.some((w) => w.word === requiredWord);
    if (!isIncluded) {
      const requiredItem = allWords.find((w) => w.word === requiredWord);
      if (requiredItem) {
        // Reemplaza el último elemento para incluir la respuesta correcta
        selected = [...selected.slice(0, limit - 1), requiredItem];
      }
    }
    // Mezclar para que la respuesta no siempre esté en la misma posición
    selected = selected.sort(() => Math.random() - 0.5);
  }

  return selected.map((w) => ({
    word: w.word,
    tagId: w.tagId,
    emoji: w.emoji,
    color: w.color,
  }));
}
