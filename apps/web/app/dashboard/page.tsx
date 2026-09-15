'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Dumbbell, Flame, Heart, TrendingUp, Award, Zap, Clock } from 'lucide-react';

interface DashboardStats {
  workoutsCompleted: number;
  caloriesBurned: number;
  streakDays: number;
  level: number;
  xp: number;
  xpToNextLevel: number;
  weeklyProgress: number[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    workoutsCompleted: 0,
    caloriesBurned: 0,
    streakDays: 0,
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carga de datos - en producción esto vendría de la API
    const timer = setTimeout(() => {
      setStats({
        workoutsCompleted: 24,
        caloriesBurned: 8450,
        streakDays: 7,
        level: 12,
        xp: 750,
        xpToNextLevel: 1000,
        weeklyProgress: [65, 80, 45, 90, 70, 85, 60]
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Entrenamientos',
      value: stats.workoutsCompleted,
      icon: Dumbbell,
      color: 'from-emerald-500 to-teal-500',
      suffix: ''
    },
    {
      title: 'Calorías Quemadas',
      value: Math.round(stats.caloriesBurned),
      icon: Flame,
      color: 'from-orange-500 to-red-500',
      suffix: ' kcal'
    },
    {
      title: 'Racha Actual',
      value: stats.streakDays,
      icon: Zap,
      color: 'from-yellow-500 to-amber-500',
      suffix: ' días'
    },
    {
      title: 'Nivel',
      value: stats.level,
      icon: Award,
      color: 'from-purple-500 to-indigo-500',
      suffix: ''
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            Hola, Atleta 👋
          </h1>
          <p className="text-slate-400 text-lg">
            Aquí está tu progreso de hoy
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 hover:border-emerald-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                  <card.icon className="text-white w-6 h-6" />
                </div>
                <TrendingUp className="text-emerald-500 w-5 h-5" />
              </div>
              <p className="text-slate-400 text-sm mb-1">{card.title}</p>
              <p className="text-3xl font-bold text-white">
                {card.value}<span className="text-lg text-slate-500 ml-1">{card.suffix}</span>
              </p>
            </motion.div>
          ))}
        </div>

        {/* XP Progress & Weekly Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* XP Progress */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Progreso de Nivel</h3>
              <Award className="text-purple-500 w-6 h-6" />
            </div>
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-slate-400">Nivel {stats.level}</span>
              <span className="text-slate-400">{stats.xp} / {stats.xpToNextLevel} XP</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-4 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stats.xp / stats.xpToNextLevel) * 100}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {stats.xpToNextLevel - stats.xp} XP para el nivel {stats.level + 1}
            </p>
          </motion.div>

          {/* Weekly Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Actividad Semanal</h3>
              <Activity className="text-emerald-500 w-6 h-6" />
            </div>
            <div className="flex items-end justify-between h-32 gap-2">
              {stats.weeklyProgress.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ height: 0 }}
                  animate={{ height: `${value}%` }}
                  transition={{ duration: 0.5, delay: 0.6 + (index * 0.1) }}
                  className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-500 rounded-t-lg relative group"
                >
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {value}%
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-500">
              {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition-all group">
              <Dumbbell className="text-emerald-500 w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium">Iniciar Entrenamiento</span>
            </button>
            <button className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-xl hover:bg-orange-500/20 transition-all group">
              <Heart className="text-orange-500 w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium">Registrar Comida</span>
            </button>
            <button className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition-all group">
              <Clock className="text-purple-500 w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-white font-medium">Sesión de Recuperación</span>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
