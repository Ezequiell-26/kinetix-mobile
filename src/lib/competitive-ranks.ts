/**
 * KinetixFitt - Competitive Ranking System
 * Sistema de rangos competitivos con distribución percentil
 * Inspira motivación mostrando exclusividad (top 1%, 5%, etc)
 */

export type RankTier =
  | "initiate"
  | "driven"
  | "forged"
  | "ascend"
  | "elite"
  | "apex"
  | "prime"
  | "titan"
  | "legend"
  | "master"
  | "grandmaster"
  | "elite-plus";

export interface CompetitiveRank {
  id: RankTier;
  name: string;
  nameES: string;
  division: number; // 1-12
  minScore: number;
  color: string;
  gradientFrom: string;
  gradientTo: string;
  percentile: string; // "Top 50%", "Top 25%", etc.
  population: number; // % de usuarios en este rango
  icon: string;
  emoji: string;
  benefits: string[];
  description: string;
  descriptionES: string;
  motivation: string;
  motivationES: string;
}

/**
 * Activity Score Calculation
 * Basado en múltiples factores de actividad
 */
export interface ActivityMetrics {
  workoutsCompleted: number; // Total workouts completed
  currentStreak: number; // Días consecutivos
  longestStreak: number; // Mejor racha
  totalVolume: number; // Peso total levantado (kg)
  consistency: number; // % de días con workout (últimos 30 días)
  prCount: number; // Personal records
  achievementsUnlocked: number; // Achievements totales
  challengesCompleted: number; // Challenges completados
  totalXP: number; // XP del sistema de gamificación
  daysActive: number; // Días totales en la app
  avgWorkoutsPerWeek: number; // Promedio últimas 4 semanas
}

/**
 * Calcular Activity Score (0-10000)
 */
export function calculateActivityScore(metrics: ActivityMetrics): number {
  // Weighted formula
  const workoutScore = Math.min(metrics.workoutsCompleted * 10, 2000);
  const streakScore = Math.min(metrics.currentStreak * 15, 1000);
  const longestStreakScore = Math.min(metrics.longestStreak * 10, 500);
  const volumeScore = Math.min(metrics.totalVolume / 100, 1500);
  const consistencyScore = metrics.consistency * 15; // 0-1500
  const prScore = Math.min(metrics.prCount * 20, 1000);
  const achievementScore = Math.min(metrics.achievementsUnlocked * 25, 1000);
  const challengeScore = Math.min(metrics.challengesCompleted * 30, 800);
  const xpScore = Math.min(metrics.totalXP / 10, 500);
  const weeklyScore = Math.min(metrics.avgWorkoutsPerWeek * 50, 400);

  const totalScore =
    workoutScore +
    streakScore +
    longestStreakScore +
    volumeScore +
    consistencyScore +
    prScore +
    achievementScore +
    challengeScore +
    xpScore +
    weeklyScore;

  return Math.round(Math.min(totalScore, 10000));
}

/**
 * Sistema de 12 Rangos Competitivos
 * Distribución realista inspirada en ranked systems (LoL, Valorant)
 */
