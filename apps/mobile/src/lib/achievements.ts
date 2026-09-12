/**
 * Sistema de Achievements y Gamificación
 * Badges, niveles, XP, challenges, leaderboards
 */

export type AchievementCategory =
  | "workouts"
  | "consistency"
  | "strength"
  | "volume"
  | "social"
  | "milestones";

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  icon: string;
  xp: number;
  requirement: {
    type: string;
    value: number;
    current?: number;
  };
  unlocked: boolean;
  unlockedAt?: Date;
}

export const ACHIEVEMENTS: Achievement[] = [
  // ─── WORKOUTS ───────────────────────────────────────────────────
  {
    id: "first-workout",
    name: "Primera Sesión",
    description: "Completá tu primer entrenamiento",
    category: "workouts",
    tier: "bronze",
    icon: "🏋️",
    xp: 50,
    requirement: { type: "workouts_completed", value: 1 },
    unlocked: false,
  },
  {
    id: "10-workouts",
    name: "Dedicación",
    description: "Completá 10 entrenamientos",
    category: "workouts",
    tier: "silver",
    icon: "💪",
    xp: 200,
    requirement: { type: "workouts_completed", value: 10 },
    unlocked: false,
  },
  {
    id: "50-workouts",
    name: "Comprometido",
    description: "Completá 50 entrenamientos",
    category: "workouts",
    tier: "gold",
    icon: "🔥",
    xp: 500,
    requirement: { type: "workouts_completed", value: 50 },
    unlocked: false,
  },
  {
    id: "100-workouts",
    name: "Atleta Elite",
    description: "Completá 100 entrenamientos",
    category: "workouts",
    tier: "platinum",
    icon: "⭐",
    xp: 1000,
    requirement: { type: "workouts_completed", value: 100 },
    unlocked: false,
  },
  {
    id: "365-workouts",
    name: "Guerrero",
    description: "Completá 365 entrenamientos",
    category: "workouts",
    tier: "diamond",
    icon: "👑",
    xp: 5000,
    requirement: { type: "workouts_completed", value: 365 },
    unlocked: false,
  },

  // ─── CONSISTENCY ────────────────────────────────────────────────
  {
    id: "streak-7",
    name: "Semana Perfecta",
    description: "Entrená 7 días seguidos",
    category: "consistency",
    tier: "bronze",
    icon: "🔥",
    xp: 100,
    requirement: { type: "streak_days", value: 7 },
    unlocked: false,
  },
  {
    id: "streak-30",
    name: "Mes Imparable",
    description: "Entrená 30 días seguidos",
    category: "consistency",
    tier: "silver",
    icon: "🌟",
    xp: 500,
    requirement: { type: "streak_days", value: 30 },
    unlocked: false,
  },
  {
    id: "streak-90",
    name: "Disciplina de Hierro",
    description: "Entrená 90 días seguidos",
    category: "consistency",
    tier: "gold",
    icon: "💎",
    xp: 2000,
    requirement: { type: "streak_days", value: 90 },
    unlocked: false,
  },
  {
    id: "streak-365",
    name: "Leyenda",
    description: "Entrená 365 días seguidos",
    category: "consistency",
    tier: "diamond",
    icon: "🏆",
    xp: 10000,
    requirement: { type: "streak_days", value: 365 },
    unlocked: false,
  },

  // ─── STRENGTH ───────────────────────────────────────────────────
  {
    id: "bench-100kg",
    name: "Press de 100",
    description: "Press de banca con 100kg",
    category: "strength",
    tier: "silver",
    icon: "💪",
    xp: 300,
    requirement: { type: "max_bench", value: 100 },
    unlocked: false,
  },
  {
    id: "squat-140kg",
    name: "Sentadilla 140",
    description: "Sentadilla con 140kg",
    category: "strength",
    tier: "gold",
    icon: "🦵",
    xp: 500,
    requirement: { type: "max_squat", value: 140 },
    unlocked: false,
  },
  {
    id: "deadlift-180kg",
    name: "Peso Muerto 180",
    description: "Peso muerto con 180kg",
    category: "strength",
    tier: "platinum",
    icon: "🏋️",
    xp: 800,
    requirement: { type: "max_deadlift", value: 180 },
    unlocked: false,
  },
  {
    id: "bodyweight-bench",
    name: "Press con Tu Peso",
    description: "Press de banca con tu peso corporal",
    category: "strength",
    tier: "gold",
    icon: "💯",
    xp: 600,
    requirement: { type: "bench_bodyweight_ratio", value: 1 },
    unlocked: false,
  },

  // ─── VOLUME ─────────────────────────────────────────────────────
  {
    id: "volume-10k",
    name: "10K de Volumen",
    description: "Levantá 10,000kg de volumen total",
    category: "volume",
    tier: "bronze",
    icon: "📊",
    xp: 150,
    requirement: { type: "total_volume_kg", value: 10000 },
    unlocked: false,
  },
  {
    id: "volume-50k",
    name: "50K de Volumen",
    description: "Levantá 50,000kg de volumen total",
    category: "volume",
    tier: "silver",
    icon: "📈",
    xp: 400,
    requirement: { type: "total_volume_kg", value: 50000 },
    unlocked: false,
  },
  {
    id: "volume-100k",
    name: "100K de Volumen",
    description: "Levantá 100,000kg de volumen total",
    category: "volume",
    tier: "gold",
    icon: "⚡",
    xp: 800,
    requirement: { type: "total_volume_kg", value: 100000 },
    unlocked: false,
  },
  {
    id: "volume-500k",
    name: "Máquina de Hierro",
    description: "Levantá 500,000kg de volumen total",
    category: "volume",
    tier: "platinum",
    icon: "🔩",
    xp: 3000,
    requirement: { type: "total_volume_kg", value: 500000 },
    unlocked: false,
  },

  // ─── SOCIAL ─────────────────────────────────────────────────────
  {
    id: "first-checkin",
    name: "Primera Conexión",
    description: "Enviá tu primer check-in",
    category: "social",
    tier: "bronze",
    icon: "📝",
    xp: 50,
    requirement: { type: "checkins_sent", value: 1 },
    unlocked: false,
  },
  {
    id: "10-checkins",
    name: "Comunicativo",
    description: "Enviá 10 check-ins",
    category: "social",
    tier: "silver",
    icon: "💬",
    xp: 200,
    requirement: { type: "checkins_sent", value: 10 },
    unlocked: false,
  },
  {
    id: "invite-friend",
    name: "Embajador",
    description: "Invitá a un amigo a entrenar",
    category: "social",
    tier: "gold",
    icon: "👥",
    xp: 500,
    requirement: { type: "referrals", value: 1 },
    unlocked: false,
  },

  // ─── MILESTONES ─────────────────────────────────────────────────
  {
    id: "first-month",
    name: "Primer Mes",
    description: "Completá tu primer mes de entrenamiento",
    category: "milestones",
    tier: "silver",
    icon: "📅",
    xp: 300,
    requirement: { type: "days_active", value: 30 },
    unlocked: false,
  },
  {
    id: "six-months",
    name: "Medio Año",
    description: "Completá 6 meses de entrenamiento",
    category: "milestones",
    tier: "gold",
    icon: "⏳",
    xp: 1000,
    requirement: { type: "days_active", value: 180 },
    unlocked: false,
  },
  {
    id: "one-year",
    name: "Un Año Completo",
    description: "Completá 1 año de entrenamiento",
    category: "milestones",
    tier: "platinum",
    icon: "🎂",
    xp: 3000,
    requirement: { type: "days_active", value: 365 },
    unlocked: false,
  },
  {
    id: "weight-goal",
    name: "Meta de Peso",
    description: "Alcanzá tu meta de peso",
    category: "milestones",
    tier: "gold",
    icon: "🎯",
    xp: 800,
    requirement: { type: "weight_goal_reached", value: 1 },
    unlocked: false,
  },
];

