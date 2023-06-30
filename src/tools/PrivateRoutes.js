import { Outlet, Navigate } from 'react-router-dom';
import React from 'react';

const PrivateRoutes = () => {
  const id_user = localStorage.getItem('id_user');
  const isAuthenticated = !!id_user;

  return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;