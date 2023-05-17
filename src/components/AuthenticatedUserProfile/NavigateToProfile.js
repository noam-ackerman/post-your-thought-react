import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function NavigateToProfile() {
  const { currentUser } = useAuth();
  return <Navigate to={`/${currentUser.uid}`} />;
}
