import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  loginWithGoogle: () => boolean;
  loginWithFacebook: () => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const loginWithGoogle = (): boolean => {
    const mockGoogleUser: User = {
      id: Date.now().toString(),
      name: 'Usuário Google',
      email: 'google@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Google+User&background=4285F4&color=fff',
    };
    setUser(mockGoogleUser);
    localStorage.setItem('user', JSON.stringify(mockGoogleUser));
    return true;
  };

  const loginWithFacebook = (): boolean => {
    const mockFacebookUser: User = {
      id: Date.now().toString(),
      name: 'Usuário Facebook',
      email: 'facebook@example.com',
      avatar: 'https://ui-avatars.com/api/?name=Facebook+User&background=1877F2&color=fff',
    };
    setUser(mockFacebookUser);
    localStorage.setItem('user', JSON.stringify(mockFacebookUser));
    return true;
  };

  const register = (name: string, email: string, password: string): boolean => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      return false;
    }
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password,
    };
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithGoogle,
        loginWithFacebook,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
