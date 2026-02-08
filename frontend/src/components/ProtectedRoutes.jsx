import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = ({ children, role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  console.log(`ProtectedRoute checking for role: ${role || 'any'} | Current status: ${isAuthenticated}`);

  useEffect(() => {
    let auth = false;
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token) {
      const storedRole = localStorage.getItem("role");
      let userRole = null;

      try {
        const user = JSON.parse(userStr || '{}');
        userRole = user.role || storedRole;
      } catch (error) {
        userRole = storedRole;
      }

      if (userRole && (!role || userRole === role)) {
        auth = true;
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
    return <Navigate to="/" replace />;
  }

  // Authorized → allow access
  return children;
};

export default ProtectedRoute;
