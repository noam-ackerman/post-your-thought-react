import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RouteGuardProps {
  children: ReactNode;
  mode: "protected" | "public";
}

export function RouteGuard({ children, mode }: RouteGuardProps) {
  const { currentUser } = useAuth();
  if (mode === "protected" && !currentUser) {
    return <Navigate to="/login" />;
  }
  if (mode === "public" && currentUser) {
    return <Navigate to="/" />;
  }
  return children;
}
