"use client";
// app/page.tsx — Orquestador de vistas con Mascota Gigante Interactiva con Seguimiento Ocular en Tiempo Real y Ambiente Lúdico para Niños

import { GameProvider, useGameState } from "@/hooks/useGameState";
import NameSetup from "@/components/NameSetup/NameSetup";
import CategorySelector from "@/components/CategorySelector/CategorySelector";
import SensoryReadingModule from "@/components/SensoryReading/SensoryReadingModule";
import { CATEGORIES } from "@/lib/vocabulary";
import { getExercisesForCategory } from "@/lib/exercises";
import { useEffect, useState } from "react";
import Image from "next/image";

// ── Ilustración Vectorial: Categoría Animales (Gato) ──
function SVGAnimales({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#FFF3E0" />
      <path d="M 24 40 L 24 16 L 44 32 Z" fill="#FFA726" />
      <path d="M 76 40 L 76 16 L 56 32 Z" fill="#FFA726" />
      <ellipse cx="50" cy="54" rx="28" ry="24" fill="#FFB74D" />
      <circle cx="40" cy="50" r="4" fill="#1A1530" />
      <circle cx="60" cy="50" r="4" fill="#1A1530" />
      <polygon points="50,60 46,55 54,55" fill="#E64A19" />
      <path d="M 44 65 Q 50 68 56 65" stroke="#1A1530" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 20 54 L 32 54" stroke="#1A1530" strokeWidth="2" />
      <path d="M 80 54 L 68 54" stroke="#1A1530" strokeWidth="2" />
    </svg>
  );
}

// ── Ilustración Vectorial: Categoría En Casa ──
function SVGCasa({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#E0F7FA" />
      <polygon points="50,22 18,48 82,48" fill="#FF7043" />
      <rect x="26" y="48" width="48" height="32" fill="#FFE082" />
      <rect x="44" y="60" width="12" height="20" fill="#8D6E63" />
      <circle cx="47" cy="70" r="1.5" fill="#FFD54F" />
      <rect x="32" y="54" width="8" height="8" fill="#80DEEA" />
      <rect x="60" y="54" width="8" height="8" fill="#80DEEA" />
    </svg>
  );
}

// ── Ilustración Vectorial: Categoría Comida (Manzana) ──
function SVGComida({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#FFEBEE" />
      <path d="M 50 24 Q 60 12 56 28 Z" fill="#81C784" />
      <path d="M 50 28 Q 48 20 46 24" stroke="#8D6E63" strokeWidth="3.5" strokeLinecap="round" />
      <ellipse cx="42" cy="55" rx="18" ry="18" fill="#EF5350" />
      <ellipse cx="58" cy="55" rx="18" ry="18" fill="#EF5350" />
      <ellipse cx="50" cy="55" rx="18" ry="16" fill="#EF5350" />
      <circle cx="34" cy="46" r="4.5" fill="white" opacity="0.6" />
    </svg>
  );
}
// ── Ilustración Vectorial: Categoría Colores (Paleta de pintor) ──
function SVGColores({ size = 50 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="#F3E5F5" />
      {/* Palette Base */}
      <path d="M 30 54 C 20 44, 25 24, 50 24 C 75 24, 80 50, 70 70 C 60 80, 42 80, 36 70 C 30 60, 40 64, 30 54 Z" fill="#E0D2C3" />
      {/* Thumb Hole */}
      <circle cx="62" cy="42" r="6" fill="#F3E5F5" />
      {/* Colors paint drops */}
      <circle cx="38" cy="38" r="6" fill="#EF5350" /> {/* Red */}
      <circle cx="48" cy="64" r="6" fill="#C6F135" /> {/* Lime */}
      <circle cx="62" cy="62" r="6" fill="#29B6F6" /> {/* Blue */}
      <circle cx="48" cy="46" r="5" fill="#FFE34E" /> {/* Yellow */}
    </svg>
  );
}

