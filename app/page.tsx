"use client";
// app/page.tsx — Orquestador principal de vistas

import { GameProvider, useGameState } from "@/hooks/useGameState";
import NameSetup from "@/components/NameSetup/NameSetup";
import CategorySelector from "@/components/CategorySelector/CategorySelector";
import SensoryReadingModule from "@/components/SensoryReading/SensoryReadingModule";
import { CATEGORIES } from "@/lib/vocabulary";
import { getExercisesForCategory } from "@/lib/exercises";

// ── Dashboard ─────────────────────────────────────────────────────
function Dashboard() {
  const { state, setView, startCategory } = useGameState();
  const { profile, stars } = state;

  const quickStart = (categoryId: string) => {
    const exercises = getExercisesForCategory(categoryId, 6);
    if (exercises.length > 0) startCategory(categoryId, exercises);
  };

  const featured = CATEGORIES.slice(0, 4);

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(135deg,#EEF6FF 0%,#FFF8EE 50%,#F0FFF4 100%)",
      fontFamily: "'Nunito',sans-serif",
    }}>
      {/* ── Header sticky ── */}
      <header style={{
        background: "rgba(255,252,248,0.96)",
        backdropFilter: "blur(16px)",
        borderBottom: "2px solid #E0DAF0",
        padding: "16px 20px",
        position: "sticky", top: 0, zIndex: 20,
      }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "48px", height: "48px",
              background: "#DDD4F5", border: "2px solid #C0B0E8",
              borderRadius: "14px", display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: "1.6rem",
            }}>
              {profile?.avatar ?? "📖"}
            </div>
            <div>
              <p style={{ fontSize: "0.75rem", color: "#7A7590", fontWeight: 600 }}>¡Hola!</p>
              <h1 style={{ fontSize: "clamp(1rem, 3vw, 1.4rem)", fontWeight: 900, color: "#3D3A50", margin: 0 }}>
                {profile?.name ?? "Amigo"} 👋
              </h1>
            </div>
          </div>
          <div style={{
            background: "#FFF3C4", border: "2px solid #F0DC90",
            borderRadius: "14px", padding: "8px 16px", textAlign: "center",
          }}>
            <p style={{ fontSize: "1.1rem", margin: 0 }}>⭐</p>
            <p style={{ fontSize: "1rem", fontWeight: 900, color: "#3D3A50", margin: 0 }}>{stars}</p>
          </div>
        </div>
      </header>

      {/* ── Contenido centrado ── */}
      <div className="dashboard-content" style={{ padding: "24px 20px 40px" }}>

        {/* Banner motivacional */}
        <div className="animate-soft-appear" style={{
          background: "linear-gradient(135deg,#C8DFFE,#DDD4F5)",
          border: "2px solid #C0B0E8", borderRadius: "24px",
          padding: "clamp(20px,4vw,36px)", marginBottom: "28px",
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: "20px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: "-10px", right: "20px", fontSize: "6rem", opacity: 0.12 }}>📚</div>
          <div>
            <p style={{ fontSize: "clamp(1.2rem,3.5vw,1.8rem)", fontWeight: 900, color: "#3D3A50", margin: "0 0 8px 0" }}>
              🌟 ¡Hoy es un gran día para aprender!
            </p>
            <p style={{ fontSize: "clamp(0.85rem,2vw,1rem)", color: "#6B6880", fontWeight: 600, margin: 0 }}>
              {stars > 0 ? `Llevas ${stars} ⭐ — ¡sigue así!` : "Elige una categoría y comienza tu aventura"}
            </p>
          </div>
          <button
            className="btn-primary touch-target"
            onClick={() => setView("category")}
            style={{ whiteSpace: "nowrap", padding: "14px 24px", fontSize: "clamp(0.9rem,2vw,1.05rem)" }}
          >
            🎯 Ver todo
          </button>
        </div>

        {/* Acceso rápido — 4 categorías */}
        <h2 style={{ fontSize: "clamp(1rem,2.5vw,1.2rem)", fontWeight: 800, color: "#3D3A50", marginBottom: "14px" }}>
          ⚡ Acceso rápido
        </h2>
        <div className="category-grid-desktop" style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "clamp(10px,2vw,16px)",
          marginBottom: "28px",
        }}>
          {featured.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => quickStart(cat.id)}
              className="touch-target animate-soft-appear"
              style={{
                background: cat.color, border: `2px solid ${cat.border}`,
                borderRadius: "20px", padding: "clamp(14px,2vw,22px) 16px",
                display: "flex", alignItems: "center", gap: "clamp(10px,2vw,16px)",
                cursor: "pointer", fontFamily: "'Nunito',sans-serif",
                transition: "all 0.35s ease",
                animationDelay: `${i * 0.07}s`, animationFillMode: "both",
                textAlign: "left", width: "100%",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 28px rgba(61,58,80,0.12)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
            >
              <span style={{ fontSize: "clamp(1.8rem,4vw,2.4rem)", flexShrink: 0 }}>{cat.emoji}</span>
              <div>
                <p style={{ fontSize: "clamp(0.9rem,2vw,1.1rem)", fontWeight: 800, color: "#3D3A50", margin: 0 }}>{cat.label}</p>
                <p style={{ fontSize: "clamp(0.72rem,1.5vw,0.82rem)", color: "#7A7590", fontWeight: 600, margin: 0 }}>{cat.count} palabras</p>
              </div>
            </button>
          ))}
        </div>

        {/* Consejo del día */}
        <div style={{
          background: "#C8EDD4", border: "2px solid #A2D8B0",
          borderRadius: "20px", padding: "16px 20px",
          display: "flex", alignItems: "flex-start", gap: "14px",
        }}>
          <span style={{ fontSize: "1.6rem", flexShrink: 0 }}>💡</span>
          <div>
            <p style={{ fontSize: "0.85rem", fontWeight: 800, color: "#2A7A4A", margin: "0 0 3px 0" }}>Consejo del día</p>
            <p style={{ fontSize: "0.82rem", color: "#4A9A6A", fontWeight: 600, lineHeight: 1.5, margin: 0 }}>
              Haz clic en el botón 🔊 para escuchar la oración. Luego toca las letras para escribir la palabra. ¡Tómate el tiempo que necesites! ⏱️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── CategorySelector view ──────────────────────────────────────────
function CategoryView() {
  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(135deg,#EEF6FF 0%,#FFF8EE 50%,#F0FFF4 100%)",
      fontFamily: "'Nunito',sans-serif",
    }}>
      <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        <CategorySelector />
      </div>
    </div>
  );
}

// ── Router ──────────────────────────────────────────────────────────
function AppRouter() {
  const { state } = useGameState();
  const { view } = state;

  if (view === "setup")    return <NameSetup />;
  if (view === "exercise") return <SensoryReadingModule />;
  if (view === "category") return <CategoryView />;
  return <Dashboard />;
}

export default function Home() {
  return (
    <GameProvider>
      <AppRouter />
    </GameProvider>
  );
}
