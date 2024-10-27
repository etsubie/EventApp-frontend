import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';
import { Loader } from 'lucide-react';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  useEffect(() => {
    // If the user is not authenticated and not loading, set a timeout to redirect
    if (!user && !loading) {
      const timer = setTimeout(() => {
        setRedirectToLogin(true);
      }, 2000); // Set delay  (2000ms = 2 seconds)

      // Clear the timer if the component unmounts before it fires
      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  if (loading) {
    return <div><Loader/></div>;
  }

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  if (user && user.role !== role) {
    return <Navigate to="/" />;
  }

  return children; 
};

export default PrivateRoute;