// ── Ilustraciones de Avatares para el header ──
function SVGHeaderAvatar({ type, size = 32 }: { type: string; size?: number }) {
  if (type === "leon") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#E65100" />
        <circle cx="50" cy="53" r="30" fill="#FFB74D" />
        <circle cx="40" cy="46" r="4" fill="#1A1530" />
        <circle cx="60" cy="46" r="4" fill="#1A1530" />
        <polygon points="50,54 45,50 55,50" fill="#1A1530" />
      </svg>
    );
  }
  if (type === "rana") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="55" rx="34" ry="26" fill="#81C784" />
        <circle cx="34" cy="34" r="10" fill="white" />
        <circle cx="66" cy="34" r="10" fill="white" />
        <circle cx="34" cy="34" r="5" fill="#1A1530" />
        <circle cx="66" cy="34" r="5" fill="#1A1530" />
        <path d="M 36 60 Q 50 70 64 60" stroke="#1A1530" strokeWidth="3.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "mariposa") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 50 Q 20 20 24 48 Q 28 76 50 60" fill="#FF4081" />
        <path d="M 50 50 Q 80 20 76 48 Q 72 76 50 60" fill="#FF4081" />
        <rect x="46" y="24" width="8" height="52" rx="4" fill="#9C27B0" />
      </svg>
    );
  }
  if (type === "delfin") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20 60 C 20 30, 60 20, 80 40 C 70 44, 60 40, 50 46 C 42 50, 36 60, 20 60 Z" fill="#64B5F6" />
        <circle cx="64" cy="36" r="3.5" fill="#1A1530" />
      </svg>
    );
  }
  if (type === "zorro") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,80 18,36 82,36" fill="#FF7043" />
        <polygon points="50,80 18,36 50,56" fill="white" />
        <polygon points="50,80 82,36 50,56" fill="white" />
        <circle cx="50" cy="74" r="5" fill="#1A1530" />
        <circle cx="36" cy="46" r="4" fill="#1A1530" />
        <circle cx="64" cy="46" r="4" fill="#1A1530" />
      </svg>
    );
  }
  if (type === "panda") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="52" r="32" fill="white" stroke="#BDBDBD" strokeWidth="2" />
        <circle cx="24" cy="28" r="11" fill="#424242" />
        <circle cx="76" cy="28" r="11" fill="#424242" />
        <ellipse cx="38" cy="48" rx="8" ry="11" fill="#424242" transform="rotate(-15,38,48)" />
        <ellipse cx="62" cy="48" rx="8" ry="11" fill="#424242" transform="rotate(15,62,48)" />
        <circle cx="38" cy="48" r="3.5" fill="white" />
        <circle cx="62" cy="48" r="3.5" fill="white" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,10 63,38 93,38 70,57 78,87 50,70 22,87 30,57 7,38 37,38" fill="#FFD54F" />
    </svg>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────
