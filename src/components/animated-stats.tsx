"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CountUpProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

export function CountUp({
  value,
  duration = 2000,
  className,
  prefix = "",
  suffix = "",
  decimals = 0,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const prevValue = useRef(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let startTime: number | null = null;
    const startValue = prevValue.current;
    const change = value - startValue;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (ease-out-quart)
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + change * eased;

      node.textContent = `${prefix}${currentValue.toFixed(decimals)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevValue.current = value;
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, prefix, suffix, decimals]);

  return <span ref={ref} className={cn("tabular-nums", className)} />;
}

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  trackColor?: string;
  progressColor?: string;
  children?: React.ReactNode;
}

export function ProgressRing({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  trackColor = "stroke-white/10",
  progressColor = "stroke-[#D6FF2A]",
  children,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={trackColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={cn(progressColor, "transition-all duration-500 ease-out")}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  height?: number;
  trackColor?: string;
  progressColor?: string;
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({
  progress,
  className,
  height = 8,
  trackColor = "bg-white/10",
  progressColor = "bg-[#D6FF2A]",
  showLabel = false,
  label,
}: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-2 text-sm">
          {label && <span className="text-white/70">{label}</span>}
          <span className="text-white/70 tabular-nums">{clampedProgress.toFixed(0)}%</span>
        </div>
      )}
      <div
        className={cn("w-full rounded-full overflow-hidden", trackColor)}
        style={{ height: `${height}px` }}
      >
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", progressColor)}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}
