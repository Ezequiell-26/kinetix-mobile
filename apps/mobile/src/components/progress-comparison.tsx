/**
 * KINETIXFITT - Progress Comparison Components
 * Componentes de UI para visualizar análisis de progreso y comparaciones
 */

'use client';

import { useState } from 'react';
import {
  ProgressReport,
  TimePeriod,
  TrendDirection,
  InsightType,
  AIInsight,
  PeriodComparison,
  TrendAnalysis,
} from '@/lib/progress-analyzer';
import { FadeIn, FadeInUp, ScaleIn } from './ui/animations';
import { StaggerContainer as StaggeredList } from './ui/animations';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Zap,
  Target,
  Award,
  AlertTriangle,
  Lightbulb,
  Trophy,
  Eye,
  Calendar,
  BarChart3,
  LineChart,
  PieChart,
  ArrowUpCircle,
  ArrowDownCircle,
  CheckCircle2,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface ProgressReportProps {
  report: ProgressReport;
  onPeriodChange?: (period: TimePeriod) => void;
}

interface MetricCardProps {
  label: string;
  value: string | number;
  change?: number;
  trend?: TrendDirection;
  icon?: React.ReactNode;
  color?: string;
}

interface InsightCardProps {
  insight: AIInsight;
}

interface ComparisonChartProps {
  comparison: PeriodComparison;
}

interface TrendChartProps {
  trend: TrendAnalysis;
}

interface ScoreGaugeProps {
  score: number;
  maxScore?: number;
  label: string;
  color?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ProgressReportView({ report, onPeriodChange }: ProgressReportProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>(report.period);
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'comparisons' | 'insights'>('overview');
  
  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };
  
  return (
    <div className="w-full space-y-6">
      {/* Header con selector de período */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Progress Analysis</h1>
            <p className="text-muted-foreground mt-1">
              AI-powered insights into your training journey
            </p>
          </div>
          <PeriodSelector selected={selectedPeriod} onChange={handlePeriodChange} />
        </div>
      </FadeIn>
      
      {/* Overall Score */}
      <FadeInUp delay={0.1}>
        <OverallScoreCard report={report} />
      </FadeInUp>
      
      {/* Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {(['overview', 'trends', 'comparisons', 'insights'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                pb-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors
                ${activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Content basado en tab activo */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && <OverviewTab report={report} />}
        {activeTab === 'trends' && <TrendsTab trends={report.trends} />}
        {activeTab === 'comparisons' && <ComparisonsTab comparisons={report.comparisons} />}
        {activeTab === 'insights' && <InsightsTab insights={report.insights} recommendations={report.recommendations} />}
      </div>
    </div>
  );
}

// ============================================================================
// PERIOD SELECTOR
// ============================================================================

function PeriodSelector({
  selected,
  onChange,
}: {
  selected: TimePeriod;
  onChange: (period: TimePeriod) => void;
}) {
  const periods: { value: TimePeriod; label: string }[] = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '14d', label: 'Last 14 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '6m', label: 'Last 6 Months' },
    { value: '1y', label: 'Last Year' },
    { value: 'all', label: 'All Time' },
  ];
  
  return (
    <select
      value={selected}
      onChange={(e) => onChange(e.target.value as TimePeriod)}
      className="px-4 py-2 rounded-lg border bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary"
    >
      {periods.map((period) => (
        <option key={period.value} value={period.value}>
          {period.label}
        </option>
      ))}
    </select>
  );
}

// ============================================================================
// OVERALL SCORE CARD
// ============================================================================

