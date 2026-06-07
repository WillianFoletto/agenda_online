import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => boolean;
  loginWithFacebook: () => boolean;
  register: (name: string, email: string, password: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('[Auth] Tentando login com email:', email);
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();

      if (error) {
        console.error('[Auth] Erro ao buscar usuário no Supabase:', error);
        // Fallback para mockUsers
        const foundUser = mockUsers.find(u => u.email === email && u.password === password);
        if (foundUser) {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          console.log('[Auth] Login realizado com fallback mockUsers');
          return true;
        }
        return false;
      }

      if (data) {
        const user: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          password: data.password,
          avatar: data.avatar,
        };
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('[Auth] Login realizado com sucesso via Supabase');
        return true;
      }

      // Fallback para mockUsers se não encontrar no Supabase
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        console.log('[Auth] Login realizado com fallback mockUsers');
        return true;
      }

      return false;
    } catch (error) {
      console.error('[Auth] Erro ao fazer login (catch):', error);
      // Fallback para mockUsers
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        console.log('[Auth] Login realizado com fallback mockUsers');
        return true;
      }
      return false;
    }
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

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    console.log('[Auth] Tentando registrar usuário com email:', email);
    
    try {
      // Verificar se email já existe no Supabase
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('[Auth] Erro ao verificar email no Supabase:', checkError);
        // Fallback para mockUsers
        const existingMockUser = mockUsers.find(u => u.email === email);
        if (existingMockUser) {
          console.log('[Auth] Email já existe (fallback mockUsers)');
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
        console.log('[Auth] Registro realizado com fallback mockUsers');
        return true;
      }

      if (existingUser) {
        console.log('[Auth] Email já existe no Supabase');
        return false;
      }

      // Inserir novo usuário no Supabase
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
      };

      const { error: insertError } = await supabase.from('users').insert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      });

      if (insertError) {
        console.error('[Auth] Erro ao inserir usuário no Supabase:', insertError);
        // Fallback para mockUsers
        const existingMockUser = mockUsers.find(u => u.email === email);
        if (existingMockUser) {
          console.log('[Auth] Email já existe (fallback mockUsers)');
          return false;
        }
        mockUsers.push(newUser);
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        console.log('[Auth] Registro realizado com fallback mockUsers');
        return true;
      }

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      console.log('[Auth] Registro realizado com sucesso via Supabase');
      return true;
    } catch (error) {
      console.error('[Auth] Erro ao registrar (catch):', error);
      // Fallback para mockUsers
      const existingMockUser = mockUsers.find(u => u.email === email);
      if (existingMockUser) {
        console.log('[Auth] Email já existe (fallback mockUsers)');
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
      console.log('[Auth] Registro realizado com fallback mockUsers');
      return true;
    }
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
