import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    // No token → not authenticated
    if (!token || !userStr) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const user = JSON.parse(userStr);

      // Validate role existence
      if (!user.role) {
        setIsAuthenticated(false);
        return;
      }

      // If role prop is provided, enforce role-based access
      if (role && user.role !== role) {
        setIsAuthenticated(false);
        return;
      }

      // All checks passed
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Invalid user data in localStorage:", error);
      setIsAuthenticated(false);
    }
  }, [role]);

  // While checking auth
  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  // If not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Authorized → allow access
  return children;
};

export default ProtectedRoute;