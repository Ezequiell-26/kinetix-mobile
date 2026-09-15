/**
 * 🌍 SOCIALIZATION ENGINE - Sistema de Socialización y Comunidad
 * Basado en patrones de: Strava, Peloton, Nike Run Club (MIT)
 * 
 * Características:
 * - Perfiles de usuario públicos/privados
 * - Sistema de amigos y seguidores
 * - Feed de actividad social
 * - Retos y desafíos grupales
 * - Comentarios y reacciones
 * - Compartir logros en redes sociales
 * - Clubs y grupos de entrenamiento
 * - Chat en tiempo real
 */

export interface UserProfile {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  joinDate: Date;
  isVerified: boolean;
  isPrivate: boolean;
  stats: UserStats;
  preferences: PrivacySettings;
  socialLinks: SocialLinks;
}

export interface UserStats {
  followersCount: number;
  followingCount: number;
  totalWorkouts: number;
  totalDistance: number; // km
  totalCalories: number;
  averageWorkoutsPerWeek: number;
  personalRecords: PersonalRecord[];
  badges: string[];
  level: number;
  xp: number;
}

export interface PersonalRecord {
  type: string;
  value: number;
  unit: string;
  achievedAt: Date;
  workoutId?: string;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showWorkouts: boolean;
  showLocation: boolean;
  allowMessages: boolean;
  showOnlineStatus: boolean;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  strava?: string;
  website?: string;
}

export interface SocialConnection {
  connectionId: string;
  userId: string;
  targetUserId: string;
  type: 'follow' | 'friend' | 'blocked';
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  acceptedAt?: Date;
}

export interface ActivityPost {
  postId: string;
  userId: string;
  type: 'workout' | 'achievement' | 'challenge' | 'update' | 'photo';
  content: {
    title: string;
    description?: string;
    workoutData?: WorkoutSummary;
    achievementData?: AchievementData;
    images?: string[];
    videoUrl?: string;
  };
  visibility: 'public' | 'friends' | 'private';
  likes: string[]; // userIds
  comments: Comment[];
  shares: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSummary {
  workoutId: string;
  type: string;
  duration: number; // minutes
  calories: number;
  distance?: number; // km
  avgHeartRate?: number;
  maxHeartRate?: number;
  elevationGain?: number; // meters
  route?: GeoCoordinate[];
}

export interface GeoCoordinate {
  latitude: number;
  longitude: number;
  timestamp?: Date;
}

export interface AchievementData {
  achievementId: string;
  name: string;
  icon: string;
  description: string;
  rarity: string;
}

export interface Comment {
  commentId: string;
  postId: string;
  userId: string;
  content: string;
  likes: number;
  replies: Comment[];
  createdAt: Date;
  editedAt?: Date;
}

export interface Challenge {
  challengeId: string;
  title: string;
  description: string;
  type: 'individual' | 'team' | 'global';
  category: 'distance' | 'calories' | 'workouts' | 'consistency' | 'custom';
  goal: {
    type: string;
    target: number;
    unit: string;
  };
  startDate: Date;
  endDate: Date;
  participants: ChallengeParticipant[];
  teams?: ChallengeTeam[];
  prizes: ChallengePrize[];
  rules: string[];
  isActive: boolean;
  createdBy: string;
}

export interface ChallengeParticipant {
  userId: string;
  username: string;
  avatar?: string;
  currentProgress: number;
  rank: number;
  joinedAt: Date;
  isTeamCaptain?: boolean;
}

export interface ChallengeTeam {
  teamId: string;
  name: string;
  captainId: string;
  members: string[]; // userIds
  totalProgress: number;
  rank: number;
}

export interface ChallengePrize {
  rank: number;
  prize: string;
  value?: number;
  type: 'coins' | 'gems' | 'badge' | 'premium' | 'physical';
}

export interface Club {
  clubId: string;
  name: string;
  description: string;
  coverImage?: string;
  category: string;
  isPrivate: boolean;
  memberCount: number;
  members: ClubMember[];
  admins: string[]; // userIds
  rules: string[];
  createdAt: Date;
  activityFeed: ActivityPost[];
  upcomingEvents: ClubEvent[];
}

export interface ClubMember {
  userId: string;
  username: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
  contributionScore: number;
}

export interface ClubEvent {
  eventId: string;
  title: string;
  description: string;
  type: 'workout' | 'meetup' | 'challenge' | 'discussion';
  scheduledAt: Date;
  location?: string;
  maxParticipants?: number;
  registeredUsers: string[];
}

export interface Message {
  messageId: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'workout_share' | 'challenge_invite';
  attachments?: string[];
  readBy: string[]; // userIds
  createdAt: Date;
  editedAt?: Date;
}

export interface Conversation {
  conversationId: string;
  participants: string[]; // userIds
  lastMessage?: Message;
  unreadCount: Map<string, number>; // userId -> count
  updatedAt: Date;
}

export class SocializationEngine {
  private static instance: SocializationEngine;
  