export const COMPETITIVE_RANKS: CompetitiveRank[] = [
  // Rank 1: INITIATE (Bottom 25%)
  {
    id: "initiate",
    name: "Initiate",
    nameES: "Iniciado",
    division: 1,
    minScore: 0,
    color: "#71717A", // zinc-500
    gradientFrom: "#52525B",
    gradientTo: "#71717A",
    percentile: "Bottom 25%",
    population: 25,
    icon: "🔰",
    emoji: "🔰",
    benefits: ["Acceso básico a la plataforma", "Tracking de entrenamientos"],
    description: "Welcome to KinetixFitt. Your journey begins here.",
    descriptionES: "Bienvenido a KinetixFitt. Tu viaje comienza aquí.",
    motivation: "Complete 5 workouts to rank up!",
    motivationES: "¡Completa 5 entrenamientos para subir de rango!",
  },

  // Rank 2: DRIVEN (Bottom 40% - Top 60%)
  {
    id: "driven",
    name: "Driven",
    nameES: "Motivado",
    division: 2,
    minScore: 500,
    color: "#10B981", // emerald-500
    gradientFrom: "#059669",
    gradientTo: "#10B981",
    percentile: "Top 75%",
    population: 15,
    icon: "💪",
    emoji: "💪",
    benefits: ["Badge en perfil", "Acceso a desafíos semanales", "+5% XP boost"],
    description: "You're building momentum. Keep pushing!",
    descriptionES: "Estás ganando impulso. ¡Sigue adelante!",
    motivation: "10 workout streak to reach Forged!",
    motivationES: "¡Racha de 10 días para alcanzar Forjado!",
  },

  // Rank 3: FORGED (Top 60%)
  {
    id: "forged",
    name: "Forged",
    nameES: "Forjado",
    division: 3,
    minScore: 1000,
    color: "#0EA5E9", // sky-500
    gradientFrom: "#0284C7",
    gradientTo: "#0EA5E9",
    percentile: "Top 60%",
    population: 12,
    icon: "🔨",
    emoji: "🔨",
    benefits: [
      "Badge exclusivo",
      "Acceso a programas avanzados",
      "+10% XP boost",
      "Estadísticas detalladas",
    ],
    description: "You're no longer a beginner. Strength is your foundation.",
    descriptionES: "Ya no eres principiante. La fuerza es tu fundamento.",
    motivation: "Hit 3 PRs to ascend!",
    motivationES: "¡Logra 3 PRs para ascender!",
  },

  // Rank 4: ASCEND (Top 48%)
  {
    id: "ascend",
    name: "Ascend",
    nameES: "Ascendente",
    division: 4,
    minScore: 1750,
    color: "#06B6D4", // cyan-500
    gradientFrom: "#0891B2",
    gradientTo: "#06B6D4",
    percentile: "Top 48%",
    population: 10,
    icon: "⬆️",
    emoji: "⬆️",
    benefits: [
      "Badge premium",
      "Acceso a challenges mensuales",
      "+15% XP boost",
      "Prioridad en leaderboards",
    ],
    description: "Rising above the average. Excellence is within reach.",
    descriptionES: "Superando el promedio. La excelencia está al alcance.",
    motivation: "50 workouts to reach Elite!",
    motivationES: "¡50 entrenamientos para alcanzar Elite!",
  },

  // Rank 5: ELITE (Top 35%)
  {
    id: "elite",
    name: "Elite",
    nameES: "Elite",
    division: 5,
    minScore: 2500,
    color: "#3B82F6", // blue-500
    gradientFrom: "#2563EB",
    gradientTo: "#60A5FA",
    percentile: "Top 35%",
    population: 10,
    icon: "⭐",
    emoji: "⭐",
    benefits: [
      "Badge Elite",
      "Workout templates exclusivos",
      "+20% XP boost",
      "Apareces en leaderboard global",
      "Badge animado",
    ],
    description: "You're among the dedicated few. Keep dominating.",
    descriptionES: "Estás entre los más dedicados. Sigue dominando.",
    motivation: "Unlock 10 achievements for Apex!",
    motivationES: "¡Desbloquea 10 achievements para Apex!",
  },

  // Rank 6: APEX (Top 25%)
  {
    id: "apex",
    name: "Apex",
    nameES: "Apex",
    division: 6,
    minScore: 3500,
    color: "#10B981", // emerald-500
    gradientFrom: "#059669",
    gradientTo: "#34D399",
    percentile: "Top 25%",
    population: 8,
    icon: "🔺",
    emoji: "🔺",
    benefits: [
      "Badge Apex brillante",
      "Acceso a entrenadores premium",
      "+25% XP boost",
      "Perfil destacado",
      "Invitación a eventos exclusivos",
    ],
    description: "Peak performance. You're in the top quarter.",
    descriptionES: "Rendimiento máximo. Estás en el cuarto superior.",
    motivation: "30 day streak for Prime!",
    motivationES: "¡Racha de 30 días para Prime!",
  },

  // Rank 7: PRIME (Top 15%)
  {
    id: "prime",
    name: "Prime",
    nameES: "Prime",
    division: 7,
    minScore: 4500,
    color: "#F59E0B", // amber-500
    gradientFrom: "#D97706",
    gradientTo: "#FBBF24",
    percentile: "Top 15%",
    population: 7,
    icon: "👑",
    emoji: "👑",
    benefits: [
      "Badge Prime dorado",
      "Mentor status disponible",
      "+30% XP boost",
      "Apareces en Hall of Fame",
      "Acceso beta a nuevas features",
      "Badge con efecto de partículas",
    ],
    description: "You're in your prime. Elite territory.",
    descriptionES: "Estás en tu mejor momento. Territorio elite.",
    motivation: "100 total workouts for Titan!",
    motivationES: "¡100 entrenamientos totales para Titan!",
  },

  // Rank 8: TITAN (Top 10%)
  {
    id: "titan",
    name: "Titan",
    nameES: "Titán",
    division: 8,
    minScore: 5500,
    color: "#8B5CF6", // violet-500
    gradientFrom: "#7C3AED",
    gradientTo: "#A78BFA",
    percentile: "Top 10%",
    population: 5,
    icon: "⚡",
    emoji: "⚡",
    benefits: [
      "Badge Titan animado",
      "Perfil verificado",
      "+40% XP boost",
      "Featured en homepage",
      "Invitación a competencias",
      "Badge con aura púrpura",
      "Acceso a comunidad privada",
    ],
    description: "Unstoppable force. Top 10% worldwide.",
    descriptionES: "Fuerza imparable. Top 10% mundial.",
    motivation: "50k total volume for Legend!",
    motivationES: "¡50k volumen total para Legend!",
  },

  // Rank 9: LEGEND (Top 5%)
  {
    id: "legend",
    name: "Legend",
    nameES: "Leyenda",
    division: 9,
    minScore: 6500,
    color: "#EF4444", // red-500
    gradientFrom: "#DC2626",
    gradientTo: "#F87171",
    percentile: "Top 5%",
    population: 3,
    icon: "🔥",
    emoji: "🔥",
    benefits: [
      "Badge Legend con llamas",
      "Legendary status",
      "+50% XP boost",
      "Perfil premium destacado",
      "Invitación a eventos internacionales",
      "Badge con efecto de fuego",
      "Coaching prioritario",
      "Apareces en marketing",
    ],
    description: "Legendary status achieved. Only 5% reach here.",
    descriptionES: "Estatus legendario alcanzado. Solo el 5% llega aquí.",
    motivation: "15 PRs for Master!",
    motivationES: "¡15 PRs para Master!",
  },

  // Rank 10: MASTER (Top 3%)
  {
    id: "master",
    name: "Master",
    nameES: "Maestro",
    division: 10,
    minScore: 7500,
    color: "#0EA5E9", // sky-500
    gradientFrom: "#0284C7",
    gradientTo: "#38BDF8",
    percentile: "Top 3%",
    population: 2,
    icon: "💎",
    emoji: "💎",
    benefits: [
      "Badge Master diamante",
      "Master tier verificado",
      "+60% XP boost",
      "Coaching gratuito mensual",
      "Invitación a pro league",
      "Badge con cristales animados",
      "Perfil en Hall of Fame permanente",
      "Merch exclusivo",
      "Entrevistas/contenido",
    ],
    description: "Master of your craft. Elite of the elite. Top 3%.",
    descriptionES: "Maestro de tu oficio. Elite de la elite. Top 3%.",
    motivation: "60 day streak for Grandmaster!",
    motivationES: "¡Racha de 60 días para Grandmaster!",
  },

  // Rank 11: GRANDMASTER (Top 1%)
  {
    id: "grandmaster",
    name: "Grandmaster",
    nameES: "Gran Maestro",
    division: 11,
    minScore: 8500,
    color: "#3B82F6", // blue-500
    gradientFrom: "#1D4ED8",
    gradientTo: "#60A5FA",
    percentile: "Top 1%",
    population: 0.8,
    icon: "🌟",
    emoji: "🌟",
    benefits: [
      "Badge Grandmaster holográfico",
      "Grandmaster status",
      "+75% XP boost",
      "Coaching premium ilimitado",
      "Invitación a world championship",
      "Badge con efecto holográfico",
      "Perfil featured permanentemente",
      "Sponsorship opportunities",
      "Apareces en ads/promos",
      "Acceso VIP total",
    ],
    description: "Grandmaster. Top 1% worldwide. You're an inspiration.",
    descriptionES: "Gran Maestro. Top 1% mundial. Eres una inspiración.",
    motivation: "Perfection unlocked. Reach Elite+!",
    motivationES: "¡Perfección desbloqueada. Alcanza Elite+!",
  },

  // Rank 12: ELITE+ (Top 0.1% - Los mejores de los mejores)
  {
    id: "elite-plus",
    name: "Elite+",
    nameES: "Elite+",
    division: 12,
    minScore: 9500,
    color: "#A855F7", // purple-500
    gradientFrom: "#9333EA",
    gradientTo: "#C084FC",
    percentile: "Top 0.1%",
    population: 0.2,
    icon: "👑",
    emoji: "👑",
    benefits: [
      "Badge Elite+ único",
      "Hall of Fame inductee",
      "+100% XP boost",
      "Coaching VIP ilimitado",
      "Pro athlete status",
      "Badge con corona animada dorada/púrpura",
      "Perfil legendary",
      "Partnership oficial KinetixFitt",
      "Ambassador program",
      "Revenue share",
      "Immortalized en app",
      "Merch signature line",
    ],
    description:
      "Elite+. Top 0.1%. You're among the absolute best in the world.",
    descriptionES:
      "Elite+. Top 0.1%. Estás entre los mejores absolutos del mundo.",
    motivation: "You've reached the pinnacle. Maintain greatness.",
    motivationES: "Alcanzaste la cima. Mantén la grandeza.",
  },
];

