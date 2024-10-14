import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../Context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user || (role !== 'host' && role !== 'admin' && role !== 'attendee')) {
    console.log('private role', role);
    console.log('user', user);
    return <Navigate to="/login" />;
  }

  return children; 
};

export default PrivateRoute;