  // Almacenamiento en memoria (en producción usar base de datos)
  private profiles: Map<string, UserProfile> = new Map();
  private connections: Map<string, SocialConnection[]> = new Map();
  private posts: ActivityPost[] = [];
  private challenges: Challenge[] = [];
  private clubs: Club[] = [];
  private messages: Map<string, Message[]> = new Map();
  private conversations: Map<string, Conversation> = new Map();

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): SocializationEngine {
    if (!SocializationEngine.instance) {
      SocializationEngine.instance = new SocializationEngine();
    }
    return SocializationEngine.instance;
  }

  /**
   * Inicializa datos de ejemplo
   */
  private initializeSampleData(): void {
    // Crear perfil de ejemplo
    const sampleProfile: UserProfile = {
      userId: 'user_1',
      username: 'fitness_pro',
      displayName: 'Fitness Pro',
      bio: 'Entrenador certificado | Amante del running | Motivando a otros 💪',
      location: 'Madrid, España',
      joinDate: new Date('2024-01-01'),
      isVerified: true,
      isPrivate: false,
      stats: {
        followersCount: 1250,
        followingCount: 340,
        totalWorkouts: 487,
        totalDistance: 2340.5,
        totalCalories: 156780,
        averageWorkoutsPerWeek: 5.2,
        personalRecords: [
          { type: '5K Run', value: 18.5, unit: 'minutes', achievedAt: new Date('2024-02-15') },
          { type: 'Max Push-ups', value: 150, unit: 'reps', achievedAt: new Date('2024-03-01') }
        ],
        badges: ['early_adopter', 'marathon_master', 'level_50'],
        level: 52,
        xp: 285000
      },
      preferences: {
        profileVisibility: 'public',
        showWorkouts: true,
        showLocation: true,
        allowMessages: true,
        showOnlineStatus: true
      },
      socialLinks: {
        instagram: '@fitness_pro',
        strava: 'fitnesspro'
      }
    };

    this.profiles.set('user_1', sampleProfile);
  }

  /**
   * Crea un nuevo perfil de usuario
   */
  public createProfile(userData: Partial<UserProfile>): UserProfile {
    if (!userData.userId || !userData.username) {
      throw new Error('userId y username son requeridos');
    }

    const profile: UserProfile = {
      userId: userData.userId,
      username: userData.username,
      displayName: userData.displayName || userData.username,
      avatar: userData.avatar,
      coverImage: userData.coverImage,
      bio: userData.bio,
      location: userData.location,
      joinDate: new Date(),
      isVerified: false,
      isPrivate: userData.isPrivate || false,
      stats: {
        followersCount: 0,
        followingCount: 0,
        totalWorkouts: 0,
        totalDistance: 0,
        totalCalories: 0,
        averageWorkoutsPerWeek: 0,
        personalRecords: [],
        badges: [],
        level: 1,
        xp: 0
      },
      preferences: {
        profileVisibility: 'public',
        showWorkouts: true,
        showLocation: false,
        allowMessages: true,
        showOnlineStatus: true
      },
      socialLinks: {}
    };

    this.profiles.set(userData.userId, profile);
    return profile;
  }

  /**
   * Obtiene el perfil de un usuario
   */
  public getProfile(userId: string): UserProfile | null {
    return this.profiles.get(userId) || null;
  }

