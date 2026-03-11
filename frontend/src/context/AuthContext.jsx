import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Provider wraps the entire app
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if token exists in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // Set default Authorization header for all Axios requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
    }
    setLoading(false);
  }, []);

  // Login: save user + token to state and localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('adminUser', JSON.stringify(userData));
    // Attach token to every future Axios request automatically
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  // Logout: clear everything
  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth anywhere
export const useAuth = () => useContext(AuthContext);