function OverallScoreCard({ report }: { report: ProgressReport }) {
  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl p-6 border">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Score principal */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center text-center">
          <div className="relative">
            <svg className="w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-muted-foreground/20"
              />
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-primary transition-all duration-1000"
                strokeDasharray={`${(report.overallScore / 100) * 553} 553`}
                transform="rotate(-90 96 96)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold">{report.overallScore}</span>
              <span className="text-sm text-muted-foreground">Overall Score</span>
            </div>
          </div>
          <div className="mt-4">
            <span className={`
              px-4 py-1.5 rounded-full text-sm font-medium
              ${report.overallScore >= 85 ? 'bg-green-500/20 text-green-700 dark:text-green-300' :
                report.overallScore >= 70 ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' :
                report.overallScore >= 50 ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300' :
                'bg-red-500/20 text-red-700 dark:text-red-300'
              }
            `}>
              {report.overallScore >= 85 ? 'Elite Performance' :
               report.overallScore >= 70 ? 'Great Progress' :
               report.overallScore >= 50 ? 'Good Progress' :
               'Needs Improvement'}
            </span>
          </div>
        </div>
        
        {/* Score breakdown */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-4">
          <ScoreGauge
            score={report.scoreBreakdown.consistency}
            label="Consistency"
            color="rgb(34, 197, 94)"
          />
          <ScoreGauge
            score={report.scoreBreakdown.volume}
            label="Volume"
            color="rgb(59, 130, 246)"
          />
          <ScoreGauge
            score={report.scoreBreakdown.strength}
            label="Strength"
            color="rgb(168, 85, 247)"
          />
          <ScoreGauge
            score={report.scoreBreakdown.performance}
            label="Performance"
            color="rgb(249, 115, 22)"
          />
        </div>
      </div>
      
      {/* Milestones */}
      {report.milestonesReached.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">Milestones Reached</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {report.milestonesReached.map((milestone, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium"
              >
                {milestone}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SCORE GAUGE
// ============================================================================

function ScoreGauge({ score, label, color = 'rgb(214, 255, 42)', maxScore = 100 }: ScoreGaugeProps) {
  const percentage = (score / maxScore) * 100;
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-lg font-bold">{score}/{maxScore}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

// ============================================================================
// OVERVIEW TAB
// ============================================================================

function OverviewTab({ report }: { report: ProgressReport }) {
  const { metrics } = report;
  
  return (
    <StaggeredList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        label="Total Workouts"
        value={metrics.totalWorkouts}
        icon={<Activity className="w-5 h-5" />}
        color="blue"
      />
      <MetricCard
        label="Workouts/Week"
        value={metrics.avgWorkoutsPerWeek.toFixed(1)}
        icon={<Calendar className="w-5 h-5" />}
        color="green"
      />
      <MetricCard
        label="Total Volume"
        value={`${(metrics.totalVolume / 1000).toFixed(1)}k kg`}
        icon={<BarChart3 className="w-5 h-5" />}
        color="purple"
      />
      <MetricCard
        label="Avg Volume/Workout"
        value={`${Math.round(metrics.avgVolumePerWorkout)} kg`}
        icon={<Target className="w-5 h-5" />}
        color="orange"
      />
      <MetricCard
        label="Current Streak"
        value={`${metrics.currentStreak} days`}
        icon={<Zap className="w-5 h-5" />}
        color="yellow"
      />
      <MetricCard
        label="Longest Streak"
        value={`${metrics.longestStreak} days`}
        icon={<Trophy className="w-5 h-5" />}
        color="pink"
      />
      <MetricCard
        label="Personal Records"
        value={metrics.totalPRs}
        icon={<Award className="w-5 h-5" />}
        color="red"
      />
      <MetricCard
        label="Adherence Rate"
        value={`${Math.round(metrics.adherenceRate * 100)}%`}
        icon={<CheckCircle2 className="w-5 h-5" />}
        color="teal"
      />
      <MetricCard
        label="Avg Intensity"
        value={`${metrics.avgIntensity.toFixed(1)} RPE`}
        icon={<Zap className="w-5 h-5" />}
        color="indigo"
      />
    </StaggeredList>
  );
}

// ============================================================================
// METRIC CARD
// ============================================================================

function MetricCard({ label, value, change, trend, icon, color = 'blue' }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-700 dark:text-blue-300',
    green: 'bg-green-500/20 text-green-700 dark:text-green-300',
    purple: 'bg-purple-500/20 text-purple-700 dark:text-purple-300',
    orange: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
    yellow: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
    pink: 'bg-pink-500/20 text-pink-700 dark:text-pink-300',
    red: 'bg-red-500/20 text-red-700 dark:text-red-300',
    teal: 'bg-teal-500/20 text-teal-700 dark:text-teal-300',
    indigo: 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300',
  };
  
  return (
    <div className="bg-card rounded-xl p-4 border hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
          {icon}
        </div>
        {trend && <TrendBadge trend={trend} change={change} />}
      </div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}

// ============================================================================
// TREND BADGE
// ============================================================================

function TrendBadge({ trend, change }: { trend: TrendDirection; change?: number }) {
  const icons = {
    up: <TrendingUp className="w-4 h-4" />,
    down: <TrendingDown className="w-4 h-4" />,
    stable: <Minus className="w-4 h-4" />,
    volatile: <Activity className="w-4 h-4" />,
  };
  
  const colors = {
    up: 'bg-green-500/20 text-green-700 dark:text-green-300',
    down: 'bg-red-500/20 text-red-700 dark:text-red-300',
    stable: 'bg-gray-500/20 text-gray-700 dark:text-gray-300',
    volatile: 'bg-orange-500/20 text-orange-700 dark:text-orange-300',
  };
  
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors[trend]}`}>
      {icons[trend]}
      {change !== undefined && <span>{change > 0 ? '+' : ''}{change.toFixed(0)}%</span>}
    </div>
  );
}

// ============================================================================
// TRENDS TAB
// ============================================================================

function TrendsTab({ trends }: { trends: TrendAnalysis[] }) {
  return (
    <StaggeredList className="space-y-4">
      {trends.map((trend, index) => (
        <TrendCard key={index} trend={trend} />
      ))}
    </StaggeredList>
  );
}

function TrendCard({ trend }: TrendChartProps) {
  const getTrendColor = (direction: TrendDirection) => {
    switch (direction) {
      case 'up': return 'text-green-600 dark:text-green-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      case 'stable': return 'text-gray-600 dark:text-gray-400';
      case 'volatile': return 'text-orange-600 dark:text-orange-400';
    }
  };
  
  const getTrendIcon = (direction: TrendDirection) => {
    switch (direction) {
      case 'up': return <ArrowUpCircle className="w-6 h-6" />;
      case 'down': return <ArrowDownCircle className="w-6 h-6" />;
      case 'stable': return <Minus className="w-6 h-6" />;
      case 'volatile': return <Activity className="w-6 h-6" />;
    }
  };
  
  return (
    <div className="bg-card rounded-xl p-6 border">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold">{trend.metric}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {trend.dataPoints} data points • {Math.round(trend.confidence * 100)}% confidence
          </p>
        </div>
        <div className={`${getTrendColor(trend.direction)}`}>
          {getTrendIcon(trend.direction)}
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Direction</p>
          <p className={`text-lg font-semibold capitalize mt-1 ${getTrendColor(trend.direction)}`}>
            {trend.direction}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Change</p>
          <p className="text-lg font-semibold mt-1">
            {trend.changePercent > 0 ? '+' : ''}{trend.changePercent.toFixed(1)}%
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Confidence</p>
          <p className="text-lg font-semibold mt-1">
            {Math.round(trend.confidence * 100)}%
          </p>
        </div>
      </div>
      
      {trend.prediction && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm font-medium mb-2">Predictions</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Next 7 days:</span>
              <span className="ml-2 font-semibold">{trend.prediction.next7Days.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Next 30 days:</span>
              <span className="ml-2 font-semibold">{trend.prediction.next30Days.toFixed(1)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPARISONS TAB
// ============================================================================

function ComparisonsTab({ comparisons }: { comparisons: PeriodComparison[] }) {
  return (
    <StaggeredList className="space-y-6">
      {comparisons.map((comparison, index) => (
        <ComparisonCard key={index} comparison={comparison} />
      ))}
    </StaggeredList>
  );
}

function ComparisonCard({ comparison }: ComparisonChartProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'period-over-period': return 'vs. Previous Period';
      case 'baseline': return 'vs. Baseline';
      case 'goal': return 'vs. Goal';
      case 'personal-best': return 'vs. All-Time Best';
      default: return type;
    }
  };
  
  return (
    <div className="bg-card rounded-xl p-6 border">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Comparison {getTypeLabel(comparison.type)}
        </h3>
        <p className="text-muted-foreground">{comparison.summary}</p>
      </div>
      
      {/* Highlights */}
      {comparison.highlights.length > 0 && (
        <div className="mb-6 p-4 bg-primary/5 rounded-lg">
          <h4 className="text-sm font-semibold mb-2">Key Highlights</h4>
          <ul className="space-y-1">
            {comparison.highlights.map((highlight, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Differences table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-semibold">Metric</th>
              <th className="text-right py-2 font-semibold">Current</th>
              <th className="text-right py-2 font-semibold">Previous</th>
              <th className="text-right py-2 font-semibold">Change</th>
              <th className="text-center py-2 font-semibold">Trend</th>
            </tr>
          </thead>
          <tbody>
            {comparison.differences.map((diff, index) => (
              <tr key={index} className="border-b last:border-0">
                <td className="py-3">{diff.metric}</td>
                <td className="text-right py-3 font-medium">{diff.current.toFixed(1)}</td>
                <td className="text-right py-3 text-muted-foreground">{diff.previous.toFixed(1)}</td>
                <td className={`text-right py-3 font-medium ${
                  diff.change > 0 ? 'text-green-600 dark:text-green-400' :
                  diff.change < 0 ? 'text-red-600 dark:text-red-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {diff.change > 0 ? '+' : ''}{diff.changePercent.toFixed(0)}%
                </td>
                <td className="text-center py-3">
                  <TrendBadge trend={diff.trend} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// INSIGHTS TAB
// ============================================================================

function InsightsTab({ insights, recommendations }: { insights: AIInsight[]; recommendations: string[] }) {
  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <div>
        <h3 className="text-xl font-semibold mb-4">AI Insights</h3>
        <StaggeredList className="space-y-3">
          {insights.map((insight) => (
            <InsightCard key={insight.id} insight={insight} />
          ))}
        </StaggeredList>
      </div>
      
      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <FadeInUp key={i} delay={i * 0.05}>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{rec}</p>
                </div>
              </FadeInUp>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({ insight }: InsightCardProps) {
  const getInsightIcon = (type: InsightType) => {
    switch (type) {
      case 'achievement': return <Trophy className="w-5 h-5" />;
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'recommendation': return <Lightbulb className="w-5 h-5" />;
      case 'milestone': return <Award className="w-5 h-5" />;
      case 'pattern': return <Eye className="w-5 h-5" />;
    }
  };
  
  const getInsightColor = (type: InsightType) => {
    switch (type) {
      case 'achievement': return 'bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300';
      case 'warning': return 'bg-red-500/10 border-red-500/20 text-red-700 dark:text-red-300';
      case 'recommendation': return 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300';
      case 'milestone': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'pattern': return 'bg-purple-500/10 border-purple-500/20 text-purple-700 dark:text-purple-300';
    }
  };
  
  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: 'bg-red-500/20 text-red-700 dark:text-red-300',
      medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
      low: 'bg-gray-500/20 text-gray-700 dark:text-gray-300',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
        {priority}
      </span>
    );
  };
  
  return (
    <div className={`rounded-lg p-4 border ${getInsightColor(insight.type)}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getInsightIcon(insight.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{insight.title}</h4>
            {getPriorityBadge(insight.priority)}
          </div>
          <p className="text-sm opacity-90 mb-2">{insight.description}</p>
          {insight.recommendation && (
            <div className="mt-3 pt-3 border-t border-current/20">
              <p className="text-sm font-medium mb-1">💡 Recommendation:</p>
              <p className="text-sm opacity-90">{insight.recommendation}</p>
            </div>
          )}
          <div className="mt-3 flex items-center gap-4 text-xs opacity-75">
            <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
            {insight.metric && <span>Metric: {insight.metric}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// COMPACT VIEW (para dashboards)
// ============================================================================

export function ProgressSummaryWidget({ report }: { report: ProgressReport }) {
  const topInsights = report.insights
    .filter(i => i.priority === 'high')
    .slice(0, 2);
  
  return (
    <div className="bg-card rounded-xl p-6 border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Progress Summary</h3>
        <span className="text-3xl font-bold text-primary">{report.overallScore}/100</span>
      </div>
      
      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="text-center">
          <p className="text-2xl font-bold">{report.scoreBreakdown.consistency}</p>
          <p className="text-xs text-muted-foreground">Consistency</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{report.scoreBreakdown.volume}</p>
          <p className="text-xs text-muted-foreground">Volume</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{report.scoreBreakdown.strength}</p>
          <p className="text-xs text-muted-foreground">Strength</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{report.scoreBreakdown.performance}</p>
          <p className="text-xs text-muted-foreground">Performance</p>
        </div>
      </div>
      
      {topInsights.length > 0 && (
        <div className="space-y-2">
          {topInsights.map((insight) => (
            <div key={insight.id} className="text-sm p-2 bg-primary/5 rounded">
              <span className="font-medium">{insight.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