/**
 * Get rank by activity score
 */
export function getRankByScore(score: number): CompetitiveRank {
  // Find highest rank that user qualifies for
  const qualifiedRanks = COMPETITIVE_RANKS.filter((r) => score >= r.minScore);
  return qualifiedRanks[qualifiedRanks.length - 1] || COMPETITIVE_RANKS[0];
}

/**
 * Get next rank
 */
export function getNextRank(currentRank: CompetitiveRank): CompetitiveRank | null {
  const currentIndex = COMPETITIVE_RANKS.findIndex((r) => r.id === currentRank.id);
  if (currentIndex === -1 || currentIndex === COMPETITIVE_RANKS.length - 1) {
    return null; // Already at max rank
  }
  return COMPETITIVE_RANKS[currentIndex + 1];
}

/**
 * Calculate progress to next rank (0-100)
 */
export function getProgressToNextRank(score: number): {
  current: CompetitiveRank;
  next: CompetitiveRank | null;
  progress: number;
  pointsNeeded: number;
} {
  const current = getRankByScore(score);
  const next = getNextRank(current);

  if (!next) {
    return {
      current,
      next: null,
      progress: 100,
      pointsNeeded: 0,
    };
  }

  const pointsIntoCurrentRank = score - current.minScore;
  const pointsNeededForNextRank = next.minScore - current.minScore;
  const progress = Math.min(
    (pointsIntoCurrentRank / pointsNeededForNextRank) * 100,
    100
  );
  const pointsNeeded = next.minScore - score;

  return {
    current,
    next,
    progress: Math.round(progress),
    pointsNeeded: Math.max(pointsNeeded, 0),
  };
}

