"use client";
// hooks/useGameState.ts — Context global del juego
// Estado completo: perfil del niño, categoría activa, ejercicio actual, progreso

import React, {
  createContext, useContext, useReducer, useCallback,
  useEffect, type ReactNode,
} from "react";
import type { Exercise } from "@/lib/exercises";

// ── Tipos ────────────────────────────────────────────────────
export type ExerciseStatus = "idle" | "correct" | "neutral-reset";
export type AppView = "setup" | "dashboard" | "category" | "exercise";

export interface ChildProfile {
  name: string;
  avatar: string; // emoji avatar
}

export interface GameState {
  view: AppView;
  profile: ChildProfile | null;
  activeCategoryId: string | null;
  exercises: Exercise[];
  currentIndex: number;
  status: ExerciseStatus;
  lastWord: string | null;
  stars: number;       // total estrellas acumuladas
  streak: number;      // racha actual
  sessionScore: number;// puntos en la sesión
}

// ── Actions ──────────────────────────────────────────────────
type Action =
  | { type: "SET_PROFILE"; payload: ChildProfile }
  | { type: "SET_VIEW"; payload: AppView }
  | { type: "SET_CATEGORY"; payload: { categoryId: string; exercises: Exercise[] } }
  | { type: "SUBMIT_WORD"; payload: string }
  | { type: "NEXT_EXERCISE" }
  | { type: "RESET_STATUS" }
  | { type: "CLEAR_SESSION" };

// ── Estado inicial ───────────────────────────────────────────
const INITIAL_STATE: GameState = {
  view: "setup",
  profile: null,
  activeCategoryId: null,
  exercises: [],
  currentIndex: 0,
  status: "idle",
  lastWord: null,
  stars: 0,
  streak: 0,
  sessionScore: 0,
};

// ── Reducer ──────────────────────────────────────────────────
function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "SET_PROFILE":
      return { ...state, profile: action.payload, view: "dashboard" };

    case "SET_VIEW":
      return { ...state, view: action.payload };

    case "SET_CATEGORY":
      return {
        ...state,
        activeCategoryId: action.payload.categoryId,
        exercises: action.payload.exercises,
        currentIndex: 0,
        status: "idle",
        lastWord: null,
        view: "exercise",
      };

    case "SUBMIT_WORD": {
      const current = state.exercises[state.currentIndex];
      if (!current) return state;
      const isCorrect =
        action.payload.toLowerCase().trim() === current.answer.toLowerCase().trim();

      if (isCorrect) {
        return {
          ...state,
          status: "correct",
          lastWord: action.payload,
          stars: state.stars + 1,
          streak: state.streak + 1,
          sessionScore: state.sessionScore + (state.streak >= 3 ? 2 : 1),
        };
      } else {
        // NUNCA "error" — simplemente neutral-reset
        return {
          ...state,
          status: "neutral-reset",
          lastWord: null,
          streak: 0,
        };
      }
    }

    case "NEXT_EXERCISE": {
      const nextIndex = state.currentIndex + 1;
      const isFinished = nextIndex >= state.exercises.length;
      return {
        ...state,
        currentIndex: isFinished ? 0 : nextIndex,
        status: "idle",
        lastWord: null,
      };
    }

    case "RESET_STATUS":
      return { ...state, status: "idle", lastWord: null };

    case "CLEAR_SESSION":
      return {
        ...state,
        activeCategoryId: null,
        exercises: [],
        currentIndex: 0,
        status: "idle",
        lastWord: null,
        streak: 0,
        sessionScore: 0,
        view: "dashboard",
      };

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────
interface GameContextValue {
  state: GameState;
  setProfile: (profile: ChildProfile) => void;
  setView: (view: AppView) => void;
  startCategory: (categoryId: string, exercises: Exercise[]) => void;
  submitWord: (word: string) => void;
  nextExercise: () => void;
  resetStatus: () => void;
  clearSession: () => void;
  currentExercise: Exercise | null;
}

const GameContext = createContext<GameContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────
export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  // Persistir perfil en localStorage
  useEffect(() => {
    const saved = localStorage.getItem("mundolector_profile");
    if (saved) {
      try {
        const profile = JSON.parse(saved) as ChildProfile;
        dispatch({ type: "SET_PROFILE", payload: profile });
      } catch {
        // ignorar error de parse
      }
    }
  }, []);

  const setProfile = useCallback((profile: ChildProfile) => {
    localStorage.setItem("mundolector_profile", JSON.stringify(profile));
    dispatch({ type: "SET_PROFILE", payload: profile });
  }, []);

  const setView = useCallback((view: AppView) => {
    dispatch({ type: "SET_VIEW", payload: view });
  }, []);

  const startCategory = useCallback((categoryId: string, exercises: Exercise[]) => {
    dispatch({ type: "SET_CATEGORY", payload: { categoryId, exercises } });
  }, []);

  const submitWord = useCallback((word: string) => {
    dispatch({ type: "SUBMIT_WORD", payload: word });
  }, []);

  const nextExercise = useCallback(() => {
    dispatch({ type: "NEXT_EXERCISE" });
  }, []);

  const resetStatus = useCallback(() => {
    dispatch({ type: "RESET_STATUS" });
  }, []);

  const clearSession = useCallback(() => {
    dispatch({ type: "CLEAR_SESSION" });
  }, []);

  const currentExercise = state.exercises[state.currentIndex] ?? null;

  return (
    <GameContext.Provider value={{
      state, setProfile, setView, startCategory,
      submitWord, nextExercise, resetStatus, clearSession, currentExercise,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameState() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameState must be used within <GameProvider>");
  return ctx;
}
