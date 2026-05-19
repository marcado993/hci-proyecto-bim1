"use client";
// components/NameSetup/NameSetup.tsx
// Pantalla inicial de configuración del perfil del niño

import { useState } from "react";
import Image from "next/image";
import { useGameState } from "@/hooks/useGameState";

// Avatares: los que tienen img usan imagen generada; los demás, emoji estilizado
const AVATARS: { id: string; label: string; emoji?: string; img?: string; bg: string; border: string }[] = [
  { id: "leon",      label: "León",      img: "/avatars/avatar_leon.png", bg: "#FFF3E0", border: "#FFB74D" },
  { id: "rana",      label: "Rana",      emoji: "🐸",  bg: "#E8F5E9", border: "#81C784" },
  { id: "mariposa",  label: "Mariposa",  emoji: "🦋",  bg: "#F3E5F5", border: "#CE93D8" },
  { id: "delfin",    label: "Delfín",    emoji: "🐬",  bg: "#E3F2FD", border: "#64B5F6" },
  { id: "zorro",     label: "Zorro",     emoji: "🦊",  bg: "#FBE9E7", border: "#FF8A65" },
  { id: "panda",     label: "Panda",     emoji: "🐼",  bg: "#F5F5F5", border: "#BDBDBD" },
  { id: "unicornio", label: "Unicornio", emoji: "🦄",  bg: "#FCE4EC", border: "#F48FB1" },
  { id: "pinguino",  label: "Pingüino",  emoji: "🐧",  bg: "#E0F7FA", border: "#4DD0E1" },
  { id: "pulpo",     label: "Pulpo",     emoji: "🐙",  bg: "#EDE7F6", border: "#9575CD" },
  { id: "estrella",  label: "Estrella",  emoji: "🌟",  bg: "#FFFDE7", border: "#FFD54F" },
];