  /**
   * Actualiza el perfil de un usuario
   */
  public updateProfile(userId: string, updates: Partial<UserProfile>): UserProfile | null {
    const profile = this.profiles.get(userId);
    if (!profile) return null;

    const updatedProfile = { ...profile, ...updates };
    this.profiles.set(userId, updatedProfile);
    return updatedProfile;
  }

  /**
   * Envía solicitud de seguimiento/amistad
   */
  public sendConnectionRequest(
    fromUserId: string,
    toUserId: string,
    type: 'follow' | 'friend' = 'follow'
  ): SocialConnection | null {
    if (fromUserId === toUserId) {
      throw new Error('No puedes seguirte a ti mismo');
    }

    const connection: SocialConnection = {
      connectionId: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: fromUserId,
      targetUserId: toUserId,
      type,
      status: type === 'follow' ? 'accepted' : 'pending',
      createdAt: new Date()
    };

    // Guardar conexión
    const userConnections = this.connections.get(fromUserId) || [];
    userConnections.push(connection);
    this.connections.set(fromUserId, userConnections);

    return connection;
  }

  /**
   * Acepta una solicitud de conexión
   */
  public acceptConnectionRequest(connectionId: string): boolean {
    // Implementación simplificada
    console.log(`Solicitud ${connectionId} aceptada`);
    return true;
  }

  /**
   * Crea una publicación de actividad
   */
  public createActivityPost(
    userId: string,
    postData: Partial<ActivityPost>
  ): ActivityPost {
    const profile = this.profiles.get(userId);
    if (!profile) {
      throw new Error('Usuario no encontrado');
    }

    const post: ActivityPost = {
      postId: `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: postData.type || 'update',
      content: postData.content || { title: '', description: '' },
      visibility: postData.visibility || 'public',
      likes: [],
      comments: [],
      shares: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.posts.unshift(post); // Agregar al inicio
    return post;
  }

  /**
   * Da like a una publicación
   */
  public likePost(postId: string, userId: string): boolean {
    const post = this.posts.find(p => p.postId === postId);
    if (!post) return false;

    if (!post.likes.includes(userId)) {
      post.likes.push(userId);
      post.updatedAt = new Date();
      return true;
    }

    return false;
  }

  /**
   * Agrega un comentario a una publicación
   */
  public addComment(
    postId: string,
    userId: string,
    content: string
  ): Comment | null {
    const post = this.posts.find(p => p.postId === postId);
    if (!post) return null;

    const comment: Comment = {
      commentId: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      postId,
      userId,
      content,
      likes: 0,
      replies: [],
      createdAt: new Date()
    };

    post.comments.push(comment);
    post.updatedAt = new Date();

    return comment;
  }

  /**
   * Obtiene el feed de actividad
   */
  public getActivityFeed(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): ActivityPost[] {
    const profile = this.profiles.get(userId);
    if (!profile) return [];

    // Obtener usuarios que sigue
    const following = this.connections.get(userId) || [];
    const followingIds = following
      .filter(c => c.status === 'accepted')
      .map(c => c.targetUserId);

    // Filtrar posts públicos y de usuarios seguidos
    const filteredPosts = this.posts.filter(post => {
      if (post.visibility === 'private') return false;
      if (post.visibility === 'friends' && !followingIds.includes(post.userId)) return false;
      return true;
    });

    return filteredPosts.slice(offset, offset + limit);
  }

  /**
   * Crea un desafío
   */
  public createChallenge(
    creatorId: string,
    challengeData: Partial<Challenge>
  ): Challenge {
    const challenge: Challenge = {
      challengeId: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: challengeData.title || 'Nuevo Desafío',
      description: challengeData.description || '',
      type: challengeData.type || 'individual',
      category: challengeData.category || 'workouts',
      goal: challengeData.goal || { type: 'workouts', target: 10, unit: 'sessions' },
      startDate: challengeData.startDate || new Date(),
      endDate: challengeData.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      participants: [],
      prizes: challengeData.prizes || [],
      rules: challengeData.rules || [],
      isActive: true,
      createdBy: creatorId
    };

    // Agregar creador como participante
    const creatorProfile = this.profiles.get(creatorId);
    if (creatorProfile) {
      challenge.participants.push({
        userId: creatorId,
        username: creatorProfile.username,
        avatar: creatorProfile.avatar,
        currentProgress: 0,
        rank: 1,
        joinedAt: new Date()
      });
    }

    this.challenges.push(challenge);
    return challenge;
  }

  /**
   * Une a un usuario a un desafío
   */
  public joinChallenge(challengeId: string, userId: string): boolean {
    const challenge = this.challenges.find(c => c.challengeId === challengeId);
    if (!challenge || !challenge.isActive) return false;

    const profile = this.profiles.get(userId);
    if (!profile) return false;

    // Verificar si ya es participante
    if (challenge.participants.some(p => p.userId === userId)) {
      return false;
    }

    challenge.participants.push({
      userId,
      username: profile.username,
      avatar: profile.avatar,
      currentProgress: 0,
      rank: challenge.participants.length + 1,
      joinedAt: new Date()
    });

    return true;
  }

  /**
   * Actualiza el progreso en un desafío
   */
  public updateChallengeProgress(
    challengeId: string,
    userId: string,
    progress: number
  ): boolean {
    const challenge = this.challenges.find(c => c.challengeId === challengeId);
    if (!challenge) return false;

    const participant = challenge.participants.find(p => p.userId === userId);
    if (!participant) return false;

    participant.currentProgress += progress;

    // Recalcular rankings
    challenge.participants.sort((a, b) => b.currentProgress - a.currentProgress);
    challenge.participants.forEach((p, index) => {
      p.rank = index + 1;
    });

    return true;
  }

  /**
   * Crea un club
   */
  public createClub(
    creatorId: string,
    clubData: Partial<Club>
  ): Club {
    const club: Club = {
      clubId: `club_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: clubData.name || 'Nuevo Club',
      description: clubData.description || '',
      coverImage: clubData.coverImage,
      category: clubData.category || 'general',
      isPrivate: clubData.isPrivate || false,
      memberCount: 1,
      members: [],
      admins: [creatorId],
      rules: clubData.rules || [],
      createdAt: new Date(),
      activityFeed: [],
      upcomingEvents: []
    };

    // Agregar creador como miembro admin
    const creatorProfile = this.profiles.get(creatorId);
    if (creatorProfile) {
      club.members.push({
        userId: creatorId,
        username: creatorProfile.username,
        role: 'admin',
        joinedAt: new Date(),
        contributionScore: 100
      });
    }

    this.clubs.push(club);
    return club;
  }

