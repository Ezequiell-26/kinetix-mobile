import { Card, CardContent } from './ui/card';

// Skeleton para tarjetas de entrenamiento
export function WorkoutCardSkeleton() {
  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1 animate-pulse" />
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded flex-1 animate-pulse" />
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton para estadísticas del dashboard
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
            </div>
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Skeleton para lista de comidas
export function NutritionListSkeleton() {
  return (
    <div className="space-y-3 w-full">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
            </div>
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Skeleton para fotos de progreso
export function ProgressPhotosSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardContent className="p-0 aspect-square">
            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Skeleton para mensajes
export function MessagesSkeleton() {
  return (
    <div className="space-y-4 w-full">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Skeleton para tabla de clientes (trainer)
export function ClientsTableSkeleton() {
  return (
    <div className="space-y-3 w-full">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4 p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
          </div>
          <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

// Skeleton genérico con efecto shimmer
export function ShimmerSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-[shimmer_1.5s_infinite] ${className}`} />
  );
}
