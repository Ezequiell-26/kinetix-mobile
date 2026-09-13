'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import { useTheme } from './theme-provider';

interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: any;
}

interface InteractiveChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'area' | 'bar' | 'pie';
  title?: string;
  subtitle?: string;
  colors?: string[];
  showTooltip?: boolean;
  showLegend?: boolean;
  height?: number;
  className?: string;
  yAxisLabel?: string;
  targetValue?: number;
  trend?: 'up' | 'down' | 'neutral';
}

const defaultColors = [
  'hsl(var(--chart1))',
  'hsl(var(--chart2))',
  'hsl(var(--chart3))',
  'hsl(var(--chart4))',
  'hsl(var(--chart5))',
];

export function InteractiveChart({
  data,
  type = 'line',
  title,
  subtitle,
  colors = defaultColors,
  showTooltip = true,
  showLegend = true,
  height = 300,
  className = '',
  yAxisLabel,
  targetValue,
  trend,
}: InteractiveChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || data.length === 0) {
    return (
      <div className={`w-full ${className}`} style={{ height }}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-[200px] bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-popover border border-border rounded-lg p-3 shadow-lg"
        >
          <p className="font-semibold text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color || colors[index % colors.length] }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium">{entry.value?.toLocaleString()}</span>
              {yAxisLabel && <span className="text-xs text-muted-foreground">{yAxisLabel}</span>}
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 20, right: 30, left: 20, bottom: 40 },
    };

    const gridStyle = {
      stroke: resolvedTheme === 'dark' ? 'hsl(217.2 32.6% 17.5%)' : 'hsl(214.3 31.8% 91.4%)',
      strokeDasharray: '3 3',
    };

    const axisStyle = {
      fontSize: 12,
      fill: resolvedTheme === 'dark' ? 'hsl(215 20.2% 65.1%)' : 'hsl(215.4 16.3% 46.9%)',
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={colors[0]} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={colors[0]} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid style={gridStyle} />
            <XAxis dataKey="name" style={axisStyle} tick={{ fontSize: 11 }} />
            <YAxis style={axisStyle} tick={{ fontSize: 11 }} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
            {targetValue && <ReferenceLine y={targetValue} stroke="hsl(0 84.2% 60.2%)" strokeDasharray="3 3" label="Meta" />}
            <Area
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid style={gridStyle} />
            <XAxis dataKey="name" style={axisStyle} tick={{ fontSize: 11 }} />
            <YAxis style={axisStyle} tick={{ fontSize: 11 }} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
            {targetValue && <ReferenceLine y={targetValue} stroke="hsl(0 84.2% 60.2%)" strokeDasharray="3 3" label="Meta" />}
            <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
          </BarChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={height * 0.35}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
          </PieChart>
        );

      case 'line':
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid style={gridStyle} />
            <XAxis dataKey="name" style={axisStyle} tick={{ fontSize: 11 }} />
            <YAxis style={axisStyle} tick={{ fontSize: 11 }} label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: 'insideLeft' } : undefined} />
            {showTooltip && <Tooltip content={<CustomTooltip />} />}
            {showLegend && <Legend wrapperStyle={{ fontSize: '12px' }} />}
            {targetValue && <ReferenceLine y={targetValue} stroke="hsl(0 84.2% 60.2%)" strokeDasharray="3 3" label="Meta" />}
            <Line
              type="monotone"
              dataKey="value"
              stroke={colors[0]}
              strokeWidth={3}
              dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-card border border-border rounded-lg p-6 ${className}`}
    >
      {(title || trend) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-lg font-semibold text-card-foreground"
              >
                {title}
              </motion.h3>
            )}
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-sm text-muted-foreground"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          {trend && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                trend === 'up'
                  ? 'bg-green-500/10 text-green-500'
                  : trend === 'down'
                  ? 'bg-red-500/10 text-red-500'
                  : 'bg-gray-500/10 text-gray-500'
              }`}
            >
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3" />
              ) : trend === 'down' ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Activity className="h-3 w-3" />
              )}
            </motion.div>
          )}
        </div>
      )}
      
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// Componentes especializados para casos de uso comunes

export function ProgressChart({ data, title = 'Progreso' }: { data: ChartDataPoint[], title?: string }) {
  return (
    <InteractiveChart
      data={data}
      type="area"
      title={title}
      colors={['hsl(var(--chart1))']}
      yAxisLabel="kg"
      trend="up"
      height={280}
    />
  );
}

export function WorkoutIntensityChart({ data, title = 'Intensidad' }: { data: ChartDataPoint[], title?: string }) {
  return (
    <InteractiveChart
      data={data}
      type="bar"
      title={title}
      colors={['hsl(var(--chart2))']}
      yAxisLabel="RPE"
      height={280}
    />
  );
}

export function MacrosPieChart({ data, title = 'Macronutrientes' }: { data: ChartDataPoint[], title?: string }) {
  return (
    <InteractiveChart
      data={data}
      type="pie"
      title={title}
      colors={['hsl(var(--chart1))', 'hsl(var(--chart2))', 'hsl(var(--chart3))']}
      height={280}
    />
  );
}

export function AdherenceChart({ data, title = 'Adherencia' }: { data: ChartDataPoint[], title?: string }) {
  return (
    <InteractiveChart
      data={data}
      type="line"
      title={title}
      colors={['hsl(var(--chart4))']}
      yAxisLabel="%"
      targetValue={80}
      trend="up"
      height={280}
    />
  );
}
