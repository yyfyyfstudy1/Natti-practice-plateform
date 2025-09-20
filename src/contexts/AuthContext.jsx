import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, getCurrentUser } from '../firebase/authService';
import { getUserRole, USER_ROLES, initializeAdminUser } from '../firebase/userRoleService';

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
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthChange(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // Get user role
          const role = await getUserRole(user.uid);
          setUserRole(role);
          
          // Initialize admin for development (remove in production)
          if (user.email === 'admin@example.com') {
            await initializeAdminUser(user.uid);
            setUserRole(USER_ROLES.ADMIN);
          }
        } catch (error) {
          console.error('Error fetching user role:', error);
          setUserRole(USER_ROLES.USER);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userRole,
    loading,
    isAuthenticated: !!user,
    isAdmin: userRole === USER_ROLES.ADMIN,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
