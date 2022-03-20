import React from "react";

import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../contexts/FirebaseContext";

const PublicRoutes = () => {
  const { currentUser } = useAuth();

  return currentUser ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoutes;
