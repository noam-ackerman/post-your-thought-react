import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export function RouteGuard({ children, mode }) {
  const { currentUser } = useAuth();
  if (mode === "protected" && !currentUser) {
    return <Navigate to="/login" />;
  }
  if (mode === "public" && currentUser) {
    return <Navigate to="/" />;
  }
  return children;
}
