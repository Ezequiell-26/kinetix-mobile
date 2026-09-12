/**
 * KinetixFitt - Shared Utilities
 * Cross-application utility functions
 */

// ============================================
// CLASSNAME UTILS
// ============================================

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

// ============================================
// DATE & TIME UTILS
// ============================================

export function formatDate(date: Date | string, locale: string = 'es-AR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatTime(date: Date | string, locale: string = 'es-AR'): string {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string, locale: string = 'es-AR'): string {
  return `${formatDate(date, locale)} ${formatTime(date, locale)}`;
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

export function getRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
  return `Hace ${Math.floor(diffDays / 365)} años`;
}

// ============================================
// NUMBER FORMATTERS
// ============================================

export function formatNumber(num: number, locale: string = 'es-AR'): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatWeight(kg: number, showUnit: boolean = true): string {
  const formatted = kg % 1 === 0 ? kg.toFixed(0) : kg.toFixed(1);
  return showUnit ? `${formatted} kg` : formatted;
}

export function formatPercentage(value: number, decimals: number = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatXP(xp: number): string {
  if (xp >= 1000000) return `${(xp / 1000000).toFixed(1)}M`;
  if (xp >= 1000) return `${(xp / 1000).toFixed(1)}K`;
  return xp.toString();
}

// ============================================
// FITNESS CALCULATIONS
// ============================================

export function calculateVolume(sets: Array<{ reps: number; weight: number }>): number {
  return sets.reduce((acc, set) => acc + set.reps * set.weight, 0);
}

export function calculateWorkoutDuration(startedAt: Date, completedAt: Date): number {
  return Math.floor((completedAt.getTime() - startedAt.getTime()) / 1000);
}

export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

export function calculateBMR(weight: number, heightCm: number, age: number, gender: 'male' | 'female'): number {
  // Mifflin-St Jeor equation
  const base = 10 * weight + 6.25 * heightCm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

export function calculateTDEE(bmr: number, activityLevel: number): number {
  // Activity multipliers: 1.2 (sedentary) to 1.9 (very active)
  return bmr * activityLevel;
}

export function calculateOneRepMax(weight: number, reps: number): number {
  // Epley formula
  return Math.round(weight * (1 + reps / 30));
}

export function calculateProgress(current: number, previous: number): number {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
}

// ============================================
// GAMIFICATION CALCULATIONS
// ============================================

export function calculateLevel(xp: number): number {
  let level = 1;
  let requiredXP = 0;

  while (requiredXP < xp) {
    requiredXP = level * 100 + (level - 1) * 50;
    if (requiredXP <= xp) level++;
    else break;
  }

  return Math.min(level, 20); // Max level 20
}

export function calculateXPForLevel(level: number): number {
  return level * 100 + (level - 1) * 50;
}

export function calculateXPProgress(currentXP: number, level: number): { current: number; required: number; percentage: number } {
  const required = calculateXPForLevel(level);
  const previousLevelXP = calculateXPForLevel(level - 1);
  const progress = currentXP - previousLevelXP;
  const range = required - previousLevelXP;

  return {
    current: progress,
    required: range,
    percentage: Math.min(100, (progress / range) * 100),
  };
}

export function calculateTier(level: number): 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' {
  if (level >= 20) return 'diamond';
  if (level >= 15) return 'platinum';
  if (level >= 10) return 'gold';
  if (level >= 5) return 'silver';
  return 'bronze';
}

export function calculateStreak(workoutDates: Date[]): number {
  if (workoutDates.length === 0) return 0;

  const sorted = [...workoutDates].sort((a, b) => b.getTime() - a.getTime());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let currentDate = today;

  for (const date of sorted) {
    const workoutDate = new Date(date);
    workoutDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) {
      streak++;
      currentDate = workoutDate;
    } else {
      break;
    }
  }

  return streak;
}

// ============================================
// VALIDATION UTILS
// ============================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) errors.push('Mínimo 8 caracteres');
  if (!/[A-Z]/.test(password)) errors.push('Al menos una mayúscula');
  if (!/[a-z]/.test(password)) errors.push('Al menos una minúscula');
  if (!/[0-9]/.test(password)) errors.push('Al menos un número');

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================
// STORAGE UTILS
// ============================================

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to storage: ${key}`, error);
  }
}

export function loadFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error loading from storage: ${key}`, error);
    return null;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from storage: ${key}`, error);
  }
}

// ============================================
// URL UTILS
// ============================================

export function buildURL(base: string, params?: Record<string, string | number | undefined>): string {
  if (!params) return base;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${base}?${queryString}` : base;
}

// ============================================
// ARRAY UTILS
// ============================================

export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T | ((item: T) => number), ascending: boolean = true): T[] {
  return [...array].sort((a, b) => {
    const aValue = typeof key === 'function' ? key(a) : a[key];
    const bValue = typeof key === 'function' ? key(b) : b[key];

    if (aValue < bValue) return ascending ? -1 : 1;
    if (aValue > bValue) return ascending ? 1 : -1;
    return 0;
  });
}

export function uniqueBy<T>(array: T[], key: keyof T | ((item: T) => string)): T[] {
  const seen = new Set<string>();
  return array.filter(item => {
    const keyValue = typeof key === 'function' ? key(item) : String(item[key]);
    if (seen.has(keyValue)) return false;
    seen.add(keyValue);
    return true;
  });
}

// ============================================
// OBJECT UTILS
// ============================================

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => {
    delete result[key];
  });
  return result;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

// ============================================
// PROMISE UTILS
// ============================================

export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
  );

  return Promise.race([promise, timeout]);
}

export async function retry<T>(fn: () => Promise<T>, maxAttempts: number = 3, delay: number = 1000): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }

  throw lastError;
}

// ============================================
// PERFORMANCE UTILS
// ============================================

export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(fn: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Export all utilities
export default {
  cn,
  formatDate,
  formatTime,
  formatDateTime,
  formatDuration,
  getRelativeTime,
  formatNumber,
  formatWeight,
  formatPercentage,
  formatXP,
  calculateVolume,
  calculateWorkoutDuration,
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  calculateOneRepMax,
  calculateProgress,
  calculateLevel,
  calculateXPForLevel,
  calculateXPProgress,
  calculateTier,
  calculateStreak,
  isValidEmail,
  isValidPassword,
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
  buildURL,
  groupBy,
  sortBy,
  uniqueBy,
  omit,
  pick,
  withTimeout,
  retry,
  debounce,
  throttle,
};
