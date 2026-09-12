/**
 * KinetixFitt - Shared Types
 * Cross-application type definitions for mobile + web
 */

// ============================================
// USER & AUTH
// ============================================

export type UserRole = 'client' | 'trainer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client extends User {
  role: 'client';
  trainerId: string | null;
  goal?: string | null;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | null;
  birthDate?: Date | null;
  gender?: 'male' | 'female' | 'other' | null;
  height?: number | null; // cm
  weight?: number | null; // kg
  onboardingCompleted: boolean;
}

export interface Trainer extends User {
  role: 'trainer';
  businessName?: string | null;
  specialization?: string | null;
  certifications?: string[];
  clientsCount: number;
}

// ============================================
// WORKOUT & EXERCISES
// ============================================

export interface Exercise {
  id: string;
  name: string;
  description?: string | null;
  muscleGroup: string;
  secondaryMuscles?: string[];
  equipment?: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions?: string[];
  tempo?: string | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSet {
  id?: string;
  reps: number;
  weight: number; // kg
  rir?: number | null; // Reps in Reserve
  rpe?: number | null; // Rate of Perceived Exertion
  completed: boolean;
  notes?: string | null;
}

export interface WorkoutExercise {
  id?: string;
  exerciseId: string;
  exercise?: Exercise;
  order: number;
  sets: WorkoutSet[];
  targetSets: number;
  targetReps?: string | null;
  notes?: string | null;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  exercises: WorkoutExercise[];
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  scheduledDate?: Date | null;
  startedAt?: Date | null;
  completedAt?: Date | null;
  duration?: number | null; // seconds
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PROGRAMS
// ============================================

export interface Program {
  id: string;
  trainerId: string;
  name: string;
  description?: string | null;
  durationWeeks: number;
  workouts: Workout[];
  level: 'beginner' | 'intermediate' | 'advanced';
  goal: string;
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// PROGRESS & MEASUREMENTS
// ============================================

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: Date;
  weight?: number | null; // kg
  bodyFatPercentage?: number | null;
  chest?: number | null; // cm
  waist?: number | null; // cm
  hips?: number | null; // cm
  arms?: number | null; // cm
  thighs?: number | null; // cm
  notes?: string | null;
  createdAt: Date;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  url: string;
  viewAngle: 'front' | 'back' | 'side' | 'other';
  date: Date;
  notes?: string | null;
  createdAt: Date;
}

// ============================================
// GAMIFICATION
// ============================================

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'workout' | 'consistency' | 'strength' | 'nutrition' | 'social' | 'special';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  xpReward: number;
  requirements: Record<string, number>;
  createdAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  achievement?: Achievement;
  unlockedAt: Date;
  progress: number; // 0-100
  isClaimed: boolean;
}

export interface UserLevel {
  id: string;
  userId: string;
  level: number;
  currentXP: number;
  requiredXP: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  streak: number; // days
  lastWorkoutDate?: Date | null;
  updatedAt: Date;
}

// ============================================
// MESSAGING
// ============================================

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  isRead: boolean;
  readAt?: Date | null;
  createdAt: Date;
}

export interface Conversation {
  participantIds: [string, string];
  messages: Message[];
  lastMessageAt: Date;
  unreadCount: number;
}

// ============================================
// NOTIFICATIONS
// ============================================

export interface Notification {
  id: string;
  userId: string;
  type: 'workout' | 'achievement' | 'message' | 'reminder' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string | null;
  metadata?: Record<string, any>;
  createdAt: Date;
}

// ============================================
// AI & VOICE
// ============================================

export interface AICoachMessage {
  id: string;
  userId: string;
  context: 'workout' | 'progress' | 'nutrition' | 'recovery' | 'general';
  content: string;
  actionSuggestion?: string | null;
  confidence: number; // 0-1
  source: 'analysis' | 'proactive' | 'reactive';
  createdAt: Date;
}

export interface VoiceSetting {
  enabled: boolean;
  volume: number; // 0-1
  verbosity: 'minimal' | 'normal' | 'detailed';
  exerciseNames: boolean;
  countdown: boolean;
  motivation: boolean;
}

// ============================================
// ANALYTICS
// ============================================

export interface WorkoutAnalytics {
  totalWorkouts: number;
  completedWorkouts: number;
  totalVolume: number; // kg
  averageDuration: number; // seconds
  consistencyRate: number; // 0-1
  streakCurrent: number;
  streakBest: number;
  personalRecords: number;
  weeklyTrend: Array<{
    week: string;
    workouts: number;
    volume: number;
  }>;
}

export interface ClientAnalytics {
  adherenceRate: number; // 0-1
  progressScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  lastActiveAt?: Date | null;
  upcomingSessions: number;
  missedSessions: number;
}

// ============================================
// API RESPONSES
// ============================================

export interface APIResponse<T> {
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================
// UTILS TYPES
// ============================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDelete {
  deletedAt?: Date | null;
}
