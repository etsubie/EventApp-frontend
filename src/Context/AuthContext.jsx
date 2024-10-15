import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState({}); 
  const [loading, setLoading] = useState(true); 

  async function getUser() {
    if (!token) {
        setLoading(false); 
        return;
    }

    try {
        const res = await fetch("/api/user", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (res.ok) {
            setUser({
                ...data,
                role: data.roles.length > 0 ? data.roles[0] : null, 
            });
        } else {
            console.error("Failed to fetch user data:", data);
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    } finally {
        setLoading(false);
    }
}


  useEffect(() => {
    getUser(); 
  }, [token]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token); 
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
