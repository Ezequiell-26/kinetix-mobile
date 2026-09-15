"use client";

import React from "react";
import Image from "next/image";
import {
  CompetitiveRank,
  COMPETITIVE_RANKS,
  getRankByScore,
  getProgressToNextRank,
  getRankGradient,
  calculateActivityScore,
  type ActivityMetrics,
} from "@/lib/competitive-ranks";
import { Trophy, TrendingUp, Target, Users, Zap, Crown } from "lucide-react";
import { FadeInUp, HoverScale, PulseGlow } from "./ui/animations";

interface RankBadgeProps {
  rank: CompetitiveRank;
  size?: "sm" | "md" | "lg" | "xl";
  showName?: boolean;
  animated?: boolean;
}

export function RankBadge({
  rank,
  size = "md",
  showName = true,
  animated = true,
}: RankBadgeProps) {
  const sizeClasses = {
    sm: "w-12 h-12 text-lg",
    md: "w-16 h-16 text-2xl",
    lg: "w-24 h-24 text-4xl",
    xl: "w-32 h-32 text-5xl",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {/* Badge */}
      <div
        className={`${sizeClasses[size]} rounded-2xl flex items-center justify-center font-black relative overflow-hidden ${
          animated ? "animate-pulse" : ""
        }`}
        style={{
          background: getRankGradient(rank),
          boxShadow: `0 0 30px ${rank.color}40`,
        }}
      >
        {/* Glow effect */}
        {animated && (
          <div
            className="absolute inset-0 animate-ping opacity-20"
            style={{ background: rank.color }}
          />
        )}

        {/* Icon/Emoji */}
        <span className="relative z-10">{rank.emoji}</span>

        {/* Division number (top right) */}
        <span
          className={`absolute top-1 right-1 ${
            size === "sm" ? "text-[8px]" : "text-xs"
          } font-bold text-white bg-black/50 px-1 rounded`}
        >
          {rank.division}
        </span>
      </div>

      {/* Name */}
      {showName && (
        <div className="text-center">
          <p
            className={`${textSizeClasses[size]} font-black uppercase tracking-wider`}
            style={{ color: rank.color }}
          >
            {rank.nameES}
          </p>
          <p className="text-xs text-zinc-500">{rank.percentile}</p>
        </div>
      )}
    </div>
  );
}

interface RankProgressProps {
  currentScore: number;
  showDetails?: boolean;
}

export function RankProgress({ currentScore, showDetails = true }: RankProgressProps) {
  const { current, next, progress, pointsNeeded } = getProgressToNextRank(currentScore);

  return (
    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
      {/* Current Rank */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <RankBadge rank={current} size="md" showName={false} />
          <div>
            <p className="text-lg font-black text-white">{current.nameES}</p>
            <p className="text-sm text-zinc-400">{current.percentile}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-black" style={{ color: current.color }}>
            {currentScore}
          </p>
          <p className="text-xs text-zinc-500">Activity Score</p>
        </div>
      </div>

      {/* Progress Bar */}
      {next && (
        <>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-zinc-400">
                Progreso a <span className="font-bold text-white">{next.nameES}</span>
              </p>
              <p className="text-sm font-bold text-white">{progress}%</p>
            </div>

            {/* Bar */}
            <div className="h-3 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  background: getRankGradient(next),
                }}
              />
            </div>

            <p className="text-xs text-zinc-500 mt-2">
              {pointsNeeded} puntos para el siguiente rango
            </p>
          </div>

          {/* Next Rank Preview */}
          {showDetails && (
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{next.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-white">
                    {next.nameES} - {next.percentile}
                  </p>
                  <p className="text-xs text-zinc-400">{next.motivationES}</p>
                </div>
              </div>

              {/* Benefits preview */}
              <div className="flex flex-wrap gap-2 mt-3">
                {next.benefits.slice(0, 3).map((benefit, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 rounded-lg bg-zinc-700 text-xs text-zinc-300"
                  >
                    {benefit}
                  </span>
                ))}
                {next.benefits.length > 3 && (
                  <span className="px-2 py-1 rounded-lg bg-zinc-700 text-xs text-zinc-400">
                    +{next.benefits.length - 3} más
                  </span>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Max rank reached */}
      {!next && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-center">
          <Crown size={32} className="text-purple-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-white mb-1">
            ¡Rango Máximo Alcanzado!
          </p>
          <p className="text-xs text-zinc-400">
            Estás en el {current.percentile} mundial
          </p>
        </div>
      )}
    </div>
  );
}

interface RankLeaderboardProps {
  topUsers: Array<{
    id: string;
    name: string;
    score: number;
    avatar?: string;
  }>;
  currentUserId?: string;
}

export function RankLeaderboard({ topUsers, currentUserId }: RankLeaderboardProps) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={24} className="text-primary" />
        <h3 className="text-lg font-black text-white">Global Leaderboard</h3>
      </div>

      <div className="space-y-3">
        {topUsers.map((user, index) => {
          const rank = getRankByScore(user.score);
          const isCurrentUser = user.id === currentUserId;

          return (
            <HoverScale key={user.id}>
              <div
                className={`p-4 rounded-xl ${
                  isCurrentUser
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-zinc-800 border border-zinc-700"
                } transition-colors`}
              >
                <div className="flex items-center gap-4">
                  {/* Position */}
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                      index === 0
                        ? "bg-yellow-500 text-black"
                        : index === 1
                        ? "bg-zinc-400 text-black"
                        : index === 2
                        ? "bg-orange-600 text-white"
                        : "bg-zinc-700 text-zinc-300"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Avatar or Rank Badge */}
                  <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-lg"
                        style={{ background: getRankGradient(rank) }}
                      >
                        {rank.emoji}
                      </div>
                    )}
                  </div>

                  {/* User info */}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs" style={{ color: rank.color }}>
                      {rank.nameES}
                    </p>
                  </div>

                  {/* Score */}
                  <div className="text-right">
                    <p className="text-sm font-bold text-white">{user.score}</p>
                    <p className="text-xs text-zinc-500">pts</p>
                  </div>
                </div>
              </div>
            </HoverScale>
          );
        })}
      </div>
    </div>
  );
}

