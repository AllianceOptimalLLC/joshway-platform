import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { personas, type Persona } from "@/data/mock";

const STORAGE_KEY = "joshway-platform-persona";

interface AuthContextValue {
  persona: Persona | null;
  setPersona: (p: Persona) => void;
  login: (p: Persona) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadPersona(): Persona | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const id = JSON.parse(raw) as string;
    return personas.find((p) => p.id === id) ?? null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona | null>(loadPersona);

  const setPersona = useCallback((p: Persona) => {
    setPersonaState(p);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(p.id));
  }, []);

  const login = setPersona;

  const logout = useCallback(() => {
    setPersonaState(null);
    sessionStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        persona,
        setPersona,
        login,
        logout,
        isAuthenticated: !!persona,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  if (!ctx.persona) {
    return { ...ctx, persona: personas[0] };
  }
  return ctx as AuthContextValue & { persona: Persona };
}