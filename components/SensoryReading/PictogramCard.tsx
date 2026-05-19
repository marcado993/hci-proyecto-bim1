"use client";
// components/SensoryReading/PictogramCard.tsx
// Muestra la imagen Gemini si existe, o fallback elegante con emoji

import Image from "next/image";
import type { Exercise } from "@/lib/exercises";
import type { ExerciseStatus } from "@/hooks/useGameState";

interface PictogramCardProps {
  exercise: Exercise;
  status: ExerciseStatus;
  isHintVisible: boolean;
}

export default function PictogramCard({ exercise, status, isHintVisible }: PictogramCardProps) {
  const { word, pictogramSrc } = exercise;

  const borderColor =
    status === "correct"       ? "#A2D8B0" :
    status === "neutral-reset" ? "#C5C0D5" :
    isHintVisible              ? "#C0B0E8" :
    word.colorBorder;

  const bgColor =
    status === "correct"       ? "#C8EDD4" :
    status === "neutral-reset" ? "#F5F3FF" :
    word.color;

  return (
    <div
      style={{
        background: bgColor,
        border: `3px solid ${borderColor}`,
        borderRadius: "24px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        transition: "all 0.6s ease",
        position: "relative",
        overflow: "hidden",
        animation:
          isHintVisible && status === "idle"
            ? "slow-pulse 3s ease-in-out infinite"
            : status === "correct"
            ? "success-bloom 0.9s ease-out"
            : "none",
      }}
    >
      {/* Imagen generada por Gemini */}
      {pictogramSrc ? (
        <div style={{
          width: "100%",
          maxWidth: "220px",
          aspectRatio: "1",
          borderRadius: "18px",
          overflow: "hidden",
          position: "relative",
        }}>
          <Image
            src={pictogramSrc}
            alt={`Pictograma de ${word.word}`}
            fill
            style={{ objectFit: "cover", borderRadius: "18px" }}
            sizes="220px"
            priority
          />
        </div>
      ) : (
        /* Fallback elegante con emoji grande */
        <div style={{
          width: "clamp(120px, 40vw, 180px)",
          aspectRatio: "1",
          background: "rgba(255,255,255,0.7)",
          borderRadius: "18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "clamp(4rem, 15vw, 7rem)",
          lineHeight: 1,
          className: isHintVisible && status === "idle" ? "animate-gentle-float" : "",
        }}>
          {word.emoji}
        </div>
      )}

      {/* Etiqueta de categoría */}
      <div style={{
        background: "rgba(255,255,255,0.7)",
        borderRadius: "20px",
        padding: "4px 14px",
        fontSize: "0.8rem",
        fontWeight: 700,
        color: "#7A7590",
        letterSpacing: "0.05em",
      }}>
        {word.categoryLabel}
      </div>

      {/* Dificultad */}
      <div style={{
        display: "flex",
        gap: "4px",
        alignItems: "center",
      }}>
        {word.difficulty === "easy" ? (
          <span style={{ fontSize: "0.75rem", color: "#7A7590", fontWeight: 600 }}>🌱 Fácil</span>
        ) : (
          <span style={{ fontSize: "0.75rem", color: "#7A7590", fontWeight: 600 }}>🌟 Media</span>
        )}
      </div>

      {/* Sílabas flotantes (solo cuando hint activo) */}
      {isHintVisible && status === "idle" && (
        <div className="animate-soft-appear" style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          background: "rgba(255,255,255,0.9)",
          border: "2px solid #C0B0E8",
          borderRadius: "12px",
          padding: "4px 10px",
          fontSize: "0.8rem",
          fontWeight: 800,
          color: "#7A6BB0",
          letterSpacing: "0.1em",
        }}>
          {word.syllables}
        </div>
      )}
    </div>
  );
}
