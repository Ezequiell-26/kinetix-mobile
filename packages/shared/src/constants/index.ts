/**
 * KinetixFitt - Shared Constants
 * Cross-application constants and configuration
 */

import { BRAND } from './branding';

// ============================================
// DESIGN TOKENS
// ============================================

export const COLORS = {
  primary: BRAND.colors.primary,
  primaryHover: '#E4FF5C',
  primaryRGB: BRAND.colors.primaryRGB,
  dark: BRAND.colors.dark,
  darkRGB: BRAND.colors.darkRGB,
  success: '#34D399', // Emerald-400
  warning: '#FBBF24', // Amber-400
  danger: '#F87171', // Red-400
  info: '#38BDF8', // Sky-400
  ai: '#A78BFA', // Violet-400
  premium: '#A78BFA',
} as const;

export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem',   // 32px
  '4xl': '2.5rem', // 40px
} as const;

export const RADIUS = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.25rem',// 20px
  full: '9999px',
} as const;

export const FONT_SIZES = {
  xs: '0.75rem',   // 12px
  sm: '0.875rem',  // 14px
  base: '1rem',    // 16px
  lg: '1.125rem',  // 18px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
  '5xl': '3rem',     // 48px
} as const;

export const FONT_WEIGHTS = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
} as const;

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: '0 0 20px rgba(52, 211, 153, 0.3)',
  glowStrong: '0 0 40px rgba(52, 211, 153, 0.5)',
} as const;

// ============================================
// BREAKPOINTS
// ============================================

export const BREAKPOINTS = {
  sm: 640,    // Mobile landscape
  md: 768,    // Tablet
  lg: 1024,   // Desktop small
  xl: 1280,   // Desktop medium
  '2xl': 1536,// Desktop large
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// ============================================
// WORKOUT CONSTANTS
// ============================================

export const WORKOUT_STATUS = {
  PLANNED: 'planned',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;

export const MUSCLE_GROUPS = [
  'chest',
  'back',
  'shoulders',
  'biceps',
  'triceps',
  'quadriceps',
  'hamstrings',
  'glutes',
  'calves',
  'abs',
  'forearms',
  'cardio',
  'full_body',
] as const;

export const EQUIPMENT_TYPES = [
  'barbell',
  'dumbbell',
  'kettlebell',
  'machine',
  'cable',
  'bodyweight',
  'resistance_band',
  'medicine_ball',
  'foam_roller',
  'none',
] as const;

// ============================================
// GAMIFICATION CONSTANTS
// ============================================

export const XP_REQUIREMENTS = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 800,
  6: 1200,
  7: 1700,
  8: 2300,
  9: 3000,
  10: 3800,
  11: 4700,
  12: 5700,
  13: 6800,
  14: 8000,
  15: 9300,
  16: 10700,
  17: 12200,
  18: 13800,
  19: 15500,
  20: 17300,
} as const;

export const TIERS = {
  BRONZE: { level: 1, color: '#CD7F32', multiplier: 1 },
  SILVER: { level: 5, color: '#C0C0C0', multiplier: 1.1 },
  GOLD: { level: 10, color: '#FFD700', multiplier: 1.25 },
  PLATINUM: { level: 15, color: '#E5E4E2', multiplier: 1.5 },
  DIAMOND: { level: 20, color: '#B9F2FF', multiplier: 2 },
} as const;

export const ACHIEVEMENT_RARITY = {
  COMMON: { name: 'Common', color: '#9CA3AF', xpMultiplier: 1 },
  UNCOMMON: { name: 'Uncommon', color: '#34D399', xpMultiplier: 1.25 },
  RARE: { name: 'Rare', color: '#38BDF8', xpMultiplier: 1.5 },
  EPIC: { name: 'Epic', color: '#A78BFA', xpMultiplier: 2 },
  LEGENDARY: { name: 'Legendary', color: '#FBBF24', xpMultiplier: 3 },
} as const;

// ============================================
// NUTRITION CONSTANTS
// ============================================

export const MEAL_TYPES = [
  'breakfast',
  'snack_morning',
  'lunch',
  'snack_afternoon',
  'dinner',
  'snack_evening',
] as const;

export const MACRO_UNITS = {
  protein: 'g',
  carbs: 'g',
  fat: 'g',
  fiber: 'g',
  sugar: 'g',
  calories: 'kcal',
} as const;

// ============================================
// TIME CONSTANTS
// ============================================

export const TIME = {
  SECOND: 1000,
  MINUTE: 60 * 1000,
  HOUR: 60 * 60 * 1000,
  DAY: 24 * 60 * 60 * 1000,
  WEEK: 7 * 24 * 60 * 60 * 1000,
  MONTH: 30 * 24 * 60 * 60 * 1000,
} as const;

export const REST_TIMES = {
  strength: { min: 120, max: 300 }, // seconds
  hypertrophy: { min: 60, max: 120 },
  endurance: { min: 30, max: 60 },
  hiit: { min: 15, max: 45 },
} as const;

// ============================================
// VOICE CONSTANTS
// ============================================

export const VOICE_SETTINGS_DEFAULT = {
  enabled: true,
  volume: 0.7,
  verbosity: 'normal' as const,
  exerciseNames: true,
  countdown: true,
  motivation: true,
};

export const VOICE_EVENTS = [
  'workout_start',
  'set_complete',
  'rest_start',
  'rest_end',
  'workout_complete',
  'achievement_unlocked',
  'personal_record',
  'encouragement',
] as const;

// ============================================
// ANALYTICS CONSTANTS
// ============================================

export const ANALYTICS_EVENTS = {
  WORKOUT_STARTED: 'workout_started',
  WORKOUT_COMPLETED: 'workout_completed',
  WORKOUT_CANCELLED: 'workout_cancelled',
  SET_COMPLETED: 'set_completed',
  EXERCISE_ADDED: 'exercise_added',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  LEVEL_UP: 'level_up',
  MESSAGE_SENT: 'message_sent',
  CHECKIN_COMPLETED: 'checkin_completed',
  PAYMENT_PROCESSED: 'payment_processed',
} as const;

// ============================================
// ERROR CODES
// ============================================

export const ERROR_CODES = {
  AUTH: {
    INVALID_CREDENTIALS: 'AUTH_INVALID_CREDENTIALS',
    TOKEN_EXPIRED: 'AUTH_TOKEN_EXPIRED',
    UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
    FORBIDDEN: 'AUTH_FORBIDDEN',
  },
  VALIDATION: {
    INVALID_INPUT: 'VALIDATION_INVALID_INPUT',
    REQUIRED_FIELD: 'VALIDATION_REQUIRED_FIELD',
    INVALID_FORMAT: 'VALIDATION_INVALID_FORMAT',
  },
  DATABASE: {
    NOT_FOUND: 'DB_NOT_FOUND',
    DUPLICATE: 'DB_DUPLICATE',
    CONSTRAINT_VIOLATION: 'DB_CONSTRAINT_VIOLATION',
  },
  SERVER: {
    INTERNAL_ERROR: 'SERVER_INTERNAL_ERROR',
    UNAVAILABLE: 'SERVER_UNAVAILABLE',
    TIMEOUT: 'SERVER_TIMEOUT',
  },
} as const;

// ============================================
// LOCAL STORAGE KEYS
// ============================================

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'kinetix_auth_token',
  USER_PREFERENCES: 'kinetix_preferences',
  WORKOUT_DRAFT: 'kinetix_workout_draft',
  THEME: 'kinetix_theme',
  VOICE_SETTINGS: 'kinetix_voice',
  ONBOARDING_COMPLETE: 'kinetix_onboarding',
} as const;

