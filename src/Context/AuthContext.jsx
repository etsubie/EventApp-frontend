import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true); 

  async function getUser() {
    const res = await fetch("/api/user", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data = await res.json();
    if (res.ok) {
        setUser(data);
    } else {
        console.error("Failed to fetch user data:", data);
    }
    setLoading(false); 
  }

  useEffect(() => {
    if (token) {
        getUser();
    } else {
        setLoading(false); 
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
