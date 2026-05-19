"use client";
// components/SensoryReading/SensoryReadingModule.tsx
// Módulo principal de lectura: pictograma, oración cloze, RFID, hints

import { useEffect, useCallback, useRef } from "react";
import { useGameState } from "@/hooks/useGameState";
import { useDelayedHint } from "@/hooks/useDelayedHint";
import { getRFIDButtonsForCategory, simulateRFIDRead } from "@/lib/rfidMock";
import PictogramCard from "./PictogramCard";

export default function SensoryReadingModule() {
  const { state, currentExercise, submitWord, nextExercise, resetStatus, clearSession } = useGameState();
  const { status, activeCategoryId, currentIndex, exercises, stars, streak } = state;

  const isExerciseActive = status === "idle";
  const { isHintVisible, resetHint } = useDelayedHint(isExerciseActive, 7000);

  // Auto-advance después de respuesta correcta
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (status === "correct") {
      advanceTimer.current = setTimeout(() => {
        nextExercise();
      }, 2200);
    }
    if (status === "neutral-reset") {
      advanceTimer.current = setTimeout(() => {
        resetStatus();
      }, 1200);
    }
    return () => { if (advanceTimer.current) clearTimeout(advanceTimer.current); };
  }, [status, nextExercise, resetStatus]);

  // Manejar palabra enviada (desde botones RFID)
  const handleWordSubmit = useCallback((word: string) => {
    resetHint();
    submitWord(word);
  }, [resetHint, submitWord]);

  // Función pública simulateRFIDRead
  const handleRFIDSimulate = useCallback((word: string) => {
    const payload = simulateRFIDRead(word);
    if (payload) handleWordSubmit(payload.word);
  }, [handleWordSubmit]);

  if (!currentExercise) return null;

  const rfidButtons = getRFIDButtonsForCategory(activeCategoryId ?? "", 6, currentExercise.answer);
  const progress = ((currentIndex + 1) / exercises.length) * 100;

  // Construir oración con el slot de respuesta
  const sentenceParts = currentExercise.sentence.split("___");

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #EEF6FF 0%, #FFF8EE 60%, #F0FFF4 100%)",
      fontFamily: "'Nunito', sans-serif",
      paddingBottom: "140px",
    }}>
      {/* ── Header ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "20px 20px 16px",
        background: "rgba(255,252,248,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "2px solid #E0DAF0",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <button
          onClick={clearSession}
          style={{
            background: "#F8F6FF",
            border: "2px solid #E0DAF0",
            borderRadius: "14px",
            padding: "10px 16px",
            fontSize: "0.95rem",
            fontWeight: 700,
            color: "#7A7590",
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            transition: "all 0.3s ease",
          }}
        >
          ← Salir
        </button>

        {/* Progreso */}
        <div style={{ flex: 1, margin: "0 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#7A7590" }}>
              {currentIndex + 1} / {exercises.length}
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#7A7590" }}>
              ⭐ {stars}
            </span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Racha */}
        {streak >= 2 && (
          <div style={{
            background: "#FFF3C4",
            border: "2px solid #F0DC90",
            borderRadius: "12px",
            padding: "6px 12px",
            fontSize: "0.85rem",
            fontWeight: 800,
            color: "#3D3A50",
          }}>
            🔥 ×{streak}
          </div>
        )}
      </div>

      {/* ── Área de ejercicio ── */}
      <div style={{ flex: 1, padding: "20px 20px 0", display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Pictograma */}
        <PictogramCard
          exercise={currentExercise}
          status={status}
          isHintVisible={isHintVisible}
        />

        {/* Oración cloze */}
        <div style={{
          background: "#FFFCF8",
          border: "2px solid #E0DAF0",
          borderRadius: "20px",
          padding: "20px",
          textAlign: "center",
        }}>
          <p style={{ color: "#7A7590", fontSize: "0.85rem", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Completa la oración
          </p>
          <div style={{
            fontSize: "clamp(1.1rem, 4.5vw, 1.5rem)",
            fontWeight: 800,
            color: "#3D3A50",
            lineHeight: 1.6,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}>
            <span>{sentenceParts[0]}</span>

            {/* Slot de respuesta */}
            <span
              className={`word-slot ${
                status === "correct"       ? "filled" :
                status === "neutral-reset" ? "neutral-reset" :
                isHintVisible              ? "hint-active" : ""
              }`}
              style={{
                minWidth: "120px",
                padding: "8px 16px",
                fontSize: "clamp(1.1rem, 4vw, 1.4rem)",
                fontWeight: 900,
                color: status === "correct" ? "#2A7A4A" : "#7A7590",
                transition: "all 0.6s ease",
              }}
            >
              {status === "correct" ? currentExercise.answer : "___"}
            </span>

            <span>{sentenceParts[1]}</span>
          </div>

          {/* Sílabas (hint sutil) */}
          {isHintVisible && status === "idle" && (
            <p className="animate-slow-pulse" style={{
              marginTop: "12px",
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#C0B0E8",
              letterSpacing: "0.15em",
            }}>
              {currentExercise.word.word} → {currentExercise.word.syllables}
            </p>
          )}
        </div>

        {/* Feedback correcto */}
        {status === "correct" && (
          <div className="animate-soft-appear" style={{
            background: "#C8EDD4",
            border: "2px solid #A2D8B0",
            borderRadius: "20px",
            padding: "16px",
            textAlign: "center",
            animation: "soft-appear 0.6s ease-out, success-bloom 0.9s ease-out",
          }}>
            <p style={{ fontSize: "1.8rem", marginBottom: "4px" }}>⭐</p>
            <p style={{ fontSize: "1.1rem", fontWeight: 800, color: "#2A7A4A" }}>
              ¡Muy bien! {state.profile?.name ?? ""}
            </p>
            <p style={{ fontSize: "0.9rem", color: "#4A9A6A", fontWeight: 600 }}>
              Esa es la palabra correcta 🎉
            </p>
          </div>
        )}

        {/* Feedback neutro (reseteo sin error) */}
        {status === "neutral-reset" && (
          <div className="animate-neutral-fade" style={{
            background: "#F5F3FF",
            border: "2px solid #E0DAF0",
            borderRadius: "20px",
            padding: "14px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "0.95rem", fontWeight: 700, color: "#7A7590" }}>
              💫 Inténtalo de nuevo...
            </p>
          </div>
        )}
      </div>

      {/* ── Simulador RFID (panel inferior fijo) ── */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "rgba(255,252,248,0.97)",
        backdropFilter: "blur(16px)",
        borderTop: "2px solid #E0DAF0",
        padding: "12px 16px 20px",
        zIndex: 20,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "10px",
        }}>
          <span style={{ fontSize: "1rem" }}>📡</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#7A7590", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Bloques físicos (simular)
          </span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.min(rfidButtons.length, 3)}, 1fr)`,
          gap: "8px",
        }}>
          {rfidButtons.map((btn) => (
            <button
              key={btn.tagId}
              onClick={() => handleRFIDSimulate(btn.word)}
              className="touch-target"
              style={{
                background: btn.color,
                border: `2px solid ${currentExercise.answer === btn.word && isHintVisible
                  ? "#C0B0E8"
                  : "rgba(255,255,255,0.5)"}`,
                borderRadius: "14px",
                padding: "10px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                cursor: "pointer",
                transition: "all 0.4s ease",
                fontFamily: "'Nunito', sans-serif",
                animation: currentExercise.answer === btn.word && isHintVisible
                  ? "hint-glow 2.5s ease-in-out infinite" : "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <span style={{ fontSize: "1.6rem", lineHeight: 1 }}>{btn.emoji}</span>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#3D3A50" }}>
                {btn.word}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
