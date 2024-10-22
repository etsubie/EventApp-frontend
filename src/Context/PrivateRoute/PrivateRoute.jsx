import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

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
    return <div>Loading...</div>;
  }

  if (redirectToLogin) {
    return <Navigate to="/login" />;
  }

  if (user && user.role !== role) {
    console.log(`User role "${user.role}" does not match required role "${role}"`);
    return <Navigate to="/" />;
  }

  return children; 
};

export default PrivateRoute;


// import { useState, useEffect, useContext } from "react";
// import { Navigate, useNavigate } from "react-router-dom";
// import { AuthContext } from "../AuthContext";


// const Redirect = () => {
//   const [count, setCount] = useState(5);
//   const navigate = useNavigate();
//   const { user, loading } = useContext(AuthContext);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCount((currentCount) => --currentCount);
//     }, 1000);
//     count === 0 && navigate("/login");
//     return () => clearInterval(interval);
//   }, [count, navigate]);
//   if (loading) {
//         return <div>Loading...</div>; 
//       }
    
//       if (!user) {
//         return <Navigate to="/login" />;
//       }
//   return (
//     <>
//       <div>
//         <div>
//           Redirecting you in {count} seconds
//         </div>
//       </div>
//     </>
//   );
// };

// const PrivateRoute = ({ children, role }) => {
//   const user =localStorage.getItem("token");
//   return user?.role === role ? children : <Redirect />;
// };

// export default PrivateRoute;
