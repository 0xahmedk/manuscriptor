import React from "react";

import { useLocation } from "react-router";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/FirebaseContext";

const ProtectedRoutes = () => {
  const { currentUser } = useAuth();

  const location = useLocation();

  return currentUser ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

export default ProtectedRoutes;
