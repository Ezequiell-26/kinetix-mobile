
import { SkeletonCard, SkeletonMetricCard } from "@kinetix/shared/components";

export default function ProgressLoading() {
  return (
    <div className="space-y-5">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <div className="space-y-2">
          <div className="h-7 w-40 rounded bg-zinc-800 animate-pulse" />
          <div className="h-4 w-64 rounded bg-zinc-800 animate-pulse" />
        </div>
        <div className="h-10 w-36 rounded-xl bg-zinc-800 animate-pulse" />
      </div>

      {/* KPI Strip skeleton - 4 cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <SkeletonMetricCard />
        <SkeletonMetricCard />
        <SkeletonMetricCard />
        <SkeletonMetricCard />
      </div>

      {/* Tabs content skeleton */}
      <div className="space-y-4">
        {/* Main content card */}
        <SkeletonCard />
        
        {/* Secondary cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}
