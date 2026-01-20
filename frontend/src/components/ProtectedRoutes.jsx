import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    let auth = false;
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role && (!role || user.role === role)) {
          auth = true;
        }
      } catch (error) {
        console.error("Invalid user data in localStorage:", error);
      }
    }

    setIsAuthenticated(auth);
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