// ─── XP Y NIVELES ───────────────────────────────────────────────────

export interface Level {
  level: number;
  xpRequired: number;
  title: string;
  benefits: string[];
}

export const LEVELS: Level[] = [
  { level: 1, xpRequired: 0, title: "Principiante", benefits: ["Acceso a la plataforma"] },
  { level: 2, xpRequired: 100, title: "Novato", benefits: ["Badge de nivel 2"] },
  { level: 3, xpRequired: 300, title: "Aprendiz", benefits: ["Unlocked: Progress Charts"] },
  { level: 4, xpRequired: 600, title: "Dedicado", benefits: ["Badge de nivel 4"] },
  { level: 5, xpRequired: 1000, title: "Comprometido", benefits: ["Unlocked: Custom Themes"] },
  { level: 6, xpRequired: 1500, title: "Avanzado", benefits: ["Badge de nivel 6"] },
  { level: 7, xpRequired: 2200, title: "Experimentado", benefits: ["Unlocked: Advanced Analytics"] },
  { level: 8, xpRequired: 3000, title: "Experto", benefits: ["Badge de nivel 8"] },
  { level: 9, xpRequired: 4000, title: "Maestro", benefits: ["Unlocked: Community Features"] },
  { level: 10, xpRequired: 5500, title: "Elite", benefits: ["Badge Elite", "Priority Support"] },
  { level: 11, xpRequired: 7500, title: "Campeón", benefits: ["Badge de nivel 11"] },
  { level: 12, xpRequired: 10000, title: "Leyenda", benefits: ["Badge Leyenda", "Exclusive Content"] },
  { level: 13, xpRequired: 13000, title: "Titán", benefits: ["Badge de nivel 13"] },
  { level: 14, xpRequired: 17000, title: "Semi-Dios", benefits: ["Badge de nivel 14"] },
  { level: 15, xpRequired: 22000, title: "Dios del Fitness", benefits: ["Badge Ultimate", "All Features Unlocked"] },
];