function Dashboard() {
  const { state, setView, startCategory } = useGameState();
  const { profile, stars } = state;

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // ── Seguidor ocular en tiempo real (Mouse & Touch) ──
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMove = (e: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if ("touches" in e) {
        if (e.touches.length === 0) return;
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }

      // Centro estimado de la mascota central
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight * 0.28;

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const maxOffset = 10;
      if (distance === 0) {
        setPupilOffset({ x: 0, y: 0 });
      } else {
        const factor = Math.min(maxOffset, distance / 30);
        setPupilOffset({
          x: (dx / distance) * factor,
          y: (dy / distance) * factor,
        });
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
    };
  }, []);

  const quickStart = (categoryId: string) => {
    const exercises = getExercisesForCategory(categoryId, 6);
    if (exercises.length > 0) startCategory(categoryId, exercises);
  };

  const categoriesData = [
    { id: "animales",  label: "Animales", component: <SVGAnimales size={72} />, bg: "#C6F135", border: "#A8D420", text: "#2A4A00", count: 8 },
    { id: "casa",      label: "En Casa",   component: <SVGCasa size={72} />,     bg: "#3DDAD4", border: "#28C0BA", text: "#003D3B", count: 6 },
    { id: "alimentos", label: "Comida",    component: <SVGComida size={72} />,   bg: "#FFE34E", border: "#F0CB20", text: "#4A3800", count: 7 },
    { id: "colores",   label: "Colores",   component: <SVGColores size={72} />,  bg: "#FF90B3", border: "#F06090", text: "#5A0020", count: 7 },
  ];

  // Reactividad en brazos según hover
  let leftArmRotate = "rotate(0deg) scale(1)";
  let rightArmRotate = "rotate(0deg) scale(1)";

  if (hoveredCard === "animales" || hoveredCard === "alimentos") {
    leftArmRotate = "rotate(-6deg) scale(1.06)";
  } else if (hoveredCard === "casa" || hoveredCard === "colores") {
    rightArmRotate = "rotate(6deg) scale(1.06)";
  } else if (hoveredCard === "ver_todos") {
    leftArmRotate = "rotate(-4deg) scale(1.03)";
    rightArmRotate = "rotate(4deg) scale(1.03)";
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "var(--worly-cream)",
      fontFamily: "'Nunito', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 16px 64px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ── Estilos Locales Autocontenidos para Animaciones "Squishy" y Sensoriales ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-letter-a {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-letter-b {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(-6deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes float-letter-c {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-18px) rotate(8deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .squishy-hover {
          transition: all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
        }
        .squishy-hover:hover {
          transform: scale(1.06) translateY(-4px) !important;
        }
        .squishy-hover:active {
          transform: scale(0.94) translateY(1px) !important;
        }
      `}} />

      {/* ── Elementos Sensoriales de Lectoescritura Autismo (A, B, C) flotando en fondo ── */}
      <div style={{
        position: "absolute", top: "12%", left: "6%", width: "64px", height: "64px",
        animation: "float-letter-a 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
      }}>
        <svg viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="40" ry="40" fill="#FF90B3" opacity="0.15" />
          <path d="M 50 15 L 75 80 L 60 80 L 50 50 L 40 50 L 30 80 L 15 80 Z" fill="#FF90B3" />
        </svg>
      </div>

      <div style={{
        position: "absolute", top: "42%", right: "6%", width: "70px", height: "70px",
        animation: "float-letter-b 5s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
      }}>
        <svg viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="40" ry="40" fill="#3DDAD4" opacity="0.15" />
          <path d="M 25 15 H 55 C 65 15 72 22 72 32 C 72 40 66 46 58 48 C 68 50 74 58 74 68 C 74 78 66 85 55 85 H 25 Z" fill="#3DDAD4" />
        </svg>
      </div>

      <div style={{
        position: "absolute", bottom: "14%", left: "5%", width: "60px", height: "60px",
        animation: "float-letter-c 7s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
      }}>
        <svg viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="40" ry="40" fill="#C6F135" opacity="0.15" />
          <path d="M 70 25 C 60 15 40 15 30 25 C 18 35 18 65 30 75 C 40 85 60 85 70 75 L 58 64 C 52 70 42 70 38 64 C 32 58 32 42 38 36 C 42 30 52 30 58 36 Z" fill="#C6F135" />
        </svg>
      </div>

      {/* ── Header superior ── */}
      <div style={{
        position: "absolute",
        top: "16px",
        left: "16px",
        right: "16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 10,
      }}>
        {/* Saludo + Avatar Vectorial */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "44px",
            height: "44px",
            background: "#FFF",
            border: "3px solid #8B6CF7",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 12px rgba(139, 108, 247, 0.2)",
            overflow: "hidden",
          }}>
            <SVGHeaderAvatar type={profile?.avatar || "estrella"} size={32} />
          </div>
          <div>
            <p style={{ fontSize: "0.75rem", color: "var(--worly-text-muted)", fontWeight: 700, margin: 0 }}>¡Hola!</p>
            <p style={{ fontSize: "0.95rem", fontWeight: 900, color: "var(--worly-text)", margin: 0, fontFamily: "var(--font-fredoka),cursive" }}>
              {profile?.name ?? "Amigo"} 👋
            </p>
          </div>
        </div>

        {/* Marcador Estrellas */}
        <div style={{
          background: "#FFE34E",
          border: "3px solid #F0CB20",
          borderRadius: "16px",
          padding: "6px 14px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "0 4px 12px rgba(240,203,32,0.4)",
        }}>
          <span style={{ fontSize: "1.1rem" }}>⭐</span>
          <span style={{ fontSize: "1rem", fontWeight: 900, color: "#3A2800", fontFamily: "var(--font-fredoka),cursive", lineHeight: 1 }}>{stars}</span>
        </div>
      </div>

      {/* ── Mascota gigante en el fondo (La Gran Bola Worly) ── */}
      <div style={{
        position: "absolute",
        top: "6%",
        width: "clamp(290px, 85vw, 420px)",
        height: "clamp(290px, 85vw, 420px)",
        background: "linear-gradient(135deg, #8B6CF7 0%, #6B4AE0 100%)",
        borderRadius: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "clamp(44px, 12vw, 68px)",
        boxShadow: "0 12px 36px rgba(107, 74, 224, 0.25)",
        zIndex: 1,
        pointerEvents: "none", // CRITICAL: No click interception!
        transform: hoveredCard ? "scale(1.03)" : "scale(1)",
        transition: "transform 0.3s cubic-bezier(0.25, 1.25, 0.5, 1)",
      }}>
        {/* Highlight superior del círculo */}
        <div style={{
          position: "absolute",
          top: "12%",
          left: "22%",
          width: "35%",
          height: "18%",
          background: "rgba(255,255,255,0.18)",
          borderRadius: "50%",
          transform: "rotate(-18deg)",
        }} />

        {/* Ojos Gigantes que Siguen al Mouse / Touch */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "14px" }}>
          <div style={{
            width: "clamp(44px, 12vw, 56px)",
            height: "clamp(44px, 12vw, 56px)",
            background: "#FFFFFF",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: "clamp(22px, 6vw, 30px)",
              height: "clamp(22px, 6vw, 30px)",
              background: "#1A1530",
              borderRadius: "50%",
              position: "relative",
              transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
              transition: "transform 0.08s ease-out",
            }}>
              <div style={{
                width: "8px", height: "8px", background: "#FFFFFF", borderRadius: "50%",
                position: "absolute", top: "20%", right: "20%",
              }} />
            </div>
          </div>

          <div style={{
            width: "clamp(44px, 12vw, 56px)",
            height: "clamp(44px, 12vw, 56px)",
            background: "#FFFFFF",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: "clamp(22px, 6vw, 30px)",
              height: "clamp(22px, 6vw, 30px)",
              background: "#1A1530",
              borderRadius: "50%",
              position: "relative",
              transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
              transition: "transform 0.08s ease-out",
            }}>
              <div style={{
                width: "8px", height: "8px", background: "#FFFFFF", borderRadius: "50%",
                position: "absolute", top: "20%", right: "20%",
              }} />
            </div>
          </div>
        </div>

        {/* Boca sonriente */}
        <svg width="42" height="20" viewBox="0 0 42 20" fill="none">
          <path d="M 4 4 Q 21 22 38 4" stroke="#1A1530" strokeWidth="5.5" strokeLinecap="round" />
        </svg>

        {/* Mejillas */}
        <div style={{
          position: "absolute", top: "38%", left: "14%", width: "28px", height: "18px",
          background: "rgba(255,144,179,0.5)", borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", top: "38%", right: "14%", width: "28px", height: "18px",
          background: "rgba(255,144,179,0.5)", borderRadius: "50%",
        }} />
      </div>

      {/* ── Brazos abrazando la cuadrícula (pointer-events: none) ── */}
      <div style={{
        position: "absolute",
        top: "18%",
        width: "clamp(340px, 95vw, 520px)",
        height: "120px",
        pointerEvents: "none",
        zIndex: 3,
      }}>
        <svg width="100%" height="100%" viewBox="0 0 520 120" fill="none" style={{ overflow: "visible" }}>
          <path
            d="M 90 40 Q 20 60 76 102"
            stroke="#8B6CF7"
            strokeWidth="18"
            strokeLinecap="round"
            style={{ transformOrigin: "90px 40px", transform: leftArmRotate, transition: "transform 0.25s ease" }}
          />
          <g style={{
            transformOrigin: "76px 104px",
            transform: hoveredCard?.startsWith("c") || hoveredCard === "animales" || hoveredCard === "comida" ? "scale(1.05) translate(-4px, 2px)" : "none",
            transition: "transform 0.25s ease",
          }}>
            <circle cx="76" cy="104" r="14" fill="#A78BFA" />
            <circle cx="62" cy="98" r="10" fill="#A78BFA" />
            <circle cx="90" cy="98" r="10" fill="#A78BFA" />
          </g>

          <path
            d="M 430 40 Q 500 60 444 102"
            stroke="#8B6CF7"
            strokeWidth="18"
            strokeLinecap="round"
            style={{ transformOrigin: "430px 40px", transform: rightArmRotate, transition: "transform 0.25s ease" }}
          />
          <g style={{
            transformOrigin: "444px 104px",
            transform: hoveredCard === "casa" || hoveredCard === "juguetes" ? "scale(1.05) translate(4px, 2px)" : "none",
            transition: "transform 0.25s ease",
          }}>
            <circle cx="444" cy="104" r="14" fill="#A78BFA" />
            <circle cx="458" cy="98" r="10" fill="#A78BFA" />
            <circle cx="430" cy="98" r="10" fill="#A78BFA" />
          </g>
        </svg>
      </div>

      {/* ── Contenedor del Dashboard (Diseño Centrado Único y Escalado para Ambos) ── */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "420px",
        zIndex: 2,
        marginTop: "clamp(130px, 34vw, 190px)",
      }}>

        {/* Cuadrícula de Categorías Vectoriales */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "14px",
          marginBottom: "16px",
        }}>
          {categoriesData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => quickStart(cat.id)}
              onMouseEnter={() => setHoveredCard(cat.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="touch-target squishy-hover animate-soft-appear"
              style={{
                background: cat.bg,
                border: `3px solid ${cat.border}`,
                borderRadius: "24px",
                padding: "24px 16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                transition: "all 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                textAlign: "center",
                boxShadow: `0 6px 16px ${cat.border}44`,
              }}
            >
              <div style={{ transform: hoveredCard === cat.id ? "scale(1.12) rotate(4deg)" : "scale(1)", transition: "transform 0.2s ease" }}>
                {cat.component}
              </div>
              <div>
                <p style={{ fontSize: "1.05rem", fontWeight: 900, color: cat.text, margin: 0, fontFamily: "var(--font-fredoka),cursive" }}>{cat.label}</p>
                <p style={{ fontSize: "0.75rem", color: cat.text, fontWeight: 700, margin: "2px 0 0", opacity: 0.8 }}>{cat.count} palabras</p>
              </div>
            </button>
          ))}
        </div>

        {/* Botón principal full-width */}
        <button
          className="btn-primary touch-target squishy-hover animate-soft-appear"
          onClick={() => setView("category")}
          onMouseEnter={() => setHoveredCard("ver_todos")}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            background: "#8B6CF7",
            border: "3px solid #6B4AE0",
            boxShadow: "0 6px 20px rgba(107, 74, 224, 0.3)",
          }}
        >
          <span>🎯 Ver todas las categorías</span>
          <span style={{ fontSize: "1.2rem" }}>+</span>
        </button>
      </div>

      {/* ── Piernas rectas negras tipo poste y pies saliendo desde abajo (pointer-events: none) ── */}
      <div style={{
        position: "relative",
        marginTop: "-16px",
        display: "flex",
        justifyContent: "center",
        gap: "48px",
        width: "120px",
        height: "60px",
        zIndex: 1,
        pointerEvents: "none",
      }}>
        {/* Pierna Izquierda */}
        <div style={{
          width: "16px",
          height: "60px",
          background: "#1A1530",
          borderRadius: "8px",
          position: "relative",
          transformOrigin: "top center",
          transform: hoveredCard === "animales" || hoveredCard === "comida" ? "rotate(4deg) scaleY(1.06)" : "rotate(0deg) scaleY(1)",
          transition: "transform 0.2s ease",
        }}>
          <div style={{
            width: "36px",
            height: "16px",
            background: "#1A1530",
            borderRadius: "8px",
            position: "absolute",
            bottom: 0,
            left: "-10px",
          }} />
        </div>

        {/* Pierna Derecha */}
        <div style={{
          width: "16px",
          height: "60px",
          background: "#1A1530",
          borderRadius: "8px",
          position: "relative",
          transformOrigin: "top center",
          transform: hoveredCard === "casa" || hoveredCard === "juguetes" ? "rotate(-4deg) scaleY(1.06)" : "rotate(0deg) scaleY(1)",
          transition: "transform 0.2s ease",
        }}>
          <div style={{
            width: "36px",
            height: "16px",
            background: "#1A1530",
            borderRadius: "8px",
            position: "absolute",
            bottom: 0,
            right: "-10px",
          }} />
        </div>
      </div>

    </div>
  );
}

// ── CategorySelector view ──────────────────────────────────────────
function CategoryView() {
  return (
    <div style={{ minHeight: "100dvh", background: "var(--worly-cream)", fontFamily: "'Nunito', sans-serif" }}>
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
