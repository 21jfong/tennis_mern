import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const profile = localStorage.getItem('profile');

  return profile ? children : <Navigate to="/auth" />;
};

export default ProtectedRoute;
