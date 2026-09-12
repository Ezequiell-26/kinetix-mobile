import { SkeletonHeroCard, SkeletonMetricCard } from "@kinetix/shared/components";

export default function DashboardLoading() {
  return (
    <div className="space-y-9 pb-4">
      {/* Header skeleton */}
      <header className="space-y-2.5">
        <div className="h-3 w-48 rounded bg-zinc-800 animate-pulse" />
        <div className="h-10 w-64 rounded bg-zinc-800 animate-pulse" />
        <div className="h-4 w-80 rounded bg-zinc-800 animate-pulse" />
      </header>

      {/* Hero + Rail section skeleton */}
      <section className="grid lg:grid-cols-3 gap-5 items-stretch">
        <div className="lg:col-span-2">
          <SkeletonHeroCard />
        </div>
        <div className="space-y-3">
          <SkeletonMetricCard />
          <SkeletonMetricCard />
          <SkeletonMetricCard />
        </div>
      </section>

      {/* Stats grid skeleton */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SkeletonMetricCard />
        <SkeletonMetricCard />
        <SkeletonMetricCard />
        <SkeletonMetricCard />
      </section>

      {/* Weekly progress skeleton */}
      <section className="rounded-3xl border border-subtle bg-surface/40 p-6 space-y-4">
        <div className="h-5 w-40 rounded bg-zinc-800 animate-pulse" />
        <div className="h-32 w-full rounded-xl bg-zinc-800 animate-pulse" />
      </section>

      {/* Quick actions skeleton */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-subtle bg-surface/40 p-4 space-y-3">
          <div className="h-6 w-6 rounded-lg bg-zinc-800 animate-pulse" />
          <div className="h-4 w-32 rounded bg-zinc-800 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-zinc-800 animate-pulse" />
        </div>
        <div className="rounded-2xl border border-subtle bg-surface/40 p-4 space-y-3">
          <div className="h-6 w-6 rounded-lg bg-zinc-800 animate-pulse" />
          <div className="h-4 w-32 rounded bg-zinc-800 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-zinc-800 animate-pulse" />
        </div>
        <div className="rounded-2xl border border-subtle bg-surface/40 p-4 space-y-3">
          <div className="h-6 w-6 rounded-lg bg-zinc-800 animate-pulse" />
          <div className="h-4 w-32 rounded bg-zinc-800 animate-pulse" />
          <div className="h-10 w-full rounded-xl bg-zinc-800 animate-pulse" />
        </div>
      </section>
    </div>
  );
}
