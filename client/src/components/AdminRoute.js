import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center mt-5">Carregando...</div>;
  }

  return isAuthenticated && user?.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;