  /**
   * Une a un usuario a un club
   */
  public joinClub(clubId: string, userId: string): boolean {
    const club = this.clubs.find(c => c.clubId === clubId);
    if (!club) return false;

    // Verificar si ya es miembro
    if (club.members.some(m => m.userId === userId)) {
      return false;
    }

    const profile = this.profiles.get(userId);
    if (!profile) return false;

    club.members.push({
      userId,
      username: profile.username,
      role: 'member',
      joinedAt: new Date(),
      contributionScore: 0
    });

    club.memberCount++;
    return true;
  }

  /**
   * Envía un mensaje privado
   */
  public sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: 'text' | 'image' | 'workout_share' | 'challenge_invite' = 'text'
  ): Message | null {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return null;

    // Verificar que el sender es participante
    if (!conversation.participants.includes(senderId)) {
      return null;
    }

    const message: Message = {
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId,
      content,
      type,
      readBy: [senderId],
      createdAt: new Date()
    };

    // Agregar mensaje
    const messages = this.messages.get(conversationId) || [];
    messages.push(message);
    this.messages.set(conversationId, messages);

    // Actualizar conversación
    conversation.lastMessage = message;
    conversation.updatedAt = new Date();

    // Actualizar contadores de no leídos
    conversation.participants
      .filter(p => p !== senderId)
      .forEach(participantId => {
        const count = conversation.unreadCount.get(participantId) || 0;
        conversation.unreadCount.set(participantId, count + 1);
      });

    return message;
  }

  /**
   * Crea una conversación entre usuarios
   */
  public createConversation(participantIds: string[]): Conversation | null {
    if (participantIds.length < 2) {
      throw new Error('Se necesitan al menos 2 participantes');
    }

    const conversation: Conversation = {
      conversationId: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      participants: participantIds,
      unreadCount: new Map(participantIds.map(id => [id, 0])),
      updatedAt: new Date()
    };

    this.conversations.set(conversation.conversationId, conversation);
    this.messages.set(conversation.conversationId, []);

    return conversation;
  }

  /**
   * Marca mensajes como leídos
   */
  public markAsRead(conversationId: string, userId: string): boolean {
    const conversation = this.conversations.get(conversationId);
    if (!conversation) return false;

    conversation.unreadCount.set(userId, 0);
    return true;
  }

  /**
   * Genera enlace para compartir en redes sociales
   */
  public generateShareLink(
    type: 'workout' | 'achievement' | 'challenge' | 'profile',
    itemId: string,
    platform: 'twitter' | 'facebook' | 'instagram' | 'whatsapp'
  ): string {
    const baseUrl = 'https://kinetixfit.com';
    let url = '';
    let text = '';

    switch (type) {
      case 'workout':
        url = `${baseUrl}/workout/${itemId}`;
        text = '¡Acabo de completar un entrenamiento increíble en KinetixFit! 💪';
        break;
      case 'achievement':
        url = `${baseUrl}/achievements/${itemId}`;
        text = '¡Desbloqueé un nuevo logro en KinetixFit! 🏆';
        break;
      case 'challenge':
        url = `${baseUrl}/challenges/${itemId}`;
        text = '¡Únete a este desafío en KinetixFit! 🔥';
        break;
      case 'profile':
        url = `${baseUrl}/profile/${itemId}`;
        text = 'Sigue mi progreso fitness en KinetixFit! 📈';
        break;
    }

    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(url);

    switch (platform) {
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
      case 'whatsapp':
        return `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
      case 'instagram':
        return url; // Instagram no soporta sharing directo via URL
      default:
        return url;
    }
  }

  /**
   * Obtiene estadísticas de un usuario
   */
  public getUserStats(userId: string): UserStats | null {
    const profile = this.profiles.get(userId);
    return profile ? profile.stats : null;
  }

  /**
   * Exporta datos sociales para backup
   */
  public exportUserData(userId: string): object {
    const profile = this.profiles.get(userId);
    const connections = this.connections.get(userId) || [];
    const userPosts = this.posts.filter(p => p.userId === userId);

    return {
      profile,
      connections,
      posts: userPosts,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Notifica a usuarios sobre actividad relevante
   */
  public notifyUsers(eventType: string, data: any): void {
    console.log(`🔔 Notificación ${eventType}:`, data);
    // En producción, esto enviaría push notifications, emails, etc.
  }
}

// Hook personalizado para React
export const useSocialization = (userId: string) => {
  const engine = SocializationEngine.getInstance();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [feed, setFeed] = React.useState<ActivityPost[]>([]);

  React.useEffect(() => {
    const userProfile = engine.getProfile(userId);
    if (userProfile) {
      setProfile(userProfile);
    }
  }, [userId]);

  const refreshFeed = () => {
    const activityFeed = engine.getActivityFeed(userId);
    setFeed(activityFeed);
  };

  React.useEffect(() => {
    refreshFeed();
    const interval = setInterval(refreshFeed, 30000); // Refresh cada 30s
    return () => clearInterval(interval);
  }, [userId]);

  return {
    profile,
    feed,
    refreshFeed,
    createPost: (data: Partial<ActivityPost>) => engine.createActivityPost(userId, data),
    likePost: (postId: string) => engine.likePost(postId, userId),
    addComment: (postId: string, content: string) => engine.addComment(postId, userId, content),
    followUser: (targetId: string) => engine.sendConnectionRequest(userId, targetId),
    joinChallenge: (challengeId: string) => engine.joinChallenge(challengeId, userId),
    joinClub: (clubId: string) => engine.joinClub(clubId, userId),
    getShareLink: (type: any, itemId: string, platform: any) => 
      engine.generateShareLink(type, itemId, platform)
  };
};

import React from 'react';

export default SocializationEngine;
