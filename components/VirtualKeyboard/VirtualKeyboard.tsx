"use client";
// components/VirtualKeyboard/VirtualKeyboard.tsx
// Teclado virtual accesible para niños con mouse o toque
// Incluye letras en español + acentos + borrar

interface VirtualKeyboardProps {
  typedWord: string;
  maxLength: number;
  onKeyPress: (letter: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
  hintLetter?: string; // Primera letra de la respuesta (para hint visual)
}

// Layout de teclado alfabético optimizado para español (3 filas)
const KEYBOARD_ROWS = [
  ["A","B","C","D","E","F","G","H","I","J","K"],
  ["L","M","N","Ñ","O","P","Q","R","S","T","U"],
  ["V","W","X","Y","Z","Á","É","Í","Ó","Ú"],
];

export default function VirtualKeyboard({
  typedWord,
  maxLength,
  onKeyPress,
  onBackspace,
  disabled = false,
  hintLetter,
}: VirtualKeyboardProps) {
  const isFull = typedWord.length >= maxLength;

  return (
    <div style={{
      width: "100%",
      padding: "0",
      userSelect: "none",
    }}>
      {/* Filas de teclas */}
      {KEYBOARD_ROWS.map((row, rowIdx) => (
        <div key={rowIdx} style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(3px, 1vw, 7px)",
          marginBottom: "clamp(3px, 1vw, 7px)",
          flexWrap: "nowrap",
        }}>
          {row.map((letter) => {
            const isHinted = hintLetter && letter === hintLetter.toUpperCase();
            return (
              <button
                key={letter}
                onClick={() => onKeyPress(letter)}
                disabled={disabled || isFull}
                aria-label={`Letra ${letter}`}
                style={{
                  flex: "1 1 0",
                  maxWidth: "clamp(28px, 7.5vw, 56px)",
                  aspectRatio: "1",
                  minHeight: "clamp(36px, 8vw, 56px)",
                  background: disabled || isFull
                    ? "#EAE8F0"
                    : isHinted
                    ? "#DDD4F5"
                    : "#FFFCF8",
                  border: `2px solid ${
                    disabled || isFull ? "#E0DAF0" :
                    isHinted ? "#C0B0E8" : "#D9D4F0"
                  }`,
                  borderRadius: "clamp(8px, 2vw, 12px)",
                  fontSize: "clamp(0.75rem, 2.2vw, 1.05rem)",
                  fontWeight: 800,
                  fontFamily: "'Nunito', sans-serif",
                  color: disabled || isFull ? "#B0AABB" : "#3D3A50",
                  cursor: disabled || isFull ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.45 : 1,
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                  boxShadow: disabled || isFull ? "none" : "0 2px 6px rgba(61,58,80,0.07)",
                  animation: isHinted && !disabled ? "hint-glow 2.5s ease-in-out infinite" : "none",
                }}
                onMouseDown={(e) => {
                  if (!disabled && !isFull) {
                    (e.currentTarget as HTMLElement).style.transform = "scale(0.9)";
                    (e.currentTarget as HTMLElement).style.background = "#C8DFFE";
                  }
                }}
                onMouseUp={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                  (e.currentTarget as HTMLElement).style.background =
                    isHinted ? "#DDD4F5" : "#FFFCF8";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                }}
              >
                {letter}
              </button>
            );
          })}
        </div>
      ))}

      {/* Fila inferior: espacio + borrar */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "clamp(3px, 1vw, 7px)",
        marginTop: "clamp(2px, 0.5vw, 4px)",
      }}>
        {/* Espacio (para palabras con acento u ortografía) */}
        <button
          onClick={onBackspace}
          disabled={disabled || typedWord.length === 0}
          aria-label="Borrar última letra"
          style={{
            padding: "0 clamp(16px, 4vw, 32px)",
            minHeight: "clamp(36px, 8vw, 52px)",
            background: typedWord.length === 0 || disabled ? "#EAE8F0" : "#FDE8D8",
            border: `2px solid ${typedWord.length === 0 || disabled ? "#E0DAF0" : "#F0C9A8"}`,
            borderRadius: "clamp(8px, 2vw, 14px)",
            fontSize: "clamp(0.8rem, 2vw, 1rem)",
            fontWeight: 800,
            fontFamily: "'Nunito', sans-serif",
            color: typedWord.length === 0 || disabled ? "#B0AABB" : "#3D3A50",
            cursor: typedWord.length === 0 || disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.45 : 1,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            boxShadow: "0 2px 6px rgba(61,58,80,0.07)",
          }}
        >
          <span style={{ fontSize: "clamp(1rem, 2.5vw, 1.3rem)" }}>⌫</span>
          <span style={{ display: "none" }}>Borrar</span>
        </button>
      </div>
    </div>
  );
}
