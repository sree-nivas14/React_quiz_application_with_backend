import React from "react";
import { Navigate, Outlet } from "react-router";

const useAuth = () => {
  const user = sessionStorage.getItem("username")
    ? { loggedIn: true }
    : { loggedIn: false };
  return user && user.loggedIn;
};

function ProtectedRoutes() {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to="/" />;
}

export default ProtectedRoutes;
