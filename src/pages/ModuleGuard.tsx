import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ModuleId } from "@/data/mock";

export function ModuleGuard({ module, children }: { module: ModuleId; children: React.ReactNode }) {
  const { persona } = useAuth();
  if (!persona.modules.includes(module)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
}