// ============================================
// ROUTES
// ============================================

export const ROUTES = {
  CLIENT: {
    DASHBOARD: '/client/dashboard',
    WORKOUT: '/client/workout',
    WORKOUT_DETAIL: (id: string) => `/client/workout/${id}`,
    PROGRESS: '/client/progress',
    HISTORY: '/client/history',
    NUTRITION: '/client/nutrition',
    TOOLS: '/client/tools',
    MESSAGES: '/client/messages',
    SETTINGS: '/client/settings',
    ACHIEVEMENTS: '/client/achievements',
  },
  TRAINER: {
    DASHBOARD: '/trainer/dashboard',
    CLIENTS: '/trainer/clients',
    CLIENT_DETAIL: (id: string) => `/trainer/clients/${id}`,
    STUDIO: '/trainer/studio',
    WORKOUTS: '/trainer/workouts',
    PROGRAMS: '/trainer/programs',
    ANALYTICS: '/trainer/analytics',
    MESSAGES: '/trainer/messages',
    PAYMENTS: '/trainer/payments',
    SETTINGS: '/trainer/settings',
  },
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
  },
  PUBLIC: {
    HOME: '/',
    ABOUT: '/about',
    CONTACT: '/contact',
  },
} as const;

// ============================================
// TOUCH TARGET SIZES (Accessibility)
// ============================================

export const TOUCH_TARGET = {
  MIN: 44,  // Apple HIG minimum
  RECOMMENDED: 48, // WCAG recommended
  LARGE: 56, // Primary actions
} as const;

// ============================================
// ANIMATION DURATIONS
// ============================================

export const ANIMATION = {
  MICRO: 150,    // 150ms - micro interactions
  FAST: 220,     // 220ms - UI transitions
  NORMAL: 300,   // 300ms - standard animations
  SLOW: 400,     // 400ms - immersive transitions
  CELEBRATION: 800, // 800ms - celebrations
} as const;

export default {
  APP_CONFIG,
  COLORS,
  SPACING,
  RADIUS,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
  BREAKPOINTS,
  WORKOUT_STATUS,
  DIFFICULTY_LEVELS,
  MUSCLE_GROUPS,
  EQUIPMENT_TYPES,
  XP_REQUIREMENTS,
  TIERS,
  ACHIEVEMENT_RARITY,
  MEAL_TYPES,
  MACRO_UNITS,
  TIME,
  REST_TIMES,
  VOICE_SETTINGS_DEFAULT,
  VOICE_EVENTS,
  ANALYTICS_EVENTS,
  ERROR_CODES,
  STORAGE_KEYS,
  ROUTES,
  TOUCH_TARGET,
  ANIMATION,
};
