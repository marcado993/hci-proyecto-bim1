"use client";
// components/CategorySelector/CategorySelector.tsx
// Grid de categorías Mobile-First con cards accesibles

import { useGameState } from "@/hooks/useGameState";
import { CATEGORIES } from "@/lib/vocabulary";
import { getExercisesForCategory } from "@/lib/exercises";

export default function CategorySelector() {
  const { state, startCategory, setView } = useGameState();

  const handleSelectCategory = (categoryId: string) => {
    const exercises = getExercisesForCategory(categoryId, 6);
    if (exercises.length > 0) {
      startCategory(categoryId, exercises);
    }
  };

  return (
    <div style={{ padding: "0 0 120px 0" }}>
      {/* Header de sección */}
      <div style={{ textAlign: "center", marginBottom: "28px", padding: "0 4px" }}>
        <h2 style={{
          fontSize: "clamp(1.4rem, 5vw, 2rem)",
          fontWeight: 900,
          color: "#3D3A50",
          marginBottom: "8px",
        }}>
          ¿Qué quieres aprender hoy?
        </h2>
        <p style={{ color: "#7A7590", fontSize: "1rem", fontWeight: 600 }}>
          Toca una categoría para empezar 👇
        </p>
      </div>

      {/* Grid de categorías */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "14px",
        padding: "0 4px",
      }}>
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            onClick={() => handleSelectCategory(cat.id)}
            className="touch-target-lg calm-card animate-soft-appear"
            style={{
              background: cat.color,
              border: `2px solid ${cat.border}`,
              borderRadius: "20px",
              padding: "20px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: "pointer",
              transition: "all 0.4s ease",
              width: "100%",
              animationDelay: `${i * 0.06}s`,
              animationFillMode: "both",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 28px rgba(61,58,80,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "none";
            }}
          >
            <span style={{ fontSize: "3rem", lineHeight: 1 }}>{cat.emoji}</span>
            <span style={{
              fontSize: "clamp(0.85rem, 3vw, 1rem)",
              fontWeight: 800,
              color: "#3D3A50",
              textAlign: "center",
              lineHeight: 1.2,
            }}>
              {cat.label}
            </span>
            <span style={{
              fontSize: "0.75rem",
              color: "#7A7590",
              fontWeight: 600,
              background: "rgba(255,255,255,0.6)",
              borderRadius: "20px",
              padding: "2px 10px",
            }}>
              {cat.count} palabras
            </span>
          </button>
        ))}
      </div>

      {/* Botón volver */}
      <div style={{ textAlign: "center", marginTop: "28px" }}>
        <button
          onClick={() => setView("dashboard")}
          style={{
            background: "transparent",
            border: "2px solid #E0DAF0",
            borderRadius: "14px",
            padding: "12px 28px",
            fontSize: "1rem",
            fontWeight: 700,
            color: "#7A7590",
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            transition: "all 0.3s ease",
          }}
        >
          ← Volver
        </button>
      </div>
    </div>
  );
}
