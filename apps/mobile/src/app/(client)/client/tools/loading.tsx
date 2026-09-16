import { SkeletonCard } from "@kinetix/shared/components";
export default function Loading(){
  return <div className="space-y-4"><div className="h-7 w-40 rounded bg-zinc-800 animate-pulse" /><div className="flex gap-1.5"><div className="h-8 w-20 rounded-full bg-zinc-800 animate-pulse" /><div className="h-8 w-20 rounded-full bg-zinc-800 animate-pulse" /></div><SkeletonCard /></div>;
}
