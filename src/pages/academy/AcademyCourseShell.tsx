import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/academy-course.css";

/** Full-screen course player — uses Lovable light theme tokens. */
export default function AcademyCourseShell() {
  return (
    <div className="academy-course-theme min-h-dvh bg-background text-foreground">
      <Outlet />
      <Toaster />
    </div>
  );
}