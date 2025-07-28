import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          logout();
        } else {
          setUser({
            id: decoded.id,
            displayName: decoded.displayName,
            profilePictureUrl: decoded.profilePictureUrl,
          });
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    setLoading(false);
  }, []); // Removed token from dependency array to run only once on mount

  const login = useCallback(async (fbResponse) => {
    const accessToken = fbResponse.accessToken;
    try {
      const res = await api.post('/auth/facebook', { access_token: accessToken });
      const { token: jwtToken } = res.data;
      localStorage.setItem('authToken', jwtToken);
      const decoded = jwtDecode(jwtToken);
      setUser({
        id: decoded.id,
        displayName: decoded.displayName,
        profilePictureUrl: decoded.profilePictureUrl,
      });
      setToken(jwtToken);
      api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
      navigate('/templates'); // Redirect to main app page on success
    } catch (err) {
      console.error('Error exchanging token:', err);
      logout(); // Clean up on failure
      throw err; // Re-throw to be caught by Login.js
    }
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
    navigate('/login'); // Redirect to login on logout
  }, [navigate]);

  // Auto-login functionality is no longer needed with the new robust flow.
  // The user will be redirected by the interceptor if their token is invalid.
  
  const authContextValue = {
    user,
    token,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; 