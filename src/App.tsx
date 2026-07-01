import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Shell } from "@/components/Shell";
import { ModuleGuard } from "@/pages/ModuleGuard";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Academy from "@/pages/Academy";
import Connect from "@/pages/Connect";
import BaseCamp from "@/pages/BaseCamp";
import Mission from "@/pages/Mission";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            element={
              <ProtectedRoute>
                <Shell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="academy" element={<ModuleGuard module="academy"><Academy /></ModuleGuard>} />
            <Route path="connect" element={<ModuleGuard module="connect"><Connect /></ModuleGuard>} />
            <Route path="basecamp" element={<ModuleGuard module="basecamp"><BaseCamp /></ModuleGuard>} />
            <Route path="mission" element={<ModuleGuard module="mission"><Mission /></ModuleGuard>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}