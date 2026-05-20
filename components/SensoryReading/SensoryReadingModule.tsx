"use client";
// components/SensoryReading/SensoryReadingModule.tsx — Estilo Worly

import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import { useGameState } from "@/hooks/useGameState";
import { useDelayedHint } from "@/hooks/useDelayedHint";
import { useSpeech } from "@/hooks/useSpeech";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { CATEGORIES } from "@/lib/vocabulary";
import Image from "next/image";

const ALPHABET = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z","Á","É","Í","Ó","Ú"];

function getAdaptiveLetters(answer: string, difficulty: string): string[] {
  const word = answer.toUpperCase();
  const wordLetters = [...new Set(word.split(""))];
  if (difficulty === "Difícil") return ALPHABET;
  const pool = ALPHABET.filter((l) => !wordLetters.includes(l)).sort(() => Math.random() - 0.5);
  const extras = difficulty === "Fácil" ? 3 : 5;
  return [...wordLetters, ...pool.slice(0, extras)].sort(() => Math.random() - 0.5);
}

// ── Teclas adaptivas estilo Worly ────────────────────────────────────
function AdaptiveKeys({ letters, onPress, disabled, hintLetter, difficulty }: {
  letters: string[]; onPress: (l: string) => void;
  disabled: boolean; hintLetter?: string; difficulty: string;
}) {
  const cols = difficulty === "Fácil" ? 4 : difficulty === "Media" ? 5 : 8;
  const btnSize = difficulty === "Fácil" ? "clamp(58px,14vw,84px)" : difficulty === "Media" ? "clamp(46px,11vw,68px)" : "clamp(34px,7vw,50px)";
  const fontSize = difficulty === "Fácil" ? "clamp(1.3rem,4vw,1.7rem)" : difficulty === "Media" ? "clamp(1rem,2.8vw,1.3rem)" : "clamp(0.75rem,1.8vw,0.95rem)";

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "clamp(5px,1.5vw,8px)" }}>
      {letters.map((l) => {
        const isHinted = !disabled && hintLetter && l === hintLetter.toUpperCase();
        return (
          <button
            key={l}
            onClick={() => !disabled && onPress(l)}
            disabled={disabled}
            aria-label={`Letra ${l}`}
            style={{
              height: btnSize, width: "100%",
              background: disabled ? "#F0EEF8" : isHinted ? "#D4CCFF" : "#FFFFFF",
              border: `2.5px solid ${disabled ? "#E5E0F5" : isHinted ? "#7B5CF6" : "#E5E0F5"}`,
              borderRadius: "14px",
              fontSize, fontWeight: 900,
              fontFamily: "'Nunito', sans-serif",
              color: disabled ? "#C0BADC" : isHinted ? "#5B3FD9" : "#1A1530",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
              transition: "all 0.15s ease",
              animation: isHinted ? "key-ninja-pulse 0.9s ease-in-out infinite" : "none",
              boxShadow: disabled ? "none" : isHinted ? "0 0 0 3px rgba(123,92,246,0.2)" : "0 2px 8px rgba(26,21,48,0.08)",
            }}
            onMouseDown={(e) => {
              if (!disabled) {
                (e.currentTarget as HTMLElement).style.transform = "scale(0.88)";
                (e.currentTarget as HTMLElement).style.background = "#EDE9FF";
              }
            }}
            onMouseUp={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLElement).style.background = isHinted ? "#D4CCFF" : "#FFFFFF";
            }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

// ── Slots de letras estilo Worly ─────────────────────────────────────
function LetterSlots({ answer, typed, status, slotSize = 56, hintIndex }: {
  answer: string; typed: string; status: string; slotSize?: number; hintIndex?: number;
}) {
  return (
    <div style={{ display: "flex", gap: "clamp(6px,2vw,10px)", justifyContent: "center", flexWrap: "wrap" }}>
      {answer.split("").map((_, i) => {
        const letter = typed[i];
        const filled = !!letter;
        const isCorrect = status === "correct";
        const isNinjaSlot = hintIndex !== undefined && i === hintIndex && !filled && status === "idle";
        return (
          <div key={i} style={{
            width: slotSize, height: slotSize,
            background: isCorrect ? "#C6F135" : filled ? "#EDE9FF" : isNinjaSlot ? "rgba(123,92,246,0.08)" : "transparent",
            border: `3px ${filled ? "solid" : "dashed"} ${isCorrect ? "#A8D420" : filled ? "#7B5CF6" : isNinjaSlot ? "#7B5CF6" : "#C5C0D8"}`,
            borderRadius: "14px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: `${slotSize * 0.45}px`, fontWeight: 900,
            color: isCorrect ? "#2A4A00" : "#1A1530",
            transition: "border-color 0.3s ease, background 0.3s ease",
            fontFamily: "var(--font-fredoka), cursive",
            animation: isNinjaSlot
              ? "ninja-bounce 0.7s ease-in-out infinite"
              : filled && !isCorrect ? "slot-fill 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
            boxShadow: isNinjaSlot ? "0 0 14px rgba(123,92,246,0.4)" : filled && !isCorrect ? "0 2px 10px rgba(123,92,246,0.2)" : "none",
          }}>
            {letter || (isNinjaSlot ? "?" : "")}
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
export default function SensoryReadingModule() {
  const { state, currentExercise, submitWord, nextExercise, resetStatus, clearSession } = useGameState();
  const { status, activeCategoryId, currentIndex, exercises, stars, streak } = state;
  const { speak } = useSpeech();
  const isDesktop = useIsDesktop(768);

  const [typed, setTyped]   = useState("");
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = status === "idle";
  const { isHintVisible, resetHint } = useDelayedHint(isActive, 7000);
  const cat = CATEGORIES.find((c) => c.id === activeCategoryId);

  const adaptiveLetters = useMemo(() => {
    if (!currentExercise) return [];
    return getAdaptiveLetters(currentExercise.answer, currentExercise.word.difficulty);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise?.id]);

  useEffect(() => {
    setTyped(""); setLocked(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise?.id]);

  useEffect(() => {
    if (status === "correct")       timer.current = setTimeout(() => nextExercise(), 2000);
    if (status === "neutral-reset") {
      setLocked(true);
      timer.current = setTimeout(() => { resetStatus(); setTyped(""); setLocked(false); }, 1400);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    if (!currentExercise || !typed || status !== "idle") return;
    if (typed.length === currentExercise.answer.length) {
      const t = setTimeout(() => {
        resetHint(); submitWord(typed);
        if (typed.toLowerCase() === currentExercise.answer.toLowerCase())
          speak(currentExercise.answer, 0.78);
      }, 350);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (locked || status !== "idle" || !currentExercise) return;
      const k = e.key.toUpperCase();
      if (/^[A-ZÁÉÍÓÚÜÑ]$/.test(k) && typed.length < currentExercise.answer.length)
        { setTyped(p => p + k); resetHint(); }
      if (e.key === "Backspace") { setTyped(p => p.slice(0, -1)); resetHint(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, status, typed, currentExercise]);

  const handlePress = useCallback((l: string) => {
    if (!currentExercise || locked || status !== "idle") return;
    if (typed.length < currentExercise.answer.length) { setTyped(p => p + l); resetHint(); }
  }, [currentExercise, locked, status, typed, resetHint]);

  const handleBack = useCallback(() => setTyped(p => p.slice(0, -1)), []);
  const handleAudio = useCallback(() => {
    if (currentExercise) speak(currentExercise.word.word, 0.72);
  }, [currentExercise, speak]);

  if (!currentExercise) return null;

  const { word, pictogramSrc } = currentExercise;
  const progress = ((currentIndex + 1) / exercises.length) * 100;
  const hintIndex   = isHintVisible ? typed.length : undefined;
  const hintLetter  = isHintVisible ? currentExercise.answer[typed.length]?.toUpperCase() : undefined;
  const difficulty  = word.difficulty;
  const isKeyDisabled = locked || status !== "idle";

  // Colores de fondo imagen según estado
  const bgImg = status === "correct" ? "#C6F135" : status === "neutral-reset" ? "#EDE9FF" : word.color;
  const bdImg = status === "correct" ? "#A8D420" : status === "neutral-reset" ? "#B8AEFF" : word.colorBorder;

  // ── Header Worly ──────────────────────────────────────────────────
  const Header = (
    <header style={{
      flexShrink: 0,
      background: "linear-gradient(90deg, #7B5CF6 0%, #6144D8 100%)",
      padding: "10px 16px",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      zIndex: 30,
    }}>
      <button onClick={clearSession} style={{
        background: "rgba(255,255,255,0.2)",
        border: "2px solid rgba(255,255,255,0.3)",
        borderRadius: "12px",
        padding: "8px 14px",
        fontSize: "0.9rem",
        fontWeight: 700,
        color: "#FFFFFF",
        cursor: "pointer",
        fontFamily: "'Nunito', sans-serif",
        minHeight: "44px",
        flexShrink: 0,
        transition: "all 0.2s ease",
      }}>← Salir</button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span style={{ fontSize: "0.9rem" }}>{cat?.emoji}</span>
          <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "rgba(255,255,255,0.85)", textTransform: "uppercase", letterSpacing: "0.08em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {cat?.label}
          </span>
          <span style={{ marginLeft: "auto", fontSize: "0.72rem", fontWeight: 700, color: "rgba(255,255,255,0.7)", flexShrink: 0 }}>
            {currentIndex + 1}/{exercises.length}
          </span>
        </div>
        <div className="progress-bar">
          <div style={{ height: "100%", width: `${progress}%`, background: "rgba(255,255,255,0.9)", borderRadius: "8px", transition: "width 0.8s ease" }} />
        </div>
      </div>

      <button onClick={handleAudio} title="Escuchar la palabra" style={{
        background: "rgba(255,255,255,0.2)",
        border: "2px solid rgba(255,255,255,0.3)",
        borderRadius: "12px",
        padding: "8px 10px",
        fontSize: "1.1rem",
        cursor: "pointer",
        minHeight: "44px",
        flexShrink: 0,
        transition: "all 0.2s ease",
      }}>🔊</button>

      <div style={{
        background: "#FFE34E",
        border: "2px solid #F0CB20",
        borderRadius: "12px",
        padding: "4px 10px",
        textAlign: "center",
        flexShrink: 0,
      }}>
        <div style={{ fontSize: "0.72rem" }}>⭐</div>
        <div style={{ fontSize: "0.82rem", fontWeight: 900, color: "#3A2800", lineHeight: 1, fontFamily: "var(--font-fredoka),cursive" }}>{stars}</div>
      </div>
    </header>
  );

  // ── Feedback banners ──────────────────────────────────────────────
  const FeedbackCorrect = (
    <div className="animate-soft-appear" style={{
      background: "#C6F135", border: "3px solid #A8D420",
      borderRadius: "18px", padding: "12px 16px", textAlign: "center",
    }}>
      <span style={{ fontSize: "1.6rem" }}>⭐</span>
      <p style={{ fontFamily: "var(--font-fredoka),cursive", fontSize: "1.1rem", color: "#2A4A00", margin: "4px 0 0" }}>
        ¡Muy bien, {state.profile?.name ?? "campeón"}!
      </p>
      {streak >= 3 && <p style={{ fontSize: "0.82rem", color: "#3A5A00", fontWeight: 700, margin: "4px 0 0" }}>🔥 ¡{streak} seguidas!</p>}
    </div>
  );

  const FeedbackRetry = (
    <div className="animate-neutral-fade" style={{
      background: "#EDE9FF", border: "3px solid #D4CCFF",
      borderRadius: "18px", padding: "12px 16px", textAlign: "center",
    }}>
      <p style={{ fontFamily: "var(--font-fredoka),cursive", fontSize: "1rem", color: "#5B3FD9", margin: 0 }}>💫 ¡Inténtalo de nuevo!</p>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // MÓVIL
  // ════════════════════════════════════════════════════════════════
  if (!isDesktop) return (
    <div style={{
      height: "100dvh", display: "flex", flexDirection: "column",
      fontFamily: "'Nunito', sans-serif",
      background: "var(--worly-cream)",
      overflow: "hidden",
    }}>
      {Header}

      {/* Imagen dominante */}
      <div style={{
        flex: 1, minHeight: 0, position: "relative",
        margin: "12px 12px 0", borderRadius: "24px", overflow: "hidden",
        background: bgImg, border: `3px solid ${bdImg}`,
        transition: "all 0.5s ease",
        animation: status === "correct" ? "success-bloom 0.9s ease-out" : "none",
      }}>
        {pictogramSrc ? (
          <Image src={pictogramSrc} alt={word.word} fill sizes="100vw" style={{ objectFit: "contain", padding: "16px" }} priority />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(5rem,20vw,9rem)" }}>
            {word.emoji}
          </div>
        )}
        {/* Overlay nombre */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "rgba(255,255,255,0.93)", padding: "10px",
          textAlign: "center", borderTop: "1px solid rgba(229,224,245,0.5)",
        }}>
          <p style={{ fontFamily: "var(--font-fredoka),cursive", fontSize: "clamp(1.5rem,7vw,2rem)", color: "var(--worly-text)", margin: 0 }}>
            {word.word}
          </p>
          <p style={{ fontSize: "clamp(0.8rem,3.5vw,1rem)", color: "#A78BFA", fontWeight: 800, margin: "2px 0 0", letterSpacing: "0.2em" }}>
            {word.syllables}
          </p>
        </div>
      </div>

      {/* Panel inferior */}
      <div style={{ flexShrink: 0, padding: "12px 12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {status === "correct" && FeedbackCorrect}
        {status === "neutral-reset" && FeedbackRetry}
        <LetterSlots answer={currentExercise.answer} typed={typed} status={status} slotSize={52} hintIndex={hintIndex} />
        {status === "idle" && typed.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: "var(--worly-text-muted)", margin: 0 }}>
            👇 Toca las letras para escribir
          </p>
        )}
        <AdaptiveKeys letters={adaptiveLetters} onPress={handlePress} disabled={isKeyDisabled} hintLetter={hintLetter} difficulty={difficulty} />
        <div style={{ textAlign: "center" }}>
          <button onClick={handleBack} disabled={locked || typed.length === 0} style={{
            background: typed.length === 0 ? "#F0EEF8" : "#FFE34E",
            border: `2px solid ${typed.length === 0 ? "#E5E0F5" : "#F0CB20"}`,
            borderRadius: "14px", padding: "10px 28px",
            fontSize: "0.9rem", fontWeight: 800, fontFamily: "'Nunito', sans-serif",
            color: typed.length === 0 ? "#C0BADC" : "#3A2800",
            cursor: typed.length === 0 ? "not-allowed" : "pointer",
          }}>⌫ Borrar</button>
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // DESKTOP
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={{
      height: "100dvh", display: "flex", flexDirection: "column",
      fontFamily: "'Nunito', sans-serif",
      background: "var(--worly-cream)",
      overflow: "hidden",
    }}>
      {Header}

      <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>

        {/* Panel izquierdo: imagen */}
        <div style={{
          width: "clamp(300px,40%,500px)", flexShrink: 0,
          display: "flex", flexDirection: "column",
          padding: "16px", gap: "12px", overflow: "hidden",
        }}>
          <div style={{
            flex: 1, minHeight: 0, position: "relative",
            borderRadius: "28px", overflow: "hidden",
            background: bgImg, border: `3px solid ${bdImg}`,
            transition: "background 0.5s ease, border-color 0.5s ease",
            animation: status === "correct"
              ? "success-bloom 1s ease-out"
              : status === "neutral-reset" ? "ninja-shake-no 0.5s ease-out" : "none",
          }}>
            {pictogramSrc ? (
              <Image src={pictogramSrc} alt={word.word} fill sizes="(min-width:768px) 500px, 100vw" style={{ objectFit: "cover" }} priority />
            ) : (
              <div style={{
                width: "100%", height: "100%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "clamp(5rem,10vw,9rem)",
                animation: "gentle-float 3s ease-in-out infinite",
              }}>
                {word.emoji}
              </div>
            )}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              background: "rgba(255,255,255,0.94)", padding: "14px",
              textAlign: "center", borderTop: "1px solid rgba(229,224,245,0.4)",
            }}>
              <p style={{ fontFamily: "var(--font-fredoka),cursive", fontSize: "clamp(1.8rem,3.5vw,2.8rem)", color: "var(--worly-text)", margin: 0 }}>
                {word.word}
              </p>
              <p style={{ fontSize: "clamp(0.9rem,1.8vw,1.2rem)", color: "#A78BFA", fontWeight: 800, margin: "4px 0 0", letterSpacing: "0.25em" }}>
                {word.syllables}
              </p>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "8px" }}>
                <span style={{
                  background: "#EDE9FF", borderRadius: "20px",
                  padding: "2px 12px", fontSize: "0.78rem", fontWeight: 700, color: "#7B5CF6",
                }}>
                  {word.categoryLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho: ejercicio */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          padding: "16px 24px", gap: "14px", overflow: "hidden",
          animation: "panel-slide-in 0.5s ease-out forwards",
        }}>
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-fredoka),cursive",
              fontSize: "clamp(1rem,2.2vw,1.4rem)",
              color: "var(--worly-text)", margin: 0,
            }}>
              ✍️ Escribe la palabra que ves en el dibujo
            </p>
          </div>

          {status === "correct" && FeedbackCorrect}
          {status === "neutral-reset" && FeedbackRetry}

          {/* Slots */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <LetterSlots answer={currentExercise.answer} typed={typed} status={status} slotSize={64} hintIndex={hintIndex} />
            {status === "idle" && typed.length > 0 && (
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--worly-text-muted)", margin: 0 }}>
                {currentExercise.answer.length - typed.length > 0
                  ? `Faltan ${currentExercise.answer.length - typed.length} letra${currentExercise.answer.length - typed.length !== 1 ? "s" : ""}…`
                  : "✓ Verificando..."}
              </p>
            )}
            {status === "idle" && typed.length === 0 && (
              <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--worly-text-muted)", margin: 0 }}>👇 Haz clic en las letras</p>
            )}
          </div>

          {/* Teclado */}
          <div style={{
            flex: 1, minHeight: 0, display: "flex", flexDirection: "column",
            justifyContent: "center", gap: "12px",
            animation: "keys-appear 0.4s ease-out 0.15s both",
          }}>
            <AdaptiveKeys letters={adaptiveLetters} onPress={handlePress} disabled={isKeyDisabled} hintLetter={hintLetter} difficulty={difficulty} />
            <div style={{ textAlign: "center" }}>
              <button onClick={handleBack} disabled={locked || typed.length === 0} style={{
                background: typed.length === 0 ? "#F0EEF8" : "#FFE34E",
                border: `2px solid ${typed.length === 0 ? "#E5E0F5" : "#F0CB20"}`,
                borderRadius: "14px", padding: "12px 36px",
                fontSize: "1rem", fontWeight: 800, fontFamily: "'Nunito', sans-serif",
                color: typed.length === 0 ? "#C0BADC" : "#3A2800",
                cursor: typed.length === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}>⌫ Borrar última letra</button>
            </div>
          </div>

          {/* Pista sílabas */}
          {isHintVisible && status === "idle" && (
            <div className="animate-soft-appear" style={{
              flexShrink: 0,
              background: "#EDE9FF", border: "2px solid #D4CCFF",
              borderRadius: "16px", padding: "10px", textAlign: "center",
            }}>
              <p style={{ fontSize: "0.75rem", color: "#A78BFA", fontWeight: 700, margin: "0 0 3px", textTransform: "uppercase" }}>💡 Pista de sílabas</p>
              <p className="animate-slow-pulse" style={{
                fontFamily: "var(--font-fredoka),cursive",
                fontSize: "1.4rem", color: "#7B5CF6", letterSpacing: "0.3em", margin: 0,
              }}>
                {word.syllables}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
