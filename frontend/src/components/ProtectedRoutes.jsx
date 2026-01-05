import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;