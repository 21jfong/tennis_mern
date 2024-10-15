import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';

// Create an AuthContext
const AuthContext = createContext();

// Provide the AuthContext to the app
export const AuthProvider = ({ children }) => {
  const authState = useSelector((state) => state.auth);

  return (
    <AuthContext.Provider value={{ authState }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the AuthContext in any component
export const useAuth = () => {
  return useContext(AuthContext);
};
