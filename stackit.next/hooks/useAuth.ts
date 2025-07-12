'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('stackit_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Mock login - in real app, this would call an API
      const mockUser: User = {
        id: '1',
        username: email.split('@')[0],
        email,
        role: 'user',
        reputation: 100,
        joinedAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('stackit_user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      // Mock registration - in real app, this would call an API
      const mockUser: User = {
        id: Date.now().toString(),
        username,
        email,
        role: 'user',
        reputation: 0,
        joinedAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem('stackit_user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('stackit_user');
  };

  return { user, login, register, logout };
}