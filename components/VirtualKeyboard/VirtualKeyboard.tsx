"use client";
// components/VirtualKeyboard/VirtualKeyboard.tsx
// Teclado virtual: CSS grid para llenar el ancho disponible en desktop y móvil

interface VirtualKeyboardProps {
  typedWord: string;
  maxLength: number;
  onKeyPress: (letter: string) => void;
  onBackspace: () => void;
  disabled?: boolean;
  hintLetter?: string;
}

const KEYBOARD_ROWS = [
  ["A","B","C","D","E","F","G","H","I","J","K"],
  ["L","M","N","Ñ","O","P","Q","R","S","T","U"],
  ["V","W","X","Y","Z","Á","É","Í","Ó","Ú"],
];

export default function VirtualKeyboard({
  typedWord, maxLength, onKeyPress, onBackspace, disabled = false, hintLetter,
}: VirtualKeyboardProps) {
  const isFull = typedWord.length >= maxLength;
  const canPress = !disabled && !isFull;

  const keyStyle = (letter: string): React.CSSProperties => {
    const isHinted = !disabled && hintLetter && letter === hintLetter.toUpperCase();
    return {
      aspectRatio: "1",
      minHeight: "clamp(36px, 6vh, 58px)",
      background: !canPress ? "#F0EEF8" : isHinted ? "#DDD4F5" : "#FFFCF8",
      border: `2px solid ${!canPress ? "#E8E4F5" : isHinted ? "#C0B0E8" : "#D9D4F0"}`,
      borderRadius: "10px",
      fontSize: "clamp(0.78rem, 1.8vw, 1.05rem)",
      fontWeight: 800,
      fontFamily: "'Nunito', sans-serif",
      color: !canPress ? "#C0BACC" : "#3D3A50",
      cursor: canPress ? "pointer" : "not-allowed",
      opacity: disabled ? 0.4 : 1,
      transition: "all 0.15s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none" as const,
      WebkitTapHighlightColor: "transparent",
      animation: isHinted ? "hint-glow 2.5s ease-in-out infinite" : "none",
      boxShadow: canPress ? "0 2px 6px rgba(61,58,80,0.08)" : "none",
    };
  };

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "clamp(4px, 0.8vh, 8px)" }}>
      {KEYBOARD_ROWS.map((row, ri) => (
        <div key={ri} style={{
          display: "grid",
          gridTemplateColumns: `repeat(${row.length}, 1fr)`,
          gap: "clamp(4px, 0.8vw, 8px)",
        }}>
          {row.map((letter) => (
            <button
              key={letter}
              onClick={() => canPress && onKeyPress(letter)}
              disabled={!canPress}
              aria-label={`Letra ${letter}`}
              style={keyStyle(letter)}
              onMouseDown={(e) => {
                if (canPress) {
                  (e.currentTarget as HTMLElement).style.transform = "scale(0.88)";
                  (e.currentTarget as HTMLElement).style.background = "#C8DFFE";
                }
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
                const isHinted = hintLetter && letter === hintLetter.toUpperCase();
                (e.currentTarget as HTMLElement).style.background = isHinted ? "#DDD4F5" : "#FFFCF8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = "scale(1)";
              }}
            >
              {letter}
            </button>
          ))}
        </div>
      ))}

      {/* Fila borrar */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: "clamp(2px, 0.4vh, 4px)" }}>
        <button
          onClick={onBackspace}
          disabled={disabled || typedWord.length === 0}
          aria-label="Borrar última letra"
          style={{
            padding: "0 clamp(20px, 5vw, 40px)",
            minHeight: "clamp(36px, 6vh, 52px)",
            background: typedWord.length === 0 || disabled ? "#F0EEF8" : "#FDE8D8",
            border: `2px solid ${typedWord.length === 0 || disabled ? "#E8E4F5" : "#F0C9A8"}`,
            borderRadius: "10px",
            fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
            fontWeight: 800,
            fontFamily: "'Nunito',sans-serif",
            color: typedWord.length === 0 || disabled ? "#C0BACC" : "#3D3A50",
            cursor: typedWord.length === 0 || disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.4 : 1,
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 2px 6px rgba(61,58,80,0.08)",
          }}
        >
          ⌫ Borrar
        </button>
      </div>
    </div>
  );
}
