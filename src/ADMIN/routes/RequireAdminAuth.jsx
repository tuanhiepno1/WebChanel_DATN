import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const RequireAdminAuth = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user || user.role !== 1) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdminAuth;
