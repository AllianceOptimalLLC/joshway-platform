import { createContext, useContext, useState, type ReactNode } from "react";
import { personas, type Persona } from "@/data/mock";

interface AuthContextValue {
  persona: Persona;
  setPersona: (p: Persona) => void;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [persona, setPersona] = useState<Persona>(personas[0]);

  return (
    <AuthContext.Provider value={{ persona, setPersona, isDemo: true }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}