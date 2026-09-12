"use client";

import { Achievement, TIER_COLORS, Level, getLevelFromXP, getProgressToNextLevel, getXPForNextLevel } from "@/lib/achievements";
import { motion } from "framer-motion";
import { ConfettiBurst, PopIn, HoverGlow, FlipCard } from "./ui/animations";
import { ProgressRing } from "./animated-stats";
import { useState } from "react";
import { Lock, Star, TrendingUp, Trophy } from "lucide-react";

// ────────────────────────────────────────────────────────────────
// ACHIEVEMENT CARD
// ────────────────────────────────────────────────────────────────

export function AchievementCard({ achievement }: { achievement: Achievement }) {
  const tierColors = TIER_COLORS[achievement.tier];
  const progress = achievement.requirement.current
    ? (achievement.requirement.current / achievement.requirement.value) * 100
    : 0;

  const front = (
    <div
      className={`relative p-4 rounded-2xl border ${tierColors.border} ${tierColors.bg} backdrop-blur-sm overflow-hidden group`}
    >
      {/* Glow effect on hover */}
      {achievement.unlocked && (
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, ${tierColors.glow}, transparent 70%)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Icon + Lock overlay */}
        <div className="relative w-16 h-16 mx-auto mb-3">
          <div
            className={`text-4xl flex items-center justify-center w-full h-full rounded-2xl ${
              achievement.unlocked ? "" : "grayscale opacity-40"
            }`}
          >
            {achievement.icon}
          </div>
          {!achievement.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl backdrop-blur-sm">
              <Lock size={20} className="text-zinc-400" />
            </div>
          )}
        </div>

        {/* Name + Tier */}
        <div className="text-center mb-2">
          <h3
            className={`font-bold text-sm ${
              achievement.unlocked ? tierColors.text : "text-zinc-500"
            }`}
          >
            {achievement.name}
          </h3>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mt-0.5">
            {achievement.tier}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 text-center mb-3 line-clamp-2">
          {achievement.description}
        </p>

        {/* Progress bar */}
        {!achievement.unlocked && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Progreso</span>
              <span>
                {achievement.requirement.current || 0}/{achievement.requirement.value}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${tierColors.bg}`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* XP badge */}
        <div className="flex items-center justify-center gap-1 mt-3">
          <Star size={12} className={tierColors.text} />
          <span className={`text-xs font-bold ${tierColors.text}`}>
            +{achievement.xp} XP
          </span>
        </div>

        {/* Unlocked date */}
        {achievement.unlocked && achievement.unlockedAt && (
          <p className="text-xs text-zinc-600 text-center mt-2">
            Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString("es-AR")}
          </p>
        )}
      </div>
    </div>
  );

  const back = (
    <div
      className={`relative p-4 rounded-2xl border ${tierColors.border} ${tierColors.bg} backdrop-blur-sm h-full flex flex-col justify-center`}
    >
      <div className="text-center space-y-2">
        <div className="text-4xl mb-2">{achievement.icon}</div>
        <h3 className={`font-bold ${tierColors.text}`}>{achievement.name}</h3>
        <p className="text-xs text-zinc-400">{achievement.description}</p>
        <div className="pt-3 border-t border-zinc-800 mt-3">
          <p className="text-xs text-zinc-500">Categoría</p>
          <p className="text-sm font-bold text-white capitalize">
            {achievement.category}
          </p>
        </div>
      </div>
    </div>
  );

  return <FlipCard front={front} back={back} className="h-full" />;
}

// ────────────────────────────────────────────────────────────────
// ACHIEVEMENTS GRID
// ────────────────────────────────────────────────────────────────

export function AchievementsGrid({
  achievements,
  filter = "all",
}: {
  achievements: Achievement[];
  filter?: "all" | "unlocked" | "locked";
}) {
  const filtered =
    filter === "all"
      ? achievements
      : filter === "unlocked"
      ? achievements.filter((a) => a.unlocked)
      : achievements.filter((a) => !a.unlocked);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {filtered.map((achievement, i) => (
        <PopIn key={achievement.id} delay={i * 0.05}>
          <AchievementCard achievement={achievement} />
        </PopIn>
      ))}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// LEVEL DISPLAY
// ────────────────────────────────────────────────────────────────

export function LevelDisplay({ xp }: { xp: number }) {
  const currentLevel = getLevelFromXP(xp);
  const progressPercent = getProgressToNextLevel(xp);
  const xpForNext = getXPForNextLevel(xp);

  return (
    <HoverGlow className="rounded-3xl border border-primary/20 bg-surface/60 p-6">
      <div className="flex items-center gap-6">
        {/* Level Ring */}
        <ProgressRing
          value={progressPercent}
          size={120}
          stroke={10}
          color="var(--primary)"
          trackColor="#27272a"
        >
          <div className="text-center">
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
              Nivel
            </p>
            <p className="text-4xl font-black text-white">{currentLevel.level}</p>
          </div>
        </ProgressRing>

        {/* Level Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-black text-white mb-1">
            {currentLevel.title}
          </h2>
          <p className="text-sm text-zinc-400 mb-3">
            {xp.toLocaleString()} XP Total
          </p>

          {/* Progress to next */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Próximo nivel</span>
              <span>{xpForNext.toLocaleString()} XP</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-primary/60"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-4 space-y-1">
            {currentLevel.benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                <div className="w-1 h-1 rounded-full bg-primary" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HoverGlow>
  );
}

// ────────────────────────────────────────────────────────────────
// ACHIEVEMENT UNLOCK NOTIFICATION
// ────────────────────────────────────────────────────────────────

export function AchievementUnlockNotification({
  achievement,
  onClose,
}: {
  achievement: Achievement;
  onClose: () => void;
}) {
  const tierColors = TIER_COLORS[achievement.tier];
  const [showConfetti, setShowConfetti] = useState(true);

  return (
    <>
      <ConfettiBurst trigger={showConfetti} />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          className={`relative max-w-md w-full rounded-3xl border-2 ${tierColors.border} ${tierColors.bg} p-8 text-center`}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-3xl opacity-50 blur-2xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ background: tierColors.glow }}
          />

          <div className="relative z-10 space-y-4">
            {/* Trophy icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
              className="inline-flex"
            >
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 flex items-center justify-center text-5xl">
                {achievement.icon}
              </div>
            </motion.div>

            {/* Achievement unlocked */}
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-sm font-bold text-primary uppercase tracking-wider mb-1"
              >
                🎉 Achievement Desbloqueado
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className={`text-3xl font-black ${tierColors.text}`}
              >
                {achievement.name}
              </motion.h2>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-zinc-400"
            >
              {achievement.description}
            </motion.p>

            {/* XP gained */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.7 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
            >
              <Star size={16} className="text-primary" />
              <span className="text-sm font-bold text-primary">
                +{achievement.xp} XP
              </span>
            </motion.div>

            {/* Close button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={onClose}
              className="mt-6 w-full h-12 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
            >
              ¡Genial!
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// MINI STATS (para dashboard)
// ────────────────────────────────────────────────────────────────

export function AchievementStats({
  totalAchievements,
  unlockedAchievements,
  xp,
  level,
}: {
  totalAchievements: number;
  unlockedAchievements: number;
  xp: number;
  level: number;
}) {
  const completionPercent = (unlockedAchievements / totalAchievements) * 100;

  return (
    <div className="grid grid-cols-3 gap-3">
      {/* Level */}
      <div className="p-4 rounded-2xl border border-primary/20 bg-surface/40 text-center">
        <Trophy size={20} className="text-primary mx-auto mb-2" />
        <p className="text-2xl font-black text-white">{level}</p>
        <p className="text-xs text-zinc-500">Nivel</p>
      </div>

      {/* XP */}
      <div className="p-4 rounded-2xl border border-zinc-800 bg-surface/40 text-center">
        <Star size={20} className="text-yellow-400 mx-auto mb-2" />
        <p className="text-2xl font-black text-white">{xp.toLocaleString()}</p>
        <p className="text-xs text-zinc-500">XP Total</p>
      </div>

      {/* Achievements */}
      <div className="p-4 rounded-2xl border border-zinc-800 bg-surface/40 text-center">
        <TrendingUp size={20} className="text-emerald-400 mx-auto mb-2" />
        <p className="text-2xl font-black text-white">
          {Math.round(completionPercent)}%
        </p>
        <p className="text-xs text-zinc-500">
          {unlockedAchievements}/{totalAchievements}
        </p>
      </div>
    </div>
  );
}
