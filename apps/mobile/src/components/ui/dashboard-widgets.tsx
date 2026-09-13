import React, { useState, useEffect } from 'react';

interface DashboardStatsProps {
  stats: {
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
  }[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

/**
 * Componente DashboardStats para mostrar estadísticas en grid
 * Con animaciones de entrada y indicadores de tendencia
 */
export function DashboardStats({
  stats,
  columns = 2,
  className = '',
}: DashboardStatsProps) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${columnClasses[columns]} gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard key={index} stat={stat} delay={index * 100} />
      ))}
    </div>
  );
}

interface StatCardProps {
  stat: {
    label: string;
    value: string | number;
    change?: number;
    trend?: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
  };
  delay?: number;
}

function StatCard({ stat, delay = 0 }: StatCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const trendColors = {
    up: 'text-brand-success bg-brand-success/10',
    down: 'text-destructive bg-destructive/10',
    neutral: 'text-muted-foreground bg-muted',
  };

  const trendIcons = {
    up: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    ),
    down: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    ),
    neutral: (
      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    ),
  };

  return (
    <div
      className={`glass rounded-xl p-6 transition-all duration-500 transform ${
        isVisible ? 'animate-slide-up opacity-100' : 'opacity-0 translate-y-4'
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        {stat.icon && (
          <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
            {stat.icon}
          </div>
        )}
        {stat.change !== undefined && stat.trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${trendColors[stat.trend]}`}>
            {trendIcons[stat.trend]}
            <span>{Math.abs(stat.change)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">{stat.label}</p>
        <p className="text-3xl font-bold text-foreground">{stat.value}</p>
      </div>
    </div>
  );
}

interface ActivityFeedProps {
  activities: {
    id: string;
    type: 'workout' | 'nutrition' | 'message' | 'achievement';
    title: string;
    description: string;
    timestamp: Date;
    icon?: React.ReactNode;
  }[];
  limit?: number;
  className?: string;
}

/**
 * Componente ActivityFeed para mostrar actividad reciente
 * Con iconos por tipo y formato de tiempo relativo
 */
export function ActivityFeed({
  activities,
  limit = 5,
  className = '',
}: ActivityFeedProps) {
  const typeColors = {
    workout: 'bg-brand-primary/10 text-brand-primary',
    nutrition: 'bg-brand-success/10 text-brand-success',
    message: 'bg-brand-info/10 text-brand-info',
    achievement: 'bg-brand-warning/10 text-brand-warning',
  };

  const typeIcons = {
    workout: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    nutrition: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    message: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    achievement: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Ahora mismo';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)}h`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)}d`;
    return date.toLocaleDateString();
  };

  const limitedActivities = activities.slice(0, limit);

  return (
    <div className={`space-y-3 ${className}`}>
      {limitedActivities.map((activity, index) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={`p-2 rounded-lg ${typeColors[activity.type]}`}>
            {activity.icon || typeIcons[activity.type]}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{activity.title}</p>
            <p className="text-sm text-muted-foreground truncate">{activity.description}</p>
          </div>
          
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTimeAgo(activity.timestamp)}
          </span>
        </div>
      ))}
    </div>
  );
}

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  color?: string;
  showValue?: boolean;
  className?: string;
}

/**
 * Componente ProgressRing para mostrar progreso circular
 * Con animación suave y etiquetas personalizables
 */
export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
  color = 'var(--brand-primary)',
  showValue = true,
  className = '',
}: ProgressRingProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(progress);
    }, 100);
    return () => clearTimeout(timer);
  }, [progress]);

  return (
    <div className={`relative inline-flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Círculo de fondo */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--muted)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Círculo de progreso */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(124, 58, 237, 0.5))',
          }}
        />
      </svg>
      
      {showValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-foreground">
            {Math.round(animatedProgress)}%
          </span>
          {label && (
            <span className="text-xs text-muted-foreground mt-1">{label}</span>
          )}
        </div>
      )}
      
      {sublabel && !showValue && (
        <div className="mt-2 text-center">
          <span className="text-sm text-muted-foreground">{sublabel}</span>
        </div>
      )}
    </div>
  );
}

// Exportar todos los componentes
export default {
  DashboardStats,
  ActivityFeed,
  ProgressRing,
};
