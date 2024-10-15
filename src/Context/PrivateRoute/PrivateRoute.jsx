import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext); 

  if (loading) {
    return <div>Loading...</div>; 
  }
  if (!user) {
    // If there's no user, redirect to login
    return <Navigate to="/login" />;
  }

  // Check if the user's role matches the required role
  if (user.role !== role) {
    return <Navigate to="/" />; 
  }

  // Render the children (protected component) if everything checks out
  return children; 
};

export default PrivateRoute;
