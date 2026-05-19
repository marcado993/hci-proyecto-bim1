"use client";
// components/SensoryReading/SensoryReadingModule.tsx

import { useEffect, useCallback, useRef, useState } from "react";
import { useGameState } from "@/hooks/useGameState";
import { useDelayedHint } from "@/hooks/useDelayedHint";
import { useSpeech } from "@/hooks/useSpeech";
import { CATEGORIES } from "@/lib/vocabulary";
import Image from "next/image";
import VirtualKeyboard from "@/components/VirtualKeyboard/VirtualKeyboard";

export default function SensoryReadingModule() {
  const { state, currentExercise, submitWord, nextExercise, resetStatus, clearSession } = useGameState();
  const { status, activeCategoryId, currentIndex, exercises, stars, streak } = state;
  const { speakSentence, speakSuccess, speakTryAgain, speakHint, speak } = useSpeech();

  const [typedWord, setTypedWord]   = useState("");
  const [buttonsDisabled, setBtns]  = useState(false);
  const [audioEnabled, setAudio]    = useState(false);

  const isActive = status === "idle";
  const { isHintVisible, resetHint } = useDelayedHint(isActive, 7000);
  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId);
  const advanceTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Al cambiar ejercicio: limpiar + hablar
  useEffect(() => {
    setTypedWord("");
    setBtns(false);
    if (currentExercise && audioEnabled) {
      setTimeout(() => {
        speak(currentExercise.word.word, 0.75); // Dice el nombre de la palabra primero
        setTimeout(() => speakSentence(currentExercise.sentence), 1200);
      }, 400);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise?.id, audioEnabled]);

  // Pista de sílabas hablada
  useEffect(() => {
    if (isHintVisible && audioEnabled && currentExercise)
      speakHint(currentExercise.word.syllables);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHintVisible]);

  // Avance automático
  useEffect(() => {
    if (status === "correct") {
      advanceTimer.current = setTimeout(() => nextExercise(), 2200);
    }
    if (status === "neutral-reset") {
      setBtns(true);
      if (audioEnabled) speakTryAgain();
      advanceTimer.current = setTimeout(() => { resetStatus(); setTypedWord(""); setBtns(false); }, 1500);
    }
    return () => { if (advanceTimer.current) clearTimeout(advanceTimer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Auto-verificar al completar la palabra
  useEffect(() => {
    if (!currentExercise || !typedWord || status !== "idle") return;
    if (typedWord.length === currentExercise.answer.length) {
      const t = setTimeout(() => {
        resetHint();
        submitWord(typedWord);
        if (typedWord.toLowerCase() === currentExercise.answer.toLowerCase() && audioEnabled)
          speakSuccess(state.profile?.name ?? "campeón", currentExercise.answer);
      }, 350);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedWord]);

  // Teclado físico
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (buttonsDisabled || status !== "idle" || !currentExercise) return;
      const k = e.key.toUpperCase();
      if (/^[A-ZÁÉÍÓÚÜÑ]$/.test(k) && typedWord.length < currentExercise.answer.length) {
        setTypedWord((p) => p + k); resetHint();
      }
      if (e.key === "Backspace") { setTypedWord((p) => p.slice(0, -1)); resetHint(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttonsDisabled, status, typedWord, currentExercise]);

  const handleKeyPress = useCallback((letter: string) => {
    if (!currentExercise || buttonsDisabled || status !== "idle") return;
    if (typedWord.length < currentExercise.answer.length) { setTypedWord((p) => p + letter); resetHint(); }
  }, [currentExercise, buttonsDisabled, status, typedWord, resetHint]);

  const handleBackspace = useCallback(() => setTypedWord((p) => p.slice(0, -1)), []);

  if (!currentExercise) return null;

  const { word, pictogramSrc } = currentExercise;
  const progress = ((currentIndex + 1) / exercises.length) * 100;
  const [before, after] = currentExercise.sentence.split("___");
  const hintLetter = isHintVisible ? currentExercise.answer[0] : undefined;
  const remaining = currentExercise.answer.length - typedWord.length;

  return (
    /* ── Contenedor raíz: ocupa toda la pantalla, no corta ── */
    <div style={{
      height: "100dvh",
      display: "flex",
      flexDirection: "column",
      background: "linear-gradient(135deg,#EEF6FF 0%,#FFF8EE 45%,#F0FFF4 100%)",
      fontFamily: "'Nunito',sans-serif",
      overflow: "hidden",
    }}>

      {/* ══ HEADER ══ */}
      <header style={{
        flexShrink: 0,
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 20px",
        background: "rgba(255,252,248,0.97)",
        backdropFilter: "blur(16px)",
        borderBottom: "2px solid #E0DAF0",
        zIndex: 30,
      }}>
        <button onClick={clearSession} aria-label="Volver" style={{
          background:"#F0EEF8", border:"2px solid #D9D4F0", borderRadius:"12px",
          padding:"8px 14px", fontSize:"0.9rem", fontWeight:700, color:"#6B6880",
          cursor:"pointer", fontFamily:"'Nunito',sans-serif", minHeight:"44px",
          flexShrink:0, transition:"all 0.25s ease",
        }}>← Salir</button>

        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"6px", marginBottom:"5px" }}>
            <span>{activeCategory?.emoji ?? "📚"}</span>
            <span style={{ fontSize:"0.75rem", fontWeight:800, color:"#7A7590", textTransform:"uppercase", letterSpacing:"0.08em", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
              {activeCategory?.label}
            </span>
            <span style={{ marginLeft:"auto", fontSize:"0.75rem", fontWeight:700, color:"#7A7590", flexShrink:0 }}>
              {currentIndex + 1} / {exercises.length}
            </span>
          </div>
          <div className="progress-bar" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width:`${progress}%` }} />
          </div>
        </div>

        {/* Botón audio */}
        <button onClick={() => { setAudio(true); if (currentExercise) { speak(word.word, 0.75); setTimeout(() => speakSentence(currentExercise.sentence), 1000); } }}
          aria-label="Escuchar" title="Escuchar la palabra y la oración" style={{
            background: audioEnabled ? "#C8EDD4" : "#F0EEF8",
            border:`2px solid ${audioEnabled ? "#A2D8B0" : "#D9D4F0"}`,
            borderRadius:"12px", padding:"8px 12px", fontSize:"1.2rem",
            cursor:"pointer", minHeight:"44px", display:"flex", alignItems:"center",
            transition:"all 0.25s ease", flexShrink:0,
          }}>🔊</button>

        <div style={{ background:"#FFF3C4", border:"2px solid #F0DC90", borderRadius:"12px", padding:"4px 12px", textAlign:"center", flexShrink:0 }}>
          <p style={{ fontSize:"0.8rem", margin:0 }}>⭐</p>
          <p style={{ fontSize:"0.85rem", fontWeight:900, color:"#3D3A50", margin:0, lineHeight:1 }}>{stars}</p>
        </div>
      </header>

      {/* ══ CUERPO: flex-row en desktop, flex-col en móvil ══ */}
      <div style={{ flex:1, display:"flex", overflow:"hidden" }} className="exercise-body">

        {/* ── PANEL IZQUIERDO: Pictograma + nombre de palabra ── */}
        <div style={{ display:"flex", flexDirection:"column", padding:"16px", gap:"12px", overflowY:"auto" }}
             className="exercise-left">

          {/* Pictograma */}
          <div style={{
            background: status === "correct" ? "#C8EDD4" : status === "neutral-reset" ? "#F5F3FF" : word.color,
            border:`3px solid ${status === "correct" ? "#A2D8B0" : status === "neutral-reset" ? "#E0DAF0" : word.colorBorder}`,
            borderRadius:"24px", padding:"20px",
            display:"flex", flexDirection:"column", alignItems:"center", gap:"10px",
            transition:"all 0.6s ease", flex:"0 0 auto",
            animation: status === "correct" ? "success-bloom 0.9s ease-out" : isHintVisible && status === "idle" ? "slow-pulse 3s ease-in-out infinite" : "none",
          }}>
            {pictogramSrc ? (
              <div style={{ width:"100%", maxWidth:"220px", aspectRatio:"1", borderRadius:"16px", overflow:"hidden", position:"relative" }}>
                <Image src={pictogramSrc} alt={`Pictograma de ${word.word}`} fill style={{ objectFit:"cover", borderRadius:"16px" }} sizes="220px" priority />
              </div>
            ) : (
              <div style={{ fontSize:"clamp(5rem,12vw,8rem)", lineHeight:1, textAlign:"center" }} className={isHintVisible ? "animate-gentle-float" : ""}>
                {word.emoji}
              </div>
            )}

            {/* NOMBRE DE LA PALABRA — siempre visible y grande */}
            <div style={{
              background:"rgba(255,255,255,0.85)", borderRadius:"14px",
              padding:"8px 20px", textAlign:"center",
            }}>
              <p style={{ fontSize:"clamp(1.4rem,3.5vw,2rem)", fontWeight:900, color:"#3D3A50", margin:0, letterSpacing:"0.05em" }}>
                {word.word}
              </p>
              <p style={{ fontSize:"0.8rem", color:"#B0AABB", fontWeight:700, margin:"2px 0 0", letterSpacing:"0.2em" }}>
                {word.syllables}
              </p>
            </div>

            {/* Etiqueta categoría + dificultad */}
            <div style={{ display:"flex", gap:"8px", flexWrap:"wrap", justifyContent:"center" }}>
              <span style={{ background:"rgba(255,255,255,0.7)", borderRadius:"20px", padding:"3px 12px", fontSize:"0.75rem", fontWeight:700, color:"#7A7590" }}>
                {word.categoryLabel}
              </span>
              <span style={{ fontSize:"0.75rem", color:"#7A7590", fontWeight:600 }}>
                {word.difficulty === "easy" ? "🌱 Fácil" : "🌟 Media"}
              </span>
            </div>

            {/* Pista sílabas hint */}
            {isHintVisible && status === "idle" && (
              <div className="animate-soft-appear" style={{ background:"rgba(255,255,255,0.9)", border:"2px solid #C0B0E8", borderRadius:"10px", padding:"4px 12px" }}>
                <p style={{ fontSize:"0.75rem", color:"#9A80C8", fontWeight:800, margin:0, letterSpacing:"0.15em" }}>
                  💡 {word.syllables}
                </p>
              </div>
            )}
          </div>

          {/* Feedback correcto */}
          {status === "correct" && (
            <div className="animate-soft-appear" style={{ background:"#C8EDD4", border:"2px solid #A2D8B0", borderRadius:"18px", padding:"14px", textAlign:"center" }}>
              <p style={{ fontSize:"1.6rem", margin:0 }}>⭐</p>
              <p style={{ fontSize:"1rem", fontWeight:800, color:"#2A7A4A", margin:"4px 0 0" }}>¡Muy bien, {state.profile?.name ?? "campeón"}!</p>
              {streak >= 3 && <p style={{ fontSize:"0.8rem", color:"#4A9A6A", fontWeight:700, margin:"2px 0 0" }}>🔥 ¡{streak} seguidas!</p>}
            </div>
          )}

          {/* Feedback neutro */}
          {status === "neutral-reset" && (
            <div className="animate-neutral-fade" style={{ background:"#F5F3FF", border:"2px solid #E0DAF0", borderRadius:"18px", padding:"12px", textAlign:"center" }}>
              <p style={{ fontSize:"0.95rem", fontWeight:700, color:"#7A7590", margin:0 }}>💫 Prueba otra letra…</p>
              <p style={{ fontSize:"0.8rem", color:"#9A96B0", fontWeight:600, margin:"3px 0 0" }}>Mira la palabra del dibujo 🖼️</p>
            </div>
          )}
        </div>

        {/* ── PANEL DERECHO: Oración + tiles + teclado ── */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"16px", gap:"12px", overflowY:"auto" }}
             className="exercise-right">

          {/* Oración cloze */}
          <div style={{ background:"#FFFCF8", border:"2px solid #E0DAF0", borderRadius:"20px", padding:"18px 16px", textAlign:"center", flexShrink:0 }}>
            <p style={{ fontSize:"0.72rem", fontWeight:800, color:"#B0AABB", marginBottom:"10px", textTransform:"uppercase", letterSpacing:"0.1em" }}>
              Completa la oración
            </p>
            <div style={{ fontSize:"clamp(1rem,3vw,1.5rem)", fontWeight:800, color:"#3D3A50", lineHeight:1.8, display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", gap:"6px" }}>
              <span>{before}</span>
              <span role="status" aria-live="polite"
                className={`word-slot ${status === "correct" ? "filled" : status === "neutral-reset" ? "neutral-reset" : isHintVisible ? "hint-active" : ""}`}
                style={{ minWidth:"clamp(80px,20vw,130px)", padding:"8px 12px", fontSize:"clamp(1rem,2.5vw,1.3rem)", fontWeight:900, color: status === "correct" ? "#2A7A4A" : "#7A7590" }}>
                {status === "correct" ? currentExercise.answer : typedWord || "___"}
              </span>
              <span>{after}</span>
            </div>

            {/* Tiles de letras */}
            {typedWord.length > 0 && status === "idle" && (
              <div className="animate-soft-appear" style={{ display:"flex", justifyContent:"center", gap:"5px", marginTop:"12px", flexWrap:"wrap" }}>
                {typedWord.split("").map((l, i) => (
                  <span key={i} style={{
                    width:"clamp(26px,5vw,40px)", height:"clamp(26px,5vw,40px)",
                    background:"#DDD4F5", border:"2px solid #C0B0E8", borderRadius:"8px",
                    display:"inline-flex", alignItems:"center", justifyContent:"center",
                    fontSize:"clamp(0.85rem,2vw,1.1rem)", fontWeight:900, color:"#3D3A50",
                    animation:"slot-fill 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards",
                    animationDelay:`${i * 0.04}s`, opacity:0,
                  }}>{l}</span>
                ))}
                {Array.from({ length: remaining }).map((_, i) => (
                  <span key={`e${i}`} style={{
                    width:"clamp(26px,5vw,40px)", height:"clamp(26px,5vw,40px)",
                    border:"2px dashed #D9D4F0", borderRadius:"8px",
                    display:"inline-flex", alignItems:"center", justifyContent:"center",
                    fontSize:"0.65rem", color:"#D9D4F0",
                  }}>_</span>
                ))}
              </div>
            )}

            {/* Letras restantes */}
            {status === "idle" && typedWord.length > 0 && (
              <p style={{ textAlign:"center", fontSize:"0.78rem", fontWeight:700, color:"#B0AABB", marginTop:"8px", marginBottom:0 }}>
                {remaining > 0 ? `Faltan ${remaining} letra${remaining !== 1 ? "s" : ""}…` : "✓ ¡Verificando!"}
              </p>
            )}
          </div>

          {/* Instrucción affordance */}
          {status === "idle" && typedWord.length === 0 && (
            <div style={{ textAlign:"center", padding:"4px 0" }}>
              <p style={{ fontSize:"clamp(0.85rem,2vw,1rem)", fontWeight:700, color:"#B0AABB", margin:0 }}>
                👇 Haz clic en las letras para escribir la palabra
              </p>
              <p style={{ fontSize:"clamp(0.75rem,1.5vw,0.85rem)", fontWeight:600, color:"#C5C0D5", margin:"3px 0 0" }}>
                También puedes escribir con el teclado de tu computadora
              </p>
            </div>
          )}

          {/* ── TECLADO VIRTUAL — siempre visible ── */}
          <div style={{ background:"rgba(255,252,248,0.97)", border:"2px solid #E0DAF0", borderRadius:"20px", padding:"clamp(10px,2vw,18px)", flex:"1 1 auto" }}>
            <VirtualKeyboard
              typedWord={typedWord}
              maxLength={currentExercise.answer.length}
              onKeyPress={handleKeyPress}
              onBackspace={handleBackspace}
              disabled={buttonsDisabled || status !== "idle"}
              hintLetter={hintLetter}
            />
          </div>
          {/* Racha */}
          {streak >= 2 && (
            <div style={{ textAlign:"center" }}>
              <span style={{ background:"#FFF3C4", border:"2px solid #F0DC90", borderRadius:"12px", padding:"4px 14px", fontSize:"0.82rem", fontWeight:800, color:"#3D3A50" }}>
                🔥 Racha ×{streak}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
