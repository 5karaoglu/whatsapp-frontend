import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode'; // Ensure you have jwt-decode installed: npm install jwt-decode
import api from '../services/api';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true); // Keep loading true initially

  useEffect(() => {
    // This effect runs once on component mount to handle the initial token state
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        const isExpired = decodedUser.exp * 1000 < Date.now();
        if (isExpired) {
          logout();
        } else {
          setUser(decodedUser);
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Invalid token:", error);
        logout();
      }
    }
    // We will set loading to false after the Facebook check is complete.
  }, [token]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    delete api.defaults.headers.common['Authorization'];
  }, []);

  const login = useCallback((fbResponse) => {
    const accessToken = fbResponse.accessToken;
    // Set loading to true during the login process
    setLoading(true);
    // Exchange Facebook token for our app's JWT
    return api.post('/auth/facebook', { access_token: accessToken })
      .then(res => {
        const { token: jwtToken } = res.data;
        localStorage.setItem('authToken', jwtToken);
        const decodedUser = jwtDecode(jwtToken);
        setUser(decodedUser);
        setToken(jwtToken);
        api.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
      })
      .catch(err => {
          console.error('Error exchanging token:', err);
          logout(); // Clear any partial state
          setLoading(false); // Ensure loading is stopped
          throw err; // Re-throw the error to be caught by the caller (Login.js)
      })
      .finally(() => {
        // Stop loading regardless of the outcome
        setLoading(false);
      });
  }, [logout]);

  useEffect(() => {
    console.log("AuthContext: Attaching function to window object.");

    const failsafeTimer = setTimeout(() => {
      console.warn("AuthContext Failsafe: Facebook SDK did not respond in 5 seconds. Forcing loading to false.");
      setLoading(false);
    }, 5000);

    // Define a global function that the FB SDK can call
    window.onFacebookLoginStatus = (response) => {
      clearTimeout(failsafeTimer); // We got a response, clear the timer
      console.log("AuthContext: window.onFacebookLoginStatus called with:", response);
      
      const { status, authResponse } = response;

      if (status === 'connected') {
        if (!token) {
          console.log("Auto-logging in with Facebook session.");
          login(authResponse).catch(() => {
            // Auto-login failed (e.g., credentials missing), do nothing, user stays on login page.
          });
        }
      } else {
        if (token) {
          console.log("Stale session detected. Logging out.");
          logout();
        }
      }
      console.log("AuthContext: Finished status check. Setting loading to false.");
      setLoading(false);
    };

    return () => {
      console.log("AuthContext: Unmounting. Cleaning up global function and timer.");
      clearTimeout(failsafeTimer);
      // Clean up the global function
      window.onFacebookLoginStatus = null;
    };
  }, [token, login, logout]);

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