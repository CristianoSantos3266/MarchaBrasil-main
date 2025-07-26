'use client';

// Simple session management for demo/launch purposes
const USER_SESSION_KEY = 'marcha-brasil-user-session';

export interface UserSession {
  id: string;
  name: string;
  email?: string;
  createdAt: string;
}

// Get current user session
export function getCurrentUser(): UserSession | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(USER_SESSION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error loading user session:', error);
    return null;
  }
}

// Create or get user session (auto-login for demo purposes)
export function getOrCreateUserSession(): UserSession {
  let user = getCurrentUser();
  
  if (!user) {
    // Create a new user session
    user = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: `Usuário ${Math.floor(Math.random() * 1000) + 1}`,
      createdAt: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user session:', error);
    }
  }
  
  return user;
}

// Set user session (for future login functionality)
export function setUserSession(user: UserSession): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user session:', error);
  }
}

// Clear user session (logout)
export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(USER_SESSION_KEY);
}

// Check if user can edit/delete an event
export function canUserEditEvent(event: { createdBy?: string }): boolean {
  const currentUser = getCurrentUser();
  if (!currentUser || !event.createdBy) return false;
  
  return currentUser.id === event.createdBy;
}