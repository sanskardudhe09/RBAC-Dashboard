import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Configure axios base URL
axios.defaults.baseURL = process.env.NODE_ENV === 'production' 
  ? window.location.origin 
  : 'http://localhost:5000';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenExpiryWarning, setTokenExpiryWarning] = useState(false);

  // Decode JWT token
  const decodeToken = useCallback((token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      return null;
    }
  }, []);

  // Check if token is expired
  const isTokenExpired = useCallback((token) => {
    const payload = decodeToken(token);
    if (!payload) return true;
    
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  }, [decodeToken]);

  // Check if token is about to expire (within 2 minutes)
  const isTokenExpiringSoon = useCallback((token) => {
    const payload = decodeToken(token);
    if (!payload) return false;
    
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = payload.exp - currentTime;
    return timeUntilExpiry < 120; // 2 minutes
  }, [decodeToken]);

  // Initialize auth state
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isTokenExpired(token)) {
      const payload = decodeToken(token);
      setUser({
        id: payload.userId,
        email: payload.email,
        role: payload.role
      });
      
      // Set up token expiry warning
      if (isTokenExpiringSoon(token)) {
        setTokenExpiryWarning(true);
      }
    } else if (token && isTokenExpired(token)) {
      localStorage.removeItem('token');
    }
    setLoading(false);
  }, [isTokenExpired, isTokenExpiringSoon, decodeToken]);

  // Set up axios interceptor for token expiry
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          setUser(null);
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password });
      const response = await axios.post('/api/login', { email, password });
      console.log('Login response:', response.data);
      
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      setUser(user);
      
      // Set up token expiry warning
      if (isTokenExpiringSoon(token)) {
        setTokenExpiryWarning(true);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed. Please check if the server is running.' 
      };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTokenExpiryWarning(false);
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    if (!user) return false;
    
    const roleHierarchy = {
      'viewer': 1,
      'editor': 2,
      'admin': 3
    };
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
  };

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    tokenExpiryWarning,
    setTokenExpiryWarning
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 