"use client";
// app/page.tsx — Orquestador principal de vistas
// Maneja: setup → dashboard → category → exercise

import { GameProvider, useGameState } from "@/hooks/useGameState";
import NameSetup from "@/components/NameSetup/NameSetup";
import CategorySelector from "@/components/CategorySelector/CategorySelector";
import SensoryReadingModule from "@/components/SensoryReading/SensoryReadingModule";
import { CATEGORIES } from "@/lib/vocabulary";
import { getExercisesForCategory } from "@/lib/exercises";

// ── Dashboard ────────────────────────────────────────────────
function Dashboard() {
  const { state, setView, startCategory } = useGameState();
  const { profile, stars, streak } = state;

  const quickStart = (categoryId: string) => {
    const exercises = getExercisesForCategory(categoryId, 5);
    if (exercises.length > 0) startCategory(categoryId, exercises);
  };

  const featuredCategories = CATEGORIES.slice(0, 4);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #EEF6FF 0%, #FFF8EE 50%, #F0FFF4 100%)",
      fontFamily: "'Nunito', sans-serif",
      paddingBottom: "32px",
    }}>
      {/* ── Header saludo ── */}
      <div style={{
        background: "rgba(255,252,248,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "2px solid #E0DAF0",
        padding: "20px 20px 16px",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "52px", height: "52px",
              background: "#DDD4F5",
              border: "2px solid #C0B0E8",
              borderRadius: "16px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.8rem",
            }}>
              {profile?.avatar ?? "📖"}
            </div>
            <div>
              <p style={{ fontSize: "0.8rem", color: "#7A7590", fontWeight: 600 }}>¡Hola!</p>
              <h1 style={{ fontSize: "clamp(1.1rem, 4vw, 1.5rem)", fontWeight: 900, color: "#3D3A50" }}>
                {profile?.name ?? "Amigo"} 👋
              </h1>
            </div>
          </div>

          {/* Estrellas */}
          <div style={{
            background: "#FFF3C4",
            border: "2px solid #F0DC90",
            borderRadius: "16px",
            padding: "8px 16px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "1.2rem" }}>⭐</p>
            <p style={{ fontSize: "1rem", fontWeight: 900, color: "#3D3A50" }}>{stars}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px" }}>
        {/* ── Banner motivacional ── */}
        <div className="animate-soft-appear" style={{
          background: "linear-gradient(135deg, #C8DFFE, #DDD4F5)",
          border: "2px solid #C0B0E8",
          borderRadius: "24px",
          padding: "24px 20px",
          marginBottom: "24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-20px", right: "-10px",
            fontSize: "5rem", opacity: 0.15,
          }}>📚</div>
          <p style={{ fontSize: "2rem", marginBottom: "8px" }}>🌟</p>
          <h2 style={{ fontSize: "clamp(1.1rem, 4vw, 1.4rem)", fontWeight: 900, color: "#3D3A50", marginBottom: "4px" }}>
            ¡Hoy es un gran día para aprender!
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#7A7590", fontWeight: 600, marginBottom: "16px" }}>
            {stars > 0
              ? `Llevas ${stars} ⭐ ganadas. ¡Sigue así!`
              : "Toca una categoría y empieza tu aventura"}
          </p>
          <button
            className="btn-primary touch-target"
            onClick={() => setView("category")}
            style={{ fontSize: "1rem", padding: "12px 28px", minHeight: "52px" }}
          >
            🎯 Ver todas las categorías
          </button>
        </div>

        {/* ── Acceso rápido ── */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#3D3A50", marginBottom: "14px" }}>
            ⚡ Acceso rápido
          </h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px",
          }}>
            {featuredCategories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => quickStart(cat.id)}
                className="touch-target animate-soft-appear"
                style={{
                  background: cat.color,
                  border: `2px solid ${cat.border}`,
                  borderRadius: "18px",
                  padding: "16px 12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                  fontFamily: "'Nunito', sans-serif",
                  transition: "all 0.4s ease",
                  animationDelay: `${i * 0.08}s`,
                  animationFillMode: "both",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <span style={{ fontSize: "2rem" }}>{cat.emoji}</span>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: 800, color: "#3D3A50" }}>{cat.label}</p>
                  <p style={{ fontSize: "0.72rem", color: "#7A7590", fontWeight: 600 }}>{cat.count} palabras</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Consejo del día ── */}
        <div style={{
          background: "#C8EDD4",
          border: "2px solid #A2D8B0",
          borderRadius: "20px",
          padding: "16px 18px",
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}>
          <span style={{ fontSize: "1.8rem", flexShrink: 0 }}>💡</span>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 800, color: "#2A7A4A", marginBottom: "2px" }}>
              Consejo del día
            </p>
            <p style={{ fontSize: "0.82rem", color: "#4A9A6A", fontWeight: 600, lineHeight: 1.5 }}>
              Toca los bloques físicos o los botones de la pantalla para colocar las palabras en su lugar. ¡Tómate el tiempo que necesites! ⏱️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Router de vistas ─────────────────────────────────────────
function AppRouter() {
  const { state } = useGameState();
  const { view } = state;

  if (view === "setup")     return <NameSetup />;
  if (view === "exercise")  return <SensoryReadingModule />;

  // Dashboard con category selector embebido
  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #EEF6FF 0%, #FFF8EE 50%, #F0FFF4 100%)",
      fontFamily: "'Nunito', sans-serif",
    }}>
      {view === "dashboard" && <Dashboard />}
      {view === "category" && (
        <div style={{ padding: "20px" }}>
          <CategorySelector />
        </div>
      )}
    </div>
  );
}

// ── Entrada principal ────────────────────────────────────────
export default function Home() {
  return (
    <GameProvider>
      <AppRouter />
    </GameProvider>
  );
}