export function getLevelFromXP(xp: number): Level {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].xpRequired) {
      return LEVELS[i];
    }
  }
  return LEVELS[0];
}

export function getXPForNextLevel(currentXP: number): number {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  return nextLevel ? nextLevel.xpRequired - currentXP : 0;
}

export function getProgressToNextLevel(currentXP: number): number {
  const currentLevel = getLevelFromXP(currentXP);
  const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1);
  
  if (!nextLevel) return 100;
  
  const xpInCurrentLevel = currentXP - currentLevel.xpRequired;
  const xpNeededForNextLevel = nextLevel.xpRequired - currentLevel.xpRequired;
  
  return (xpInCurrentLevel / xpNeededForNextLevel) * 100;
}

// ─── TIER COLORS ────────────────────────────────────────────────────

export const TIER_COLORS = {
  bronze: {
    bg: "bg-amber-900/20",
    border: "border-amber-700/40",
    text: "text-amber-400",
    glow: "rgba(251, 146, 60, 0.3)",
  },
  silver: {
    bg: "bg-zinc-800/40",
    border: "border-zinc-600/40",
    text: "text-zinc-300",
    glow: "rgba(161, 161, 170, 0.3)",
  },
  gold: {
    bg: "bg-yellow-900/20",
    border: "border-yellow-600/40",
    text: "text-yellow-400",
    glow: "rgba(250, 204, 21, 0.3)",
  },
  platinum: {
    bg: "bg-cyan-900/20",
    border: "border-cyan-600/40",
    text: "text-cyan-400",
    glow: "rgba(34, 211, 238, 0.3)",
  },
  diamond: {
    bg: "bg-purple-900/20",
    border: "border-purple-600/40",
    text: "text-purple-400",
    glow: "rgba(168, 85, 247, 0.3)",
  },
};

// ─── CHALLENGES (weekly/monthly) ────────────────────────────────────

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: "weekly" | "monthly";
  icon: string;
  xp: number;
  requirement: {
    type: string;
    value: number;
    current?: number;
  };
  endsAt: Date;
  completed: boolean;
}

export const WEEKLY_CHALLENGES: Omit<Challenge, "endsAt" | "completed">[] = [
  {
    id: "week-volume",
    name: "Volumen Semanal",
    description: "Levantá 50,000kg esta semana",
    type: "weekly",
    icon: "📊",
    xp: 200,
    requirement: { type: "weekly_volume_kg", value: 50000 },
  },
  {
    id: "week-sessions",
    name: "Constancia",
    description: "Entrená 5 veces esta semana",
    type: "weekly",
    icon: "🔥",
    xp: 150,
    requirement: { type: "weekly_sessions", value: 5 },
  },
  {
    id: "week-prs",
    name: "Récords Personales",
    description: "Lográ 3 récords personales esta semana",
    type: "weekly",
    icon: "🏆",
    xp: 300,
    requirement: { type: "weekly_prs", value: 3 },
  },
];

export const MONTHLY_CHALLENGES: Omit<Challenge, "endsAt" | "completed">[] = [
  {
    id: "month-workouts",
    name: "Mes Activo",
    description: "Completá 20 entrenamientos este mes",
    type: "monthly",
    icon: "💪",
    xp: 500,
    requirement: { type: "monthly_workouts", value: 20 },
  },
  {
    id: "month-volume",
    name: "Volumen Mensual",
    description: "Levantá 200,000kg este mes",
    type: "monthly",
    icon: "⚡",
    xp: 800,
    requirement: { type: "monthly_volume_kg", value: 200000 },
  },
  {
    id: "month-checkins",
    name: "Comunicación Perfecta",
    description: "Enviá 4 check-ins este mes",
    type: "monthly",
    icon: "📝",
    xp: 300,
    requirement: { type: "monthly_checkins", value: 4 },
  },
];

// ─── LEADERBOARD ────────────────────────────────────────────────────

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  avatarUrl?: string;
  score: number;
  rank: number;
  change: number; // +1, -1, 0
}

export type LeaderboardType = "xp" | "volume" | "streak" | "workouts";

export const LEADERBOARD_TYPES = {
  xp: { name: "XP Total", icon: "⭐" },
  volume: { name: "Volumen (kg)", icon: "📊" },
  streak: { name: "Racha Actual", icon: "🔥" },
  workouts: { name: "Entrenamientos", icon: "💪" },
};
