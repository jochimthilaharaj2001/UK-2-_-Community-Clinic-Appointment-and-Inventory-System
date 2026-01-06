import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, role }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const user = userStr ? JSON.parse(userStr) : {};
      
      // For demo purposes, allow access if token exists
      if (user.role) {
        // Check if role matches (if specified)
        if (role && user.role !== role) {
          setIsAuthenticated(false);
          return;
        }
        
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error parsing user data:', error);
      setIsAuthenticated(false);
    }
  }, [role]);

  if (isAuthenticated === null) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;