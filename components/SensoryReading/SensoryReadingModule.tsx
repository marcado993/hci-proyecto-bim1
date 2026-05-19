"use client";
// components/SensoryReading/SensoryReadingModule.tsx
// TEA-optimized: teclado adaptivo, imagen dominante, audio mínimo (solo la palabra)

import { useEffect, useCallback, useRef, useState, useMemo } from "react";
import { useGameState } from "@/hooks/useGameState";
import { useDelayedHint } from "@/hooks/useDelayedHint";
import { useSpeech } from "@/hooks/useSpeech"; // solo speak()
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { CATEGORIES } from "@/lib/vocabulary";
import Image from "next/image";

// ── Teclado adaptivo por dificultad ─────────────────────────────────
const ALPHABET = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","Ñ","O","P","Q","R","S","T","U","V","W","X","Y","Z","Á","É","Í","Ó","Ú"];

function getAdaptiveLetters(answer: string, difficulty: string): string[] {
  const word = answer.toUpperCase();
  const wordLetters = [...new Set(word.split(""))];
  if (difficulty === "Difícil") return ALPHABET;
  const pool = ALPHABET.filter((l) => !wordLetters.includes(l)).sort(() => Math.random() - 0.5);
  const extras = difficulty === "Fácil" ? 3 : 5;
  return [...wordLetters, ...pool.slice(0, extras)].sort(() => Math.random() - 0.5);
}

// ── Componente de botones adaptativos ───────────────────────────────
function AdaptiveKeys({ letters, onPress, disabled, hintLetter, difficulty }: {
  letters: string[]; onPress: (l: string) => void;
  disabled: boolean; hintLetter?: string; difficulty: string;
}) {
  const cols = difficulty === "Fácil" ? 4 : difficulty === "Media" ? 5 : 8;
  const btnSize = difficulty === "Fácil" ? "clamp(60px,16vw,90px)" : difficulty === "Media" ? "clamp(48px,12vw,72px)" : "clamp(36px,8vw,52px)";
  const fontSize = difficulty === "Fácil" ? "clamp(1.4rem,4vw,1.8rem)" : difficulty === "Media" ? "clamp(1.1rem,3vw,1.4rem)" : "clamp(0.8rem,2vw,1rem)";

  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "clamp(6px,2vw,10px)" }}>
      {letters.map((l) => {
        const isHinted = !disabled && hintLetter && l === hintLetter.toUpperCase();
        return (
          <button key={l} onClick={() => !disabled && onPress(l)} disabled={disabled}
            aria-label={`Letra ${l}`}
            style={{
              height: btnSize, width: "100%",
              background: disabled ? "#EAE8F5" : isHinted ? "#DDD4F5" : "#FFFCF8",
              border: `3px solid ${disabled ? "#E0DAF0" : isHinted ? "#C0B0E8" : "#D4D0EE"}`,
              borderRadius: "14px", fontSize, fontWeight: 900,
              fontFamily: "'Nunito',sans-serif", color: disabled ? "#B0AABB" : "#3D3A50",
              cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.45 : 1,
              transition: "all 0.15s ease",
              animation: isHinted ? "key-ninja-pulse 0.9s ease-in-out infinite" : "none",
              boxShadow: disabled ? "none" : "0 3px 10px rgba(61,58,80,0.1)",
            }}
            onMouseDown={(e) => { if (!disabled) { (e.currentTarget as HTMLElement).style.transform = "scale(0.88)"; (e.currentTarget as HTMLElement).style.background = "#C8DFFE"; } }}
            onMouseUp={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.background = isHinted ? "#DDD4F5" : "#FFFCF8"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
          >{l}</button>
        );
      })}
    </div>
  );
}

