"use client";
// components/NameSetup/NameSetup.tsx
// Pantalla de onboarding estilo Worly — Mascota gigante interactiva con seguimiento ocular en tiempo real y ambiente sensorial.

import { useState, useEffect } from "react";
import Image from "next/image";
import { useGameState } from "@/hooks/useGameState";

// ── Ilustraciones SVG Animadas para los Avatares ──
function SVGAvatar({ type, size = 50 }: { type: string; size?: number }) {
  if (type === "leon") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="#FFB74D" />
        <circle cx="50" cy="50" r="32" fill="#E65100" />
        <circle cx="50" cy="54" r="28" fill="#FFB74D" />
        <circle cx="30" cy="30" r="10" fill="#E65100" />
        <circle cx="70" cy="30" r="10" fill="#E65100" />
        <circle cx="30" cy="30" r="6" fill="#FFD54F" />
        <circle cx="70" cy="30" r="6" fill="#FFD54F" />
        <circle cx="40" cy="48" r="5" fill="#1A1530" />
        <circle cx="60" cy="48" r="5" fill="#1A1530" />
        <circle cx="42" cy="46" r="1.5" fill="white" />
        <circle cx="62" cy="46" r="1.5" fill="white" />
        <polygon points="50,56 44,50 56,50" fill="#1A1530" />
        <path d="M 46 62 Q 50 66 54 62" stroke="#1A1530" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "rana") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="50" cy="55" rx="34" ry="26" fill="#81C784" />
        <circle cx="34" cy="34" r="12" fill="#81C784" />
        <circle cx="66" cy="34" r="12" fill="#81C784" />
        <circle cx="34" cy="34" r="8" fill="white" />
        <circle cx="66" cy="34" r="8" fill="white" />
        <circle cx="35" cy="35" r="4.5" fill="#1A1530" />
        <circle cx="65" cy="35" r="4.5" fill="#1A1530" />
        <path d="M 32 58 Q 50 72 68 58" stroke="#1A1530" strokeWidth="3" strokeLinecap="round" />
        <circle cx="26" cy="52" r="5" fill="#FF8A80" opacity="0.6" />
        <circle cx="74" cy="52" r="5" fill="#FF8A80" opacity="0.6" />
      </svg>
    );
  }
  if (type === "mariposa") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 50 50 Q 20 20 24 48 Q 28 76 50 60" fill="#FF4081" opacity="0.85" />
        <path d="M 50 50 Q 80 20 76 48 Q 72 76 50 60" fill="#FF4081" opacity="0.85" />
        <path d="M 50 50 Q 30 70 34 84 Q 38 98 50 64" fill="#FF80AB" opacity="0.85" />
        <path d="M 50 50 Q 70 70 66 84 Q 62 98 50 64" fill="#FF80AB" opacity="0.85" />
        <rect x="46" y="24" width="8" height="52" rx="4" fill="#9C27B0" />
        <path d="M 48 24 Q 40 12 36 14" stroke="#9C27B0" strokeWidth="2" strokeLinecap="round" />
        <path d="M 52 24 Q 60 12 64 14" stroke="#9C27B0" strokeWidth="2" strokeLinecap="round" />
        <circle cx="36" cy="14" r="2.5" fill="#9C27B0" />
        <circle cx="64" cy="14" r="2.5" fill="#9C27B0" />
      </svg>
    );
  }
  if (type === "delfin") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 20 60 C 20 30, 60 20, 80 40 C 70 44, 60 40, 50 46 C 42 50, 36 60, 20 60 Z" fill="#64B5F6" />
        <path d="M 20 60 L 10 54 L 12 66 Z" fill="#64B5F6" />
        <path d="M 20 60 L 10 66 L 14 58 Z" fill="#64B5F6" />
        <circle cx="64" cy="36" r="3.5" fill="#1A1530" />
        <circle cx="65" cy="35" r="1" fill="white" />
        <path d="M 34 60 C 44 54, 52 50, 60 52" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (type === "zorro") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,80 18,36 82,36" fill="#FF7043" />
        <polygon points="50,80 18,36 50,56" fill="white" />
        <polygon points="50,80 82,36 50,56" fill="white" />
        <polygon points="26,36 12,12 36,24" fill="#FF7043" />
        <polygon points="74,36 88,12 64,24" fill="#FF7043" />
        <polygon points="26,36 18,20 32,28" fill="#E64A19" />
        <polygon points="74,36 82,20 68,28" fill="#E64A19" />
        <circle cx="50" cy="74" r="5.5" fill="#1A1530" />
        <circle cx="36" cy="46" r="4.5" fill="#1A1530" />
        <circle cx="64" cy="46" r="4.5" fill="#1A1530" />
        <circle cx="37" cy="45" r="1.5" fill="white" />
        <circle cx="65" cy="45" r="1.5" fill="white" />
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
        <circle cx="38" cy="48" r="4.5" fill="white" />
        <circle cx="62" cy="48" r="4.5" fill="white" />
        <circle cx="39" cy="48" r="2" fill="#1A1530" />
        <circle cx="61" cy="48" r="2" fill="#1A1530" />
        <ellipse cx="50" cy="58" rx="4" ry="2.5" fill="#424242" />
        <path d="M 46 63 Q 50 66 54 63" stroke="#424242" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="50,10 63,38 93,38 70,57 78,87 50,70 22,87 30,57 7,38 37,38" fill="#FFD54F" />
      <circle cx="42" cy="44" r="4" fill="#1A1530" />
      <circle cx="58" cy="44" r="4" fill="#1A1530" />
      <path d="M 44 54 Q 50 60 56 54" stroke="#1A1530" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

