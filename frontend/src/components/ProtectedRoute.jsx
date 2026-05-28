// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // If no token, redirect to login. Otherwise, render the child routes (Outlet).
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;