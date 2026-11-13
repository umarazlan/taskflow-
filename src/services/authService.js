import { storage } from './storage';
import { INITIAL_USERS } from '../data/seedData';

// Simulated network latency
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

// Generate a mock JWT
function generateFakeJWT(user) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    })
  );
  const signature = btoa('mock-taskflow-signature');
  return `${header}.${payload}.${signature}`;
}

// Ensure initial users exist in storage
function getUsers() {
  let users = storage.get('users');
  if (!users || !Array.isArray(users) || users.length === 0) {
    users = INITIAL_USERS;
    storage.set('users', users);
  }
  return users;
}

export const authService = {
  // Login with email & password
  login: async (email, password) => {
    await delay(450);
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!user) {
      throw new Error('No account found with this email address.');
    }

    // Check password (demo password check or user's stored password)
    if (user.password && user.password !== password) {
      throw new Error('Incorrect password. Please try again.');
    }

    const token = generateFakeJWT(user);
    const sessionUser = { ...user };
    delete sessionUser.password;

    storage.set('auth_token', token);
    storage.set('current_user', sessionUser);

    return { user: sessionUser, token };
  },

  // Signup new user
  signup: async ({ name, email, password }) => {
    await delay(500);
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: normalizedEmail,
      password: password,
      role: 'Workspace Member',
      avatar: '',
      initials: name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2),
      onboarded: false, // triggers 3-step onboarding wizard
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    storage.set('users', users);

    const token = generateFakeJWT(newUser);
    const sessionUser = { ...newUser };
    delete sessionUser.password;

    storage.set('auth_token', token);
    storage.set('current_user', sessionUser);

    return { user: sessionUser, token };
  },

  // Send password reset email
  forgotPassword: async (email) => {
    await delay(400);
    const users = getUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail);

    if (!exists) {
      // Simulate generic secure response
      return { success: true, message: 'If an account exists, a reset link has been sent.' };
    }

    storage.set('reset_pending_email', normalizedEmail);
    return { success: true, message: 'Password reset link sent to your email.' };
  },

  // Reset password
  resetPassword: async (newPassword) => {
    await delay(500);
    const pendingEmail = storage.get('reset_pending_email') || 'demo@taskflow.com';
    const users = getUsers();
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === pendingEmail.toLowerCase());

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      storage.set('users', users);
      storage.remove('reset_pending_email');
    }

    return { success: true, message: 'Your password has been reset successfully.' };
  },

  // Mark onboarding as completed
  completeOnboarding: async (onboardingData) => {
    await delay(400);
    const currentUser = storage.get('current_user');
    if (!currentUser) throw new Error('Not authenticated');

    const users = getUsers();
    const userIndex = users.findIndex((u) => u.id === currentUser.id);

    const updatedUser = {
      ...currentUser,
      onboarded: true,
      workspaceName: onboardingData?.workspaceName || 'My Workspace',
    };

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updatedUser };
      storage.set('users', users);
    }

    storage.set('current_user', updatedUser);
    storage.set('user_onboarding_details', onboardingData);

    return updatedUser;
  },

  // Logout
  logout: async () => {
    await delay(200);
    storage.remove('auth_token');
    storage.remove('current_user');
  },

  // Get current session
  getCurrentSession: () => {
    const token = storage.get('auth_token');
    const user = storage.get('current_user');
    if (!token || !user) return null;
    return { token, user };
  },
};