// ── Slots de letras con animación ninja ─────────────────────────────
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
            background: isCorrect ? "#C8EDD4" : filled ? "#DDD4F5" : isNinjaSlot ? "rgba(192,176,232,0.15)" : "transparent",
            border: `3px ${filled ? "solid" : "dashed"} ${isCorrect ? "#A2D8B0" : filled ? "#C0B0E8" : isNinjaSlot ? "#9A70D8" : "#C5C0D5"}`,
            borderRadius: "12px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: `${slotSize * 0.45}px`, fontWeight: 900, color: isCorrect ? "#2A7A4A" : "#3D3A50",
            transition: "border-color 0.3s ease, background 0.3s ease",
            animation: isNinjaSlot
              ? "ninja-bounce 0.7s ease-in-out infinite"
              : filled && !isCorrect ? "slot-fill 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards" : "none",
            boxShadow: isNinjaSlot ? "0 0 16px rgba(154,112,216,0.5)" : "none",
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
  const { speak } = useSpeech(); // SOLO speak(word) — sin TTS automático
  const isDesktop = useIsDesktop(768);

  const [typed, setTyped]   = useState("");
  const [locked, setLocked] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = status === "idle";
  const { isHintVisible, resetHint } = useDelayedHint(isActive, 7000);
  const cat = CATEGORIES.find((c) => c.id === activeCategoryId);

  // Letras adaptivas memoizadas — se recalculan SOLO cuando cambia el ejercicio
  const adaptiveLetters = useMemo(() => {
    if (!currentExercise) return [];
    return getAdaptiveLetters(currentExercise.answer, currentExercise.word.difficulty);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise?.id]);

  // Nuevo ejercicio — solo limpia estado, sin audio automático
  useEffect(() => {
    setTyped(""); setLocked(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentExercise?.id]);

  // Avance automático
  useEffect(() => {
    if (status === "correct")       timer.current = setTimeout(() => nextExercise(), 2000);
    if (status === "neutral-reset") {
      setLocked(true);
      timer.current = setTimeout(() => { resetStatus(); setTyped(""); setLocked(false); }, 1400);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  // Auto-verificar al completar
  useEffect(() => {
    if (!currentExercise || !typed || status !== "idle") return;
    if (typed.length === currentExercise.answer.length) {
      const t = setTimeout(() => {
        resetHint(); submitWord(typed);
        // Audio: solo la palabra al acertar
        if (typed.toLowerCase() === currentExercise.answer.toLowerCase())
          speak(currentExercise.answer, 0.78);
      }, 350);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typed]);

  // Teclado físico
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
  // 🔊 solo dice la palabra — sin cambio de estado
  const handleAudio = useCallback(() => {
    if (currentExercise) speak(currentExercise.word.word, 0.72);
  }, [currentExercise, speak]);

  if (!currentExercise) return null;

  const { word, pictogramSrc } = currentExercise;
  const progress = ((currentIndex + 1) / exercises.length) * 100;
  // Pista ninja: índice del siguiente slot vacío
  const hintIndex   = isHintVisible ? typed.length : undefined;
  const hintLetter  = isHintVisible ? currentExercise.answer[typed.length]?.toUpperCase() : undefined;
  const difficulty = word.difficulty;
  const isKeyDisabled = locked || status !== "idle";

  // ── COLORES ESTADO ────────────────────────────────────────────────
  const bgImg = status === "correct" ? "#C8EDD4" : status === "neutral-reset" ? "#F5F3FF" : word.color;
  const bdImg = status === "correct" ? "#A2D8B0" : status === "neutral-reset" ? "#DDD4F5" : word.colorBorder;

  // ── HEADER compartido ─────────────────────────────────────────────
  const Header = (
    <header style={{
      flexShrink: 0, display: "flex", alignItems: "center", gap: "10px",
      padding: "10px 16px", background: "rgba(255,252,248,0.97)",
      backdropFilter: "blur(12px)", borderBottom: "2px solid #E0DAF0", zIndex: 30,
    }}>
      <button onClick={clearSession} style={{
        background: "#F0EEF8", border: "2px solid #D9D4F0", borderRadius: "12px",
        padding: "8px 12px", fontSize: "0.9rem", fontWeight: 700, color: "#6B6880",
        cursor: "pointer", fontFamily: "'Nunito',sans-serif", minHeight: "44px", flexShrink: 0,
      }}>← Salir</button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span>{cat?.emoji}</span>
          <span style={{ fontSize: "0.72rem", fontWeight: 800, color: "#7A7590", textTransform: "uppercase", letterSpacing: "0.08em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {cat?.label}
          </span>
          <span style={{ marginLeft: "auto", fontSize: "0.72rem", fontWeight: 700, color: "#7A7590", flexShrink: 0 }}>
            {currentIndex + 1}/{exercises.length}
          </span>
        </div>
        <div style={{ height: "6px", borderRadius: "6px", background: "#E0DAF0", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#C8DFFE,#DDD4F5)", borderRadius: "6px", transition: "width 0.8s ease" }} />
        </div>
      </div>

      <button onClick={handleAudio} title="Escuchar la palabra" style={{
        background: "#F0EEF8", border: "2px solid #D9D4F0",
        borderRadius: "12px", padding: "8px 10px", fontSize: "1.1rem", cursor: "pointer", minHeight: "44px", flexShrink: 0,
        transition: "all 0.2s ease",
      }}>🔊</button>

      <div style={{ background: "#FFF3C4", border: "2px solid #F0DC90", borderRadius: "12px", padding: "4px 10px", textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontSize: "0.75rem" }}>⭐</div>
        <div style={{ fontSize: "0.82rem", fontWeight: 900, color: "#3D3A50", lineHeight: 1 }}>{stars}</div>
      </div>
    </header>
  );

  // ════════════════════════════════════════════════════════════════
  // LAYOUT MÓVIL — imagen dominante arriba, teclado abajo
  // ════════════════════════════════════════════════════════════════
  if (!isDesktop) return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", fontFamily: "'Nunito',sans-serif", background: "linear-gradient(160deg,#EEF6FF 0%,#FFF8EE 55%,#F0FFF4 100%)", overflow: "hidden" }}>
      {Header}

      {/* IMAGEN — ocupa todo el espacio disponible */}
      <div style={{ flex: 1, minHeight: 0, position: "relative", margin: "12px 12px 0",
                    borderRadius: "20px", overflow: "hidden", background: bgImg,
                    border: `3px solid ${bdImg}`, transition: "all 0.6s ease",
                    animation: status === "correct" ? "success-bloom 0.9s ease-out" : "none" }}>
        {pictogramSrc ? (
          <Image src={pictogramSrc} alt={word.word} fill sizes="100vw" style={{ objectFit: "contain", padding: "16px" }} priority />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "clamp(5rem,20vw,9rem)" }}>
            {word.emoji}
          </div>
        )}
        {/* Overlay nombre de la palabra */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0,
                      background: "rgba(255,255,255,0.92)", padding: "10px",
                      textAlign: "center", borderTop: "1px solid rgba(224,218,240,0.5)" }}>
          <p style={{ fontSize: "clamp(1.5rem,7vw,2rem)", fontWeight: 900, color: "#3D3A50", margin: 0, letterSpacing: "0.03em" }}>
            {word.word}
          </p>
          <p style={{ fontSize: "clamp(0.8rem,3.5vw,1rem)", color: "#C0B0E8", fontWeight: 800, margin: "2px 0 0", letterSpacing: "0.2em" }}>
            {word.syllables}
          </p>
        </div>
      </div>

      {/* FILA INFERIOR: slots + teclado */}
      <div style={{ flexShrink: 0, padding: "12px 12px 16px", display: "flex", flexDirection: "column", gap: "10px" }}>

        {/* Feedback */}
        {status === "correct" && (
          <div className="animate-soft-appear" style={{ background: "#C8EDD4", border: "2px solid #A2D8B0", borderRadius: "14px", padding: "8px", textAlign: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>⭐</span>
            <p style={{ fontSize: "1rem", fontWeight: 800, color: "#2A7A4A", margin: 0 }}>¡Muy bien, {state.profile?.name ?? "campeón"}!</p>
          </div>
        )}
        {status === "neutral-reset" && (
          <div className="animate-neutral-fade" style={{ background: "#F5F3FF", border: "2px solid #E0DAF0", borderRadius: "14px", padding: "8px", textAlign: "center" }}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#7A7590", margin: 0 }}>💫 Inténtalo de nuevo</p>
          </div>
        )}

        {/* Slots */}
        <LetterSlots answer={currentExercise.answer} typed={typed} status={status} slotSize={52} hintIndex={hintIndex} />

        {/* Instrucción mínima */}
        {status === "idle" && typed.length === 0 && (
          <p style={{ textAlign: "center", fontSize: "0.82rem", fontWeight: 700, color: "#B0AABB", margin: 0 }}>
            👇 Toca las letras
          </p>
        )}

        {/* Teclado adaptivo */}
        <AdaptiveKeys letters={adaptiveLetters} onPress={handlePress} disabled={isKeyDisabled} hintLetter={hintLetter} difficulty={difficulty} />

        {/* Borrar */}
        <div style={{ textAlign: "center" }}>
          <button onClick={handleBack} disabled={locked || typed.length === 0} style={{
            background: typed.length === 0 ? "#EAE8F5" : "#FDE8D8",
            border: `2px solid ${typed.length === 0 ? "#E0DAF0" : "#F0C9A8"}`,
            borderRadius: "12px", padding: "10px 28px",
            fontSize: "0.9rem", fontWeight: 800, fontFamily: "'Nunito',sans-serif",
            color: typed.length === 0 ? "#B0AABB" : "#3D3A50",
            cursor: typed.length === 0 ? "not-allowed" : "pointer",
          }}>⌫ Borrar</button>
        </div>
      </div>
    </div>
  );

  // ════════════════════════════════════════════════════════════════
  // LAYOUT DESKTOP — 2 columnas: imagen izquierda | ejercicio derecha
  // ════════════════════════════════════════════════════════════════
  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", fontFamily: "'Nunito',sans-serif", background: "linear-gradient(135deg,#EEF6FF 0%,#FFF8EE 45%,#F0FFF4 100%)", overflow: "hidden" }}>
      {Header}

      <div style={{ flex: 1, minHeight: 0, display: "flex", overflow: "hidden" }}>

        {/* ── PANEL IZQUIERDO: imagen dominante ── */}
        <div style={{ width: "clamp(320px,40%,520px)", flexShrink: 0, display: "flex", flexDirection: "column",
                      padding: "16px", gap: "12px", overflow: "hidden" }}>
          {/* Imagen llena el panel */}
          <div style={{ flex: 1, minHeight: 0, position: "relative", borderRadius: "24px", overflow: "hidden",
                        background: bgImg, border: `3px solid ${bdImg}`, transition: "background 0.6s ease, border-color 0.6s ease",
                        animation: status === "correct"
                          ? "ninja-celebrate 0.8s ease-out, success-bloom 1s ease-out"
                          : status === "neutral-reset" ? "ninja-shake-no 0.5s ease-out" : "none" }}>
            {pictogramSrc ? (
              <Image src={pictogramSrc} alt={word.word} fill
                sizes="(min-width:768px) 520px, 100vw"
                style={{ objectFit: "cover" }} priority />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "clamp(6rem,12vw,10rem)",
                            animation: "gentle-float 3s ease-in-out infinite" }}>
                {word.emoji}
              </div>
            )}
            {/* Overlay con nombre */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.93)", padding: "14px", textAlign: "center", borderTop: "1px solid rgba(224,218,240,0.4)" }}>
              <p style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 900, color: "#3D3A50", margin: 0 }}>
                {word.word}
              </p>
              <p style={{ fontSize: "clamp(0.9rem,1.8vw,1.2rem)", color: "#C0B0E8", fontWeight: 800, margin: "4px 0 0", letterSpacing: "0.25em" }}>
                {word.syllables}
              </p>
              <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "8px" }}>
                <span style={{ background: "rgba(221,212,245,0.6)", borderRadius: "20px", padding: "2px 12px", fontSize: "0.78rem", fontWeight: 700, color: "#7A7590" }}>{word.categoryLabel}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#7A7590" }}>
                {difficulty === "easy" ? "🌱 Fácil" : "🌟 Media"}
              </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── PANEL DERECHO: ejercicio ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "16px 24px", gap: "16px", overflow: "hidden",
                      animation: "panel-slide-in 0.5s ease-out forwards" }}>

          {/* Instrucción clara */}
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <p style={{ fontSize: "clamp(1rem,2.2vw,1.4rem)", fontWeight: 800, color: "#3D3A50", margin: 0 }}>
              ✍️ Escribe la palabra que ves en el dibujo
            </p>
          </div>

          {/* Feedback */}
          {status === "correct" && (
            <div className="animate-soft-appear" style={{ background: "#C8EDD4", border: "2px solid #A2D8B0", borderRadius: "18px", padding: "16px", textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontSize: "2rem", margin: 0 }}>⭐</p>
              <p style={{ fontSize: "1.2rem", fontWeight: 800, color: "#2A7A4A", margin: "4px 0 0" }}>
                ¡Muy bien, {state.profile?.name ?? "campeón"}!
              </p>
              {streak >= 3 && <p style={{ fontSize: "0.9rem", color: "#4A9A6A", fontWeight: 700, margin: "4px 0 0" }}>🔥 ¡{streak} seguidas!</p>}
            </div>
          )}
          {status === "neutral-reset" && (
            <div className="animate-neutral-fade" style={{ background: "#F5F3FF", border: "2px solid #E0DAF0", borderRadius: "18px", padding: "14px", textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "#7A7590", margin: 0 }}>💫 Inténtalo de nuevo…</p>
              <p style={{ fontSize: "0.82rem", color: "#9A96B0", fontWeight: 600, margin: "4px 0 0" }}>Mira la imagen y el nombre 👈</p>
            </div>
          )}

          {/* Slots de letras — grandes y centrados */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <LetterSlots answer={currentExercise.answer} typed={typed} status={status} slotSize={64} hintIndex={hintIndex} />
            {status === "idle" && typed.length > 0 && (
              <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#B0AABB", margin: 0 }}>
                {currentExercise.answer.length - typed.length > 0
                  ? `Faltan ${currentExercise.answer.length - typed.length} letra${currentExercise.answer.length - typed.length !== 1 ? "s" : ""}…`
                  : "✓ Verificando..."}
              </p>
            )}
            {status === "idle" && typed.length === 0 && (
              <p style={{ fontSize: "0.9rem", fontWeight: 700, color: "#B0AABB", margin: 0 }}>👇 Haz clic en las letras</p>
            )}
          </div>

          {/* Teclado adaptivo — llena el espacio restante */}
          <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px",
                        animation: "keys-appear 0.4s ease-out 0.15s both" }}>
            <AdaptiveKeys letters={adaptiveLetters} onPress={handlePress} disabled={isKeyDisabled} hintLetter={hintLetter} difficulty={difficulty} />

            <div style={{ textAlign: "center" }}>
              <button onClick={handleBack} disabled={locked || typed.length === 0} style={{
                background: typed.length === 0 ? "#EAE8F5" : "#FDE8D8",
                border: `2px solid ${typed.length === 0 ? "#E0DAF0" : "#F0C9A8"}`,
                borderRadius: "14px", padding: "12px 36px",
                fontSize: "1rem", fontWeight: 800, fontFamily: "'Nunito',sans-serif",
                color: typed.length === 0 ? "#B0AABB" : "#3D3A50",
                cursor: typed.length === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s ease",
              }}>⌫ Borrar última letra</button>
            </div>
          </div>

          {/* Pista sílabas */}
          {isHintVisible && status === "idle" && (
            <div className="animate-soft-appear" style={{ flexShrink: 0, background: "#F5F3FF", border: "2px solid #DDD4F5", borderRadius: "14px", padding: "10px", textAlign: "center" }}>
              <p style={{ fontSize: "0.75rem", color: "#B0AABB", fontWeight: 700, margin: "0 0 3px", textTransform: "uppercase" }}>💡 Pista de sílabas</p>
              <p className="animate-slow-pulse" style={{ fontSize: "1.3rem", fontWeight: 900, color: "#C0B0E8", letterSpacing: "0.3em", margin: 0 }}>
                {word.syllables}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
