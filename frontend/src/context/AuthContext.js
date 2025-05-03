import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
const AuthContext = createContext();
const BASE_URL = 'http://localhost:8080';
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (error) {
        console.error('Invalid token in localStorage:', error);
        localStorage.removeItem('token');
      }
    }
  }, []);
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });
      const token = response.data.token;
      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token received from backend');
      }
      const decodedUser = jwtDecode(token);
      localStorage.setItem('token', token);
      setUser(decodedUser);
      return decodedUser; // Contains role and name
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  };
  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post(`${BASE_URL}/auth/register`, {
        name,
        email,
        password,
        role,
      });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error.message);
      throw error;
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext); 
