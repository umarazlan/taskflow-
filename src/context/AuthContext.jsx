import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';
import { notify } from '../components/ui';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from storage
  useEffect(() => {
    try {
      const session = authService.getCurrentSession();
      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser, token: authToken } = await authService.login(email, password);
      setUser(loggedInUser);
      setToken(authToken);
      notify.success(`Welcome back, ${loggedInUser.name}!`);
      return loggedInUser;
    } catch (error) {
      notify.error(error.message || 'Login failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signup = useCallback(async (userData) => {
    setIsLoading(true);
    try {
      const { user: newUser, token: authToken } = await authService.signup(userData);
      setUser(newUser);
      setToken(authToken);
      notify.success('Account created! Welcome to TaskFlow.');
      return newUser;
    } catch (error) {
      notify.error(error.message || 'Signup failed.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    notify.info('You have been logged out.');
  }, []);

  const forgotPassword = useCallback(async (email) => {
    try {
      const res = await authService.forgotPassword(email);
      notify.success(res.message);
      return res;
    } catch (error) {
      notify.error(error.message || 'Error sending reset email.');
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (newPassword) => {
    try {
      const res = await authService.resetPassword(newPassword);
      notify.success(res.message);
      return res;
    } catch (error) {
      notify.error(error.message || 'Error resetting password.');
      throw error;
    }
  }, []);

  const completeOnboarding = useCallback(async (onboardingData) => {
    try {
      const updatedUser = await authService.completeOnboarding(onboardingData);
      setUser(updatedUser);
      notify.success('Workspace configured successfully!');
      return updatedUser;
    } catch (error) {
      notify.error(error.message || 'Error completing onboarding.');
      throw error;
    }
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isOnboarded: !!user?.onboarded,
    isLoading,
    login,
    signup,
    logout,
    forgotPassword,
    resetPassword,
    completeOnboarding,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