interface AllRanksShowcaseProps {
  currentScore?: number;
}

export function AllRanksShowcase({ currentScore }: AllRanksShowcaseProps) {
  const currentRank = currentScore ? getRankByScore(currentScore) : null;

  return (
    <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800">
      <div className="flex items-center gap-2 mb-6">
        <Target size={24} className="text-primary" />
        <h3 className="text-lg font-black text-white">Todos los Rangos</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {COMPETITIVE_RANKS.map((rank, index) => {
          const isCurrentRank = currentRank?.id === rank.id;
          const isLocked = currentScore
            ? currentScore < rank.minScore
            : index > 0;

          return (
            <FadeInUp key={rank.id} delay={index * 0.05}>
              <div
                className={`p-4 rounded-xl border-2 transition-all ${
                  isCurrentRank
                    ? "border-primary bg-primary/5"
                    : isLocked
                    ? "border-zinc-800 bg-zinc-900/50 opacity-50"
                    : "border-zinc-700 bg-zinc-800/50 hover:border-zinc-600"
                }`}
              >
                {/* Rank Badge */}
                <div className="flex justify-center mb-3">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl relative"
                    style={{
                      background: isLocked ? "#27272A" : getRankGradient(rank),
                    }}
                  >
                    {isLocked ? "🔒" : rank.emoji}
                    <span className="absolute top-1 right-1 text-[8px] font-bold text-white bg-black/50 px-1 rounded">
                      {rank.division}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <p
                    className="text-sm font-black uppercase mb-1"
                    style={{ color: isLocked ? "#52525B" : rank.color }}
                  >
                    {rank.nameES}
                  </p>
                  <p className="text-xs text-zinc-500 mb-2">{rank.percentile}</p>
                  <p className="text-xs text-zinc-600">
                    {isLocked ? `${rank.minScore} pts` : `${rank.minScore}+ pts`}
                  </p>
                </div>

                {/* Current rank indicator */}
                {isCurrentRank && (
                  <div className="mt-3 px-2 py-1 rounded-lg bg-primary text-black text-center">
                    <p className="text-xs font-bold">Tu Rango</p>
                  </div>
                )}
              </div>
            </FadeInUp>
          );
        })}
      </div>
    </div>
  );
}

interface RankStatsProps {
  metrics: ActivityMetrics;
}

export function RankStats({ metrics }: RankStatsProps) {
  const score = calculateActivityScore(metrics);
  const rank = getRankByScore(score);

  const stats = [
    { icon: TrendingUp, label: "Workouts", value: metrics.workoutsCompleted },
    { icon: Zap, label: "Racha Actual", value: `${metrics.currentStreak} días` },
    { icon: Target, label: "PRs", value: metrics.prCount },
    { icon: Users, label: "Rank", value: rank.percentile },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <FadeInUp key={stat.label} delay={index * 0.1}>
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800">
            <stat.icon size={20} className="text-zinc-400 mb-2" />
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-zinc-500">{stat.label}</p>
          </div>
        </FadeInUp>
      ))}
    </div>
  );
}
