import { createContext, useContext, useState, useEffect } from 'react';
import { attendanceApiClient } from '@/services/apiClient.js';

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
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalizedRole = (() => {
    const rawRole = user?.role || user?.accountType;
    return typeof rawRole === 'string' ? rawRole.toLowerCase() : '';
  })();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token') || localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('user') || localStorage.getItem('auth_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await attendanceApiClient.post('/auth/login', {
        email,
        password,
      });

      const { token: newToken, user: newUser } = data;

      // Store in state
      setToken(newToken);
      setUser(newUser);

      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      };
    }
  };

  const logout = () => {
    // Clear state
    setToken(null);
    setUser(null);

    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    role: normalizedRole,
    isTeacher: normalizedRole === 'teacher',
    isStudent: normalizedRole === 'student',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