/**
 * Get rank color for UI
 */
export function getRankGradient(rank: CompetitiveRank): string {
  return `linear-gradient(135deg, ${rank.gradientFrom} 0%, ${rank.gradientTo} 100%)`;
}

/**
 * Check if user can get promoted
 */
export function canPromote(score: number, currentRankId: RankTier): boolean {
  const currentRank = COMPETITIVE_RANKS.find((r) => r.id === currentRankId);
  if (!currentRank) return false;

  const nextRank = getNextRank(currentRank);
  if (!nextRank) return false;

  return score >= nextRank.minScore;
}

/**
 * Get all users percentile
 */
export function getPercentilePosition(
  userScore: number,
  allScores: number[]
): number {
  const sortedScores = [...allScores].sort((a, b) => b - a);
  const position = sortedScores.findIndex((s) => userScore >= s);
  if (position === -1) return 100; // Lowest
  return Math.round((position / sortedScores.length) * 100);
}

/**
 * Season reset (opcional - para competitive seasons)
 */
export interface Season {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  rewards: {
    rank: RankTier;
    reward: string;
  }[];
}

export function getCurrentSeason(): Season {
  // Ejemplo: Season 1 - 2026
  return {
    id: "s1-2026",
    name: "Season 1: Genesis",
    startDate: new Date("2026-01-01"),
    endDate: new Date("2026-12-31"),
    rewards: [
      { rank: "grandmaster", reward: "Gold Badge + $500 prize" },
      { rank: "master", reward: "Silver Badge + $250 prize" },
      { rank: "legend", reward: "Bronze Badge + $100 prize" },
    ],
  };
}
