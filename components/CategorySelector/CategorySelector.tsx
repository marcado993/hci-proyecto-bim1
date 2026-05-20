"use client";
// components/CategorySelector/CategorySelector.tsx
// Estilo Worly: header con atrás, buscador, chips filtros, cards coloridas

import { useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { CATEGORIES } from "@/lib/vocabulary";
import { getExercisesForCategory } from "@/lib/exercises";

// Colores vibrantes rotativos estilo Worly
const WORLY_COLORS = [
  { bg: "#C6F135", border: "#A8D420", text: "#2A4A00" },
  { bg: "#3DDAD4", border: "#28C0BA", text: "#003D3B" },
  { bg: "#FF90B3", border: "#F06090", text: "#5A0020" },
  { bg: "#FFE34E", border: "#F0CB20", text: "#4A3800" },
  { bg: "#D4CCFF", border: "#B8AEFF", text: "#2A1A70" },
  { bg: "#C6F135", border: "#A8D420", text: "#2A4A00" },
  { bg: "#3DDAD4", border: "#28C0BA", text: "#003D3B" },
  { bg: "#FF90B3", border: "#F06090", text: "#5A0020" },
  { bg: "#FFE34E", border: "#F0CB20", text: "#4A3800" },
  { bg: "#D4CCFF", border: "#B8AEFF", text: "#2A1A70" },
];

export default function CategorySelector() {
  const { state, startCategory, setView } = useGameState();
  const [search, setSearch] = useState("");

  const handleSelectCategory = (categoryId: string) => {
    const exercises = getExercisesForCategory(categoryId, 6);
    if (exercises.length > 0) startCategory(categoryId, exercises);
  };

  const filtered = CATEGORIES.filter((cat) =>
    cat.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: "40px" }}>

      {/* ── Header con volver ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "24px",
        paddingTop: "8px",
      }}>
        <button
          onClick={() => setView("dashboard")}
          style={{
            background: "#FFFFFF",
            border: "2px solid var(--worly-border)",
            borderRadius: "14px",
            padding: "10px 16px",
            fontSize: "0.9rem",
            fontWeight: 800,
            color: "var(--worly-text-soft)",
            cursor: "pointer",
            fontFamily: "'Nunito', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            transition: "all 0.2s ease",
            minHeight: "44px",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "#F0EDFF"; (e.currentTarget as HTMLElement).style.borderColor = "#B8AEFF"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "#FFFFFF"; (e.currentTarget as HTMLElement).style.borderColor = "var(--worly-border)"; }}
        >
          ← Atrás
        </button>
        <div>
          <h1 style={{
            fontFamily: "var(--font-fredoka), cursive",
            fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
            color: "var(--worly-text)",
            margin: 0,
            lineHeight: 1,
          }}>
            Mis categorías
          </h1>
          <p style={{ fontSize: "0.8rem", color: "var(--worly-text-muted)", fontWeight: 600, margin: "2px 0 0" }}>
            {CATEGORIES.length} categorías disponibles
          </p>
        </div>
      </div>

      {/* ── Buscador estilo Worly ── */}
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <span style={{
          position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)",
          fontSize: "1.1rem", color: "var(--worly-text-muted)", pointerEvents: "none",
        }}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar categoría..."
          className="worly-input"
          style={{ paddingLeft: "46px", boxSizing: "border-box" }}
        />
      </div>

      {/* ── Chips de conteo ── */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        <span className="chip chip-active">
          Todas ({CATEGORIES.length})
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center",
          padding: "6px 14px", borderRadius: "20px",
          fontSize: "0.82rem", fontWeight: 700,
          background: "#C6F135", border: "2px solid #A8D420", color: "#2A4A00",
        }}>
          🐾 Animales
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center",
          padding: "6px 14px", borderRadius: "20px",
          fontSize: "0.82rem", fontWeight: 700,
          background: "#3DDAD4", border: "2px solid #28C0BA", color: "#003D3B",
        }}>
          🏠 Casa
        </span>
        <span style={{
          display: "inline-flex", alignItems: "center",
          padding: "6px 14px", borderRadius: "20px",
          fontSize: "0.82rem", fontWeight: 700,
          background: "#FF90B3", border: "2px solid #F06090", color: "#5A0020",
        }}>
          ❤️ Valores
        </span>
      </div>

      {/* ── Grid de categorías ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--worly-text-muted)" }}>
          <p style={{ fontSize: "2.5rem", margin: "0 0 8px" }}>🔍</p>
          <p style={{ fontWeight: 700, fontSize: "1rem" }}>No encontramos esa categoría</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "clamp(10px,2vw,14px)",
        }}>
          {filtered.map((cat, i) => {
            const wc = WORLY_COLORS[i % WORLY_COLORS.length];
            return (
              <button
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className="touch-target-lg animate-soft-appear"
                style={{
                  background: wc.bg,
                  border: `3px solid ${wc.border}`,
                  borderRadius: "24px",
                  padding: "20px 14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  width: "100%",
                  animationDelay: `${i * 0.05}s`,
                  animationFillMode: "both",
                  boxShadow: `0 4px 14px ${wc.border}55`,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-5px) scale(1.02)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 14px 32px ${wc.border}88`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 14px ${wc.border}55`;
                }}
              >
                <span style={{
                  fontSize: "2.8rem", lineHeight: 1,
                  filter: "drop-shadow(0 3px 6px rgba(0,0,0,0.15))",
                }}>
                  {cat.emoji}
                </span>
                <span style={{
                  fontSize: "clamp(0.85rem, 2.5vw, 1rem)",
                  fontWeight: 900,
                  color: wc.text,
                  textAlign: "center",
                  lineHeight: 1.2,
                  fontFamily: "var(--font-fredoka), cursive",
                }}>
                  {cat.label}
                </span>
                <span style={{
                  fontSize: "0.72rem",
                  color: wc.text,
                  fontWeight: 700,
                  background: "rgba(255,255,255,0.55)",
                  borderRadius: "20px",
                  padding: "3px 10px",
                  opacity: 0.85,
                }}>
                  {cat.count} palabras
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
