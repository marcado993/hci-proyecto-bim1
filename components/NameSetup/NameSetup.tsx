"use client";
// components/NameSetup/NameSetup.tsx
// Pantalla inicial de configuración del perfil del niño

import { useState } from "react";
import { useGameState } from "@/hooks/useGameState";

const AVATARS = ["🦁", "🐸", "🦋", "🐬", "🦊", "🐼", "🦄", "🐧", "🐙", "🌟"];

export default function NameSetup() {
  const { setProfile } = useGameState();
  const [name, setName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
  const [step, setStep] = useState<"name" | "avatar">("name");

  const handleNameSubmit = () => {
    const trimmed = name.trim();
    if (trimmed.length < 1) return;
    setStep("avatar");
  };

  const handleFinish = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setProfile({ name: trimmed, avatar: selectedAvatar });
  };

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #EEF6FF 0%, #FFF3F8 50%, #F0FFF4 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Nunito', sans-serif",
    }}>
      {/* Logo */}
      <div style={{ textAlign: "center", marginBottom: "40px" }} className="animate-soft-appear">
        <div style={{ fontSize: "72px", marginBottom: "12px" }}>📖</div>
        <h1 style={{
          fontSize: "clamp(1.8rem, 6vw, 2.8rem)",
          fontWeight: 900,
          color: "#3D3A50",
          lineHeight: 1.2,
        }}>
          Mundo Lector
        </h1>
        <p style={{ color: "#7A7590", fontSize: "1.1rem", fontWeight: 600, marginTop: "8px" }}>
          ¡Aprendo con alegría! ✨
        </p>
      </div>

      {/* Card principal */}
      <div style={{
        background: "#FFFCF8",
        borderRadius: "28px",
        border: "2px solid #E0DAF0",
        padding: "clamp(24px, 6vw, 48px)",
        width: "100%",
        maxWidth: "440px",
        boxShadow: "0 8px 40px rgba(61,58,80,0.08)",
      }} className="animate-soft-appear">

        {step === "name" && (
          <>
            <h2 style={{
              fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
              fontWeight: 800,
              color: "#3D3A50",
              marginBottom: "8px",
              textAlign: "center",
            }}>
              ¿Cómo te llamas? 😊
            </h2>
            <p style={{ color: "#7A7590", fontSize: "1rem", textAlign: "center", marginBottom: "28px" }}>
              Escribe tu nombre aquí
            </p>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              placeholder="Mi nombre es..."
              maxLength={20}
              autoFocus
              style={{
                width: "100%",
                padding: "18px 20px",
                fontSize: "1.3rem",
                fontWeight: 700,
                fontFamily: "'Nunito', sans-serif",
                border: "3px solid #C8DFFE",
                borderRadius: "16px",
                outline: "none",
                background: "#F8F6FF",
                color: "#3D3A50",
                textAlign: "center",
                transition: "border-color 0.3s ease",
                marginBottom: "20px",
                boxSizing: "border-box",
              }}
              onFocus={(e) => { e.target.style.borderColor = "#A8C4F0"; }}
              onBlur={(e) => { e.target.style.borderColor = "#C8DFFE"; }}
            />

            <button
              className="btn-primary touch-target"
              onClick={handleNameSubmit}
              disabled={name.trim().length === 0}
              style={{
                width: "100%",
                opacity: name.trim().length === 0 ? 0.5 : 1,
                cursor: name.trim().length === 0 ? "not-allowed" : "pointer",
              }}
            >
              ¡Siguiente! →
            </button>
          </>
        )}

        {step === "avatar" && (
          <>
            <h2 style={{
              fontSize: "clamp(1.3rem, 4vw, 1.7rem)",
              fontWeight: 800,
              color: "#3D3A50",
              marginBottom: "8px",
              textAlign: "center",
            }}>
              Elige tu amigo 🎨
            </h2>
            <p style={{ color: "#7A7590", fontSize: "1rem", textAlign: "center", marginBottom: "24px" }}>
              ¡Será tu compañero de aprendizaje!
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "12px",
              marginBottom: "28px",
            }}>
              {AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => setSelectedAvatar(av)}
                  className="touch-target"
                  style={{
                    fontSize: "2.2rem",
                    background: selectedAvatar === av ? "#C8DFFE" : "#F8F6FF",
                    border: selectedAvatar === av ? "3px solid #A8C4F0" : "3px solid #E0DAF0",
                    borderRadius: "16px",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    transform: selectedAvatar === av ? "scale(1.1)" : "scale(1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px",
                    width: "100%",
                    aspectRatio: "1",
                  }}
                >
                  {av}
                </button>
              ))}
            </div>

            <button
              className="btn-primary touch-target"
              onClick={handleFinish}
              style={{ width: "100%" }}
            >
              ¡Empezar a aprender! {selectedAvatar}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
