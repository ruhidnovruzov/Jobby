import React, { createContext, useState, useEffect, useContext } from 'react';


// Context-i yaradırıq
export const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    token: null,
    role: null,
    displayName: null, 
    profilePicture: null,
  });
  
  // Loading state əlavə edirik
  const [loading, setLoading] = useState(true);

  // Tətbiq ilk yüklənəndə localStorage-dan məlumatları oxuyuruq
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (userData && token) {
        const parsedData = JSON.parse(userData);
        // Məlumatların düzgün olub-olmadığını yoxlayırıq
        if (parsedData && parsedData.token === token) {
          setUser(parsedData);
        }
      }
    } catch (error) {
      console.error('localStorage-dan user məlumatları oxunarkən xəta:', error);
      // Əgər localStorage-da korlanmış məlumat varsa, onu təmizləyirik
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      // Loading-i false edirik
      setLoading(false);
    }
  }, []);

  // Login funksiyası - istifadəçi məlumatlarını state-ə və localStorage-a yazır
  const login = (token, role, displayName, profilePicture = null) => {
    const userData = { token, role, displayName, profilePicture };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    // Tokeni ayrıca localStorage-da saxlayırıq ki axios config tapasin
    localStorage.setItem('token', token);
  };

  // Logout funksiyası - istifadəçi məlumatlarını state-dən və localStorage-dan silir
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser({ token: null, role: null, displayName: null, profilePicture: null });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook - komponentlərdə context-i asanlıqla istifadə etmək üçün
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};