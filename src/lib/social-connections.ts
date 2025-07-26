'use client';

// Social Connection Types
export interface UserConnection {
  id: string;
  userId: string;
  connectedUserId: string;
  connectionType: 'following' | 'follower' | 'mutual';
  status: 'pending' | 'accepted' | 'blocked';
  createdAt: string;
  connectedUser: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    isVerified?: boolean;
    city?: string;
    state?: string;
  };
}

export interface ConnectionStats {
  following: number;
  followers: number;
  mutualConnections: number;
}

const CONNECTIONS_KEY = 'marcha-brasil-connections';
const CONNECTION_REQUESTS_KEY = 'marcha-brasil-connection-requests';

// Get user's connections
export function getUserConnections(userId: string): UserConnection[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    const allConnections: UserConnection[] = stored ? JSON.parse(stored) : [];
    
    return allConnections.filter(
      conn => (conn.userId === userId || conn.connectedUserId === userId) && 
              conn.status === 'accepted'
    );
  } catch (error) {
    console.warn('Error loading connections:', error);
    return [];
  }
}

// Get connection stats for a user
export function getConnectionStats(userId: string): ConnectionStats {
  const connections = getUserConnections(userId);
  
  const following = connections.filter(conn => conn.userId === userId).length;
  const followers = connections.filter(conn => conn.connectedUserId === userId).length;
  
  // Find mutual connections (people who follow each other)
  const mutualConnections = connections.filter(conn => {
    if (conn.userId === userId) {
      // Check if this person also follows back
      return connections.some(otherConn => 
        otherConn.userId === conn.connectedUserId && 
        otherConn.connectedUserId === userId
      );
    }
    return false;
  }).length;

  return { following, followers, mutualConnections };
}

// Follow a user
export function followUser(userId: string, targetUserId: string, targetUserData: {
  name: string;
  email: string;
  avatar?: string;
  isVerified?: boolean;
  city?: string;
  state?: string;
}): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    const connections: UserConnection[] = stored ? JSON.parse(stored) : [];
    
    // Check if already following
    const existingConnection = connections.find(
      conn => conn.userId === userId && conn.connectedUserId === targetUserId
    );
    
    if (existingConnection) {
      return false; // Already following
    }

    const newConnection: UserConnection = {
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      connectedUserId: targetUserId,
      connectionType: 'following',
      status: 'accepted', // In a real app, this might be 'pending' for private accounts
      createdAt: new Date().toISOString(),
      connectedUser: {
        id: targetUserId,
        ...targetUserData
      }
    };

    connections.push(newConnection);
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
    return true;
  } catch (error) {
    console.warn('Error following user:', error);
    return false;
  }
}

// Unfollow a user
export function unfollowUser(userId: string, targetUserId: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(CONNECTIONS_KEY);
    const connections: UserConnection[] = stored ? JSON.parse(stored) : [];
    
    const updatedConnections = connections.filter(
      conn => !(conn.userId === userId && conn.connectedUserId === targetUserId)
    );
    
    localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(updatedConnections));
    return true;
  } catch (error) {
    console.warn('Error unfollowing user:', error);
    return false;
  }
}

// Check if user is following another user
export function isFollowing(userId: string, targetUserId: string): boolean {
  const connections = getUserConnections(userId);
  return connections.some(
    conn => conn.userId === userId && conn.connectedUserId === targetUserId
  );
}

// Get mutual connections attending an event
export function getMutualConnectionsForEvent(userId: string, eventId: string): UserConnection[] {
  if (typeof window === 'undefined') return [];

  // Get user's connections
  const connections = getUserConnections(userId);
  
  // Get event participants (from demo events or real events)
  // This is simplified - in a real app, you'd query event participants from the database
  const eventParticipants = getEventParticipants(eventId);
  
  // Find connections who are also attending the event
  const mutualConnections = connections.filter(conn => {
    const connectedUserId = conn.userId === userId ? conn.connectedUserId : conn.userId;
    return eventParticipants.some(participant => participant.userId === connectedUserId);
  });

  return mutualConnections;
}

// Simulate getting event participants (in real app, this would be from database)
function getEventParticipants(eventId: string): Array<{ userId: string; name: string }> {
  // This is demo data - in production, query actual event RSVPs
  const demoParticipants = [
    { userId: 'user-ana-silva', name: 'Ana Silva' },
    { userId: 'user-carlos-santos', name: 'Carlos Santos' },
    { userId: 'user-maria-oliveira', name: 'Maria Oliveira' },
    { userId: 'user-joao-ferreira', name: 'João Ferreira' },
    { userId: 'user-patricia-costa', name: 'Patrícia Costa' }
  ];
  
  return demoParticipants;
}

// Find suggested connections (people in same city/events)
export function getSuggestedConnections(userId: string, userCity?: string, userState?: string): UserConnection[] {
  // This would query database for users in same location or attending same events
  // For demo purposes, return some suggested users
  const suggestedUsers = [
    {
      id: 'user-ana-silva',
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      isVerified: true,
      city: userCity,
      state: userState
    },
    {
      id: 'user-carlos-santos', 
      name: 'Carlos Santos',
      email: 'carlos.santos@email.com',
      city: userCity,
      state: userState
    },
    {
      id: 'user-maria-oliveira',
      name: 'Maria Oliveira', 
      email: 'maria.oliveira@email.com',
      isVerified: true,
      city: userCity,
      state: userState
    }
  ];

  return suggestedUsers.map(user => ({
    id: `suggested-${user.id}`,
    userId: '',
    connectedUserId: user.id,
    connectionType: 'following' as const,
    status: 'pending' as const,
    createdAt: new Date().toISOString(),
    connectedUser: user
  }));
}

// Initialize demo connections for testing
export function initializeDemoConnections(userId: string): void {
  if (typeof window === 'undefined') return;

  const existingConnections = getUserConnections(userId);
  if (existingConnections.length > 0) return; // Already has connections

  // Add some demo connections
  const demoUsers = [
    {
      name: 'Ana Silva',
      email: 'ana.silva@email.com',
      isVerified: true,
      city: 'São Paulo',
      state: 'SP'
    },
    {
      name: 'Carlos Santos',
      email: 'carlos.santos@email.com',
      city: 'Rio de Janeiro', 
      state: 'RJ'
    }
  ];

  demoUsers.forEach((userData, index) => {
    followUser(userId, `user-${userData.name.toLowerCase().replace(' ', '-')}`, userData);
  });
}