export default function NameSetup() {
  const { setProfile } = useGameState();
  const [name, setName]                 = useState("");
  const [selectedId, setSelectedId]     = useState(AVATARS[0].id);
  const [step, setStep]                 = useState<"name" | "avatar">("name");

  const selected = AVATARS.find((a) => a.id === selectedId) ?? AVATARS[0];

  const handleNameSubmit = () => { if (name.trim().length >= 1) setStep("avatar"); };
  const handleFinish     = () => {
    if (!name.trim()) return;
    // Guardamos el emoji o la id para mostrar en el header
    const avatarValue = selected.emoji ?? selected.id;
    setProfile({ name: name.trim(), avatar: avatarValue });
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #EEF6FF 0%, #FFF3F8 50%, #F0FFF4 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "24px",
      fontFamily: "'Nunito', sans-serif",
    }}>

      {/* ── Logo generado ── */}
      <div style={{ textAlign: "center", marginBottom: "32px" }} className="animate-soft-appear">
        <div style={{
          width: "clamp(100px,22vw,140px)", height: "clamp(100px,22vw,140px)",
          position: "relative", margin: "0 auto 16px",
          filter: "drop-shadow(0 8px 24px rgba(192,176,232,0.4))",
          animation: "gentle-float 3.5s ease-in-out infinite",
        }}>
          <Image src="/logo_mundo_lector.png" alt="Mundo Lector logo"
            fill style={{ objectFit: "contain" }} priority />
        </div>
        <h1 style={{
          fontSize: "clamp(1.8rem, 6vw, 2.8rem)", fontWeight: 900,
          color: "#3D3A50", lineHeight: 1.2, margin: 0,
        }}>
          Mundo Lector
        </h1>
        <p style={{ color: "#7A7590", fontSize: "1.05rem", fontWeight: 700, marginTop: "8px" }}>
          ¡Aprendo con alegría! ✨
        </p>
      </div>

      {/* ── Card principal ── */}
      <div style={{
        background: "#FFFCF8", borderRadius: "28px", border: "2px solid #E0DAF0",
        padding: "clamp(24px, 6vw, 48px)", width: "100%", maxWidth: "460px",
        boxShadow: "0 8px 40px rgba(61,58,80,0.09)",
      }} className="animate-soft-appear">

        {/* STEP 1: nombre */}
        {step === "name" && (
          <>
            <h2 style={{ fontSize: "clamp(1.3rem,4vw,1.7rem)", fontWeight: 800,
              color: "#3D3A50", marginBottom: "8px", textAlign: "center" }}>
              ¿Cómo te llamas? 😊
            </h2>
            <p style={{ color: "#7A7590", fontSize: "1rem", textAlign: "center", marginBottom: "28px" }}>
              Escribe tu nombre aquí
            </p>

            <input type="text" value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              placeholder="Mi nombre es..."
              maxLength={20} autoFocus
              style={{
                width: "100%", padding: "18px 20px", fontSize: "1.3rem",
                fontWeight: 700, fontFamily: "'Nunito', sans-serif",
                border: "3px solid #C8DFFE", borderRadius: "16px",
                outline: "none", background: "#F8F6FF", color: "#3D3A50",
                textAlign: "center", transition: "border-color 0.3s ease",
                marginBottom: "20px", boxSizing: "border-box",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#A8C4F0"; }}
              onBlur={(e)  => { e.target.style.borderColor = "#C8DFFE"; }}
            />

            <button className="btn-primary touch-target" onClick={handleNameSubmit}
              disabled={name.trim().length === 0}
              style={{ width: "100%", opacity: name.trim().length === 0 ? 0.5 : 1,
                cursor: name.trim().length === 0 ? "not-allowed" : "pointer" }}>
              ¡Siguiente! →
            </button>
          </>
        )}

        {/* STEP 2: avatar */}
        {step === "avatar" && (
          <>
            <h2 style={{ fontSize: "clamp(1.3rem,4vw,1.7rem)", fontWeight: 800,
              color: "#3D3A50", marginBottom: "4px", textAlign: "center" }}>
              Elige tu amigo 🎨
            </h2>
            <p style={{ color: "#7A7590", fontSize: "0.95rem", textAlign: "center", marginBottom: "20px" }}>
              ¡Será tu compañero de aprendizaje!
            </p>

            {/* Avatar seleccionado — grande */}
            <div style={{
              width: "90px", height: "90px", position: "relative",
              margin: "0 auto 20px",
              background: selected.bg,
              border: `3px solid ${selected.border}`,
              borderRadius: "50%", overflow: "hidden",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "3.2rem",
              animation: "ninja-celebrate 0.5s ease-out",
              boxShadow: `0 6px 20px ${selected.border}55`,
            }}>
              {selected.img ? (
                <Image src={selected.img} alt={selected.label} fill
                  style={{ objectFit: "cover" }} />
              ) : selected.emoji}
            </div>
            <p style={{ textAlign: "center", fontWeight: 800, fontSize: "1rem",
              color: "#3D3A50", marginBottom: "16px" }}>
              {selected.label}
            </p>

            {/* Grid de avatares */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(5, 1fr)",
              gap: "10px", marginBottom: "24px",
            }}>
              {AVATARS.map((av) => {
                const isSelected = av.id === selectedId;
                return (
                  <button key={av.id} onClick={() => setSelectedId(av.id)}
                    title={av.label}
                    style={{
                      aspectRatio: "1", background: isSelected ? av.bg : "#F8F6FF",
                      border: `3px solid ${isSelected ? av.border : "#E0DAF0"}`,
                      borderRadius: "16px", cursor: "pointer",
                      transition: "all 0.2s ease",
                      transform: isSelected ? "scale(1.12)" : "scale(1)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "1.8rem", padding: "6px",
                      position: "relative", overflow: "hidden",
                      boxShadow: isSelected ? `0 4px 12px ${av.border}66` : "none",
                    }}>
                    {av.img ? (
                      <Image src={av.img} alt={av.label} fill
                        style={{ objectFit: "cover", borderRadius: "12px" }} />
                    ) : av.emoji}
                  </button>
                );
              })}
            </div>

            <button className="btn-primary touch-target" onClick={handleFinish}
              style={{ width: "100%" }}>
              ¡Empezar a aprender! {selected.emoji ?? "🌟"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