const AVATARS: { id: string; label: string; bg: string; border: string }[] = [
  { id: "leon",      label: "León",      bg: "#FFF3E0", border: "#FFB74D" },
  { id: "rana",      label: "Rana",      bg: "#E8F5E9", border: "#81C784" },
  { id: "mariposa",  label: "Mariposa",  bg: "#F3E5F5", border: "#CE93D8" },
  { id: "delfin",    label: "Delfín",    bg: "#E3F2FD", border: "#64B5F6" },
  { id: "zorro",     label: "Zorro",     bg: "#FBE9E7", border: "#FF8A65" },
  { id: "panda",     label: "Panda",     bg: "#F5F5F5", border: "#BDBDBD" },
  { id: "estrella",  label: "Estrella",  bg: "#FFFDE7", border: "#FFD54F" },
];

export default function NameSetup() {
  const { setProfile } = useGameState();
  const [name, setName]             = useState("");
  const [selectedId, setSelectedId] = useState(AVATARS[0].id);
  const [step, setStep]             = useState<"name" | "avatar">("name");
  const [isFocused, setIsFocused]   = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  // ── Seguidor ocular dinámico (Mouse & Touch) ──
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

      // Obtener el centro aproximado de la pantalla (donde están los ojos)
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight * 0.28; // Estimado de altura de ojos de la mascota

      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Limitar el movimiento máximo de la pupila a 10px
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

  const selected = AVATARS.find((a) => a.id === selectedId) ?? AVATARS[0];
  const handleNameSubmit = () => { if (name.trim().length >= 1) setStep("avatar"); };
  const handleFinish     = () => {
    if (!name.trim()) return;
    setProfile({ name: name.trim(), avatar: selected.id });
  };

  const mood = step === "avatar" ? "excited" : name.trim().length > 0 ? "happy" : "waiting";

  return (
    <div style={{
      minHeight: "100dvh",
      background: "var(--worly-cream)",
      fontFamily: "'Nunito', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px 64px",
      position: "relative",
      overflow: "hidden",
    }}>

      {/* ── Estilos Locales Autocontenidos para Animaciones "Squishy" y Bouncy ── */}
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
          transform: scale(1.05) translateY(-3px) !important;
        }
        .squishy-hover:active {
          transform: scale(0.95) translateY(1px) !important;
        }
      `}} />

      {/* ── Elementos Sensoriales de Aprendizaje Flotando (Lectoescritura Autismo) ── */}
      {/* Letra A gigante y sonriente */}
      <div style={{
        position: "absolute", top: "12%", left: "8%", width: "64px", height: "64px",
        animation: "float-letter-a 6s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
      }}>
        <svg viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="40" ry="40" fill="#FF90B3" opacity="0.15" />
          <path d="M 50 15 L 75 80 L 60 80 L 50 50 L 40 50 L 30 80 L 15 80 Z" fill="#FF90B3" />
          <circle cx="42" cy="40" r="3" fill="#1A1530" />
          <circle cx="58" cy="40" r="3" fill="#1A1530" />
        </svg>
      </div>

      {/* Letra B gigante y sonriente */}
      <div style={{
        position: "absolute", top: "45%", right: "6%", width: "70px", height: "70px",
        animation: "float-letter-b 5s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
      }}>
        <svg viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="40" ry="40" fill="#3DDAD4" opacity="0.15" />
          <path d="M 25 15 H 55 C 65 15 72 22 72 32 C 72 40 66 46 58 48 C 68 50 74 58 74 68 C 74 78 66 85 55 85 H 25 Z" fill="#3DDAD4" />
          <circle cx="44" cy="30" r="3" fill="#1A1530" />
          <circle cx="44" cy="65" r="3" fill="#1A1530" />
        </svg>
      </div>

      {/* Letra C gigante y sonriente */}
      <div style={{
        position: "absolute", bottom: "10%", left: "7%", width: "60px", height: "60px",
        animation: "float-letter-c 7s ease-in-out infinite", pointerEvents: "none", zIndex: 0,
      }}>
        <svg viewBox="0 0 100 100" fill="none">
          <ellipse cx="50" cy="50" rx="40" ry="40" fill="#C6F135" opacity="0.15" />
          <path d="M 70 25 C 60 15 40 15 30 25 C 18 35 18 65 30 75 C 40 85 60 85 70 75 L 58 64 C 52 70 42 70 38 64 C 32 58 32 42 38 36 C 42 30 52 30 58 36 Z" fill="#C6F135" />
          <circle cx="45" cy="50" r="4.5" fill="#1A1530" />
        </svg>
      </div>

      {/* ── Mascota gigante en el fondo (La Gran Bola Worly) ── */}
      <div style={{
        position: "absolute",
        top: "8%",
        width: "clamp(280px, 85vw, 420px)",
        height: "clamp(280px, 85vw, 420px)",
        background: "linear-gradient(135deg, #8B6CF7 0%, #6B4AE0 100%)",
        borderRadius: "50%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: "clamp(40px, 12vw, 64px)",
        boxShadow: "0 12px 36px rgba(107, 74, 224, 0.25)",
        zIndex: 1,
        pointerEvents: "none", // CRITICAL FIX: No click interceptions!
        transform: isBtnHovered ? "scale(1.03) translateY(-4px)" : "scale(1)",
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
          {/* Ojo Izquierdo */}
          <div style={{
            width: "clamp(44px, 12vw, 56px)",
            height: "clamp(44px, 12vw, 56px)",
            background: "#FFFFFF",
            borderRadius: "50%",
            position: "relative",
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
                width: "8px",
                height: "8px",
                background: "#FFFFFF",
                borderRadius: "50%",
                position: "absolute",
                top: "20%",
                right: "20%",
              }} />
            </div>
          </div>

          {/* Ojo Derecho */}
          <div style={{
            width: "clamp(44px, 12vw, 56px)",
            height: "clamp(44px, 12vw, 56px)",
            background: "#FFFFFF",
            borderRadius: "50%",
            position: "relative",
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
                width: "8px",
                height: "8px",
                background: "#FFFFFF",
                borderRadius: "50%",
                position: "absolute",
                top: "20%",
                right: "20%",
              }} />
            </div>
          </div>
        </div>

        {/* Boca sonriente */}
        {mood === "excited" || isBtnHovered ? (
          <svg width="48" height="24" viewBox="0 0 48 24" fill="none">
            <path d="M 4 2 Q 24 28 44 2" stroke="#1A1530" strokeWidth="6" strokeLinecap="round" />
          </svg>
        ) : mood === "waiting" ? (
          <svg width="36" height="12" viewBox="0 0 36 12" fill="none">
            <path d="M 4 6 Q 18 10 32 6" stroke="#1A1530" strokeWidth="5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="42" height="20" viewBox="0 0 42 20" fill="none">
            <path d="M 4 4 Q 21 22 38 4" stroke="#1A1530" strokeWidth="5.5" strokeLinecap="round" />
          </svg>
        )}

        {/* Mejillas rosadas */}
        <div style={{
          position: "absolute",
          top: "38%",
          left: "14%",
          width: "28px",
          height: "18px",
          background: "rgba(255,144,179,0.5)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute",
          top: "38%",
          right: "14%",
          width: "28px",
          height: "18px",
          background: "rgba(255,144,179,0.5)",
          borderRadius: "50%",
        }} />
      </div>

      {/* ── Brazos abrazando la tarjeta (pointer-events: none) ── */}
      <div style={{
        position: "absolute",
        top: "20%",
        width: "clamp(340px, 95vw, 520px)",
        height: "120px",
        pointerEvents: "none",
        zIndex: 3,
      }}>
        <svg width="100%" height="100%" viewBox="0 0 520 120" fill="none" style={{ overflow: "visible" }}>
          {/* Brazo Izquierdo */}
          <path
            d="M 90 40 Q 30 50 72 96"
            stroke="#8B6CF7"
            strokeWidth="18"
            strokeLinecap="round"
            style={{
              transformOrigin: "90px 40px",
              transform: isFocused ? "rotate(-4deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
          <g style={{
            transformOrigin: "72px 98px",
            transform: isFocused ? "translate(-4px, -2px)" : "translate(0,0)",
            transition: "transform 0.2s ease",
          }}>
            <circle cx="72" cy="98" r="14" fill="#A78BFA" />
            <circle cx="58" cy="92" r="10" fill="#A78BFA" />
            <circle cx="86" cy="92" r="10" fill="#A78BFA" />
          </g>

          {/* Brazo Derecho */}
          <path
            d="M 430 40 Q 490 50 448 96"
            stroke="#8B6CF7"
            strokeWidth="18"
            strokeLinecap="round"
            style={{
              transformOrigin: "430px 40px",
              transform: isFocused ? "rotate(4deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
          <g style={{
            transformOrigin: "448px 98px",
            transform: isFocused ? "translate(4px, -2px)" : "translate(0,0)",
            transition: "transform 0.2s ease",
          }}>
            <circle cx="448" cy="98" r="14" fill="#A78BFA" />
            <circle cx="462" cy="92" r="10" fill="#A78BFA" />
            <circle cx="434" cy="92" r="10" fill="#A78BFA" />
          </g>
        </svg>
      </div>

      {/* ── Nombre / Logo de la app ── */}
      <div style={{
        position: "relative",
        zIndex: 5,
        textAlign: "center",
        marginBottom: "clamp(120px, 32vw, 170px)",
      }}>
        <h1 style={{
          fontFamily: "var(--font-fredoka), cursive",
          fontSize: "clamp(2.4rem, 8vw, 3.4rem)",
          color: "#FFFFFF",
          margin: 0,
          textShadow: "0 4px 16px rgba(107, 74, 224, 0.4)",
          letterSpacing: "-0.01em",
        }}>
          worly
        </h1>
        <p style={{
          color: "rgba(255, 255, 255, 0.9)",
          fontSize: "clamp(0.85rem, 2.5vw, 1.05rem)",
          fontWeight: 700,
          margin: "4px 0 0",
          textTransform: "uppercase",
          letterSpacing: "0.15em",
        }}>
          Aprende palabras con alegría
        </p>
      </div>

      {/* ── Tarjeta de Formulario (Name Setup) ── */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: "400px",
        zIndex: 2,
      }}>
        <div className="animate-soft-appear" style={{
          background: "#FFFFFF",
          borderRadius: "28px",
          border: "3px solid var(--worly-border)",
          padding: "clamp(24px, 6vw, 38px)",
          boxShadow: "0 12px 48px rgba(123,92,246,0.16)",
        }}>
          {/* STEP 1: nombre */}
          {step === "name" && (
            <>
              <h2 style={{
                fontFamily: "var(--font-fredoka), cursive",
                fontSize: "clamp(1.5rem, 5vw, 1.85rem)",
                color: "var(--worly-text)",
                marginBottom: "6px",
                textAlign: "center",
              }}>
                ¿Cómo te llamas?
              </h2>
              <p style={{ color: "var(--worly-text-soft)", fontSize: "0.95rem", textAlign: "center", marginBottom: "24px", fontWeight: 700 }}>
                Cuéntanos tu nombre para empezar 😊
              </p>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
                placeholder="Mi nombre es..."
                maxLength={20}
                autoFocus
                className="worly-input"
                style={{ marginBottom: "20px", textAlign: "center", display: "block", boxSizing: "border-box" }}
              />

              <button
                className="btn-primary touch-target squishy-hover"
                onClick={handleNameSubmit}
                onMouseEnter={() => setIsBtnHovered(true)}
                onMouseLeave={() => setIsBtnHovered(false)}
                disabled={name.trim().length === 0}
                style={{ width: "100%" }}
              >
                ¡Siguiente! →
              </button>
            </>
          )}

          {/* STEP 2: avatar */}
          {step === "avatar" && (
            <>
              <h2 style={{
                fontFamily: "var(--font-fredoka), cursive",
                fontSize: "clamp(1.3rem, 5vw, 1.7rem)",
                color: "var(--worly-text)",
                marginBottom: "4px",
                textAlign: "center",
              }}>
                Elige tu amigo 🎨
              </h2>
              <p style={{ color: "var(--worly-text-soft)", fontSize: "0.92rem", textAlign: "center", marginBottom: "16px", fontWeight: 700 }}>
                Será tu compañero de aprendizaje
              </p>

              {/* Avatar seleccionado grande */}
              <div style={{
                width: "76px", height: "76px",
                background: selected.bg,
                border: `3px solid ${selected.border}`,
                borderRadius: "50%",
                margin: "0 auto 8px",
                overflow: "hidden",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
                animation: "mascot-celebrate 0.5s ease-out",
                boxShadow: `0 6px 20px ${selected.border}55`,
              }}>
                <SVGAvatar type={selected.id} size={54} />
              </div>
              <p style={{ textAlign: "center", fontWeight: 800, fontSize: "0.9rem", color: "var(--worly-text)", marginBottom: "14px" }}>
                {selected.label}
              </p>

              {/* Grid avatares */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "20px" }}>
                {AVATARS.map((av) => {
                  const isSel = av.id === selectedId;
                  return (
                    <button
                      key={av.id}
                      onClick={() => setSelectedId(av.id)}
                      title={av.label}
                      className="squishy-hover"
                      style={{
                        aspectRatio: "1",
                        background: isSel ? av.bg : "#F8F6FF",
                        border: `3px solid ${isSel ? av.border : "#E5E0F5"}`,
                        borderRadius: "14px",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        transform: isSel ? "scale(1.1)" : "scale(1)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: "4px",
                        position: "relative", overflow: "hidden",
                        boxShadow: isSel ? `0 4px 12px ${av.border}66` : "none",
                      }}
                    >
                      <SVGAvatar type={av.id} size={36} />
                    </button>
                  );
                })}
              </div>

              <button
                className="btn-primary touch-target squishy-hover"
                onClick={handleFinish}
                onMouseEnter={() => setIsBtnHovered(true)}
                onMouseLeave={() => setIsBtnHovered(false)}
                style={{ width: "100%" }}
              >
                ¡Empezar a aprender! 🌟
              </button>
            </>
          )}
        </div>
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
          transform: isFocused ? "rotate(3deg) scaleY(1.05)" : "rotate(0deg) scaleY(1)",
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
          transform: isFocused ? "rotate(-3deg) scaleY(1.05)" : "rotate(0deg) scaleY(1)",
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
