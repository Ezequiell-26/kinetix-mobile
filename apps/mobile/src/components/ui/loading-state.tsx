import { 
  SkeletonHeroCard, 
  SkeletonList, 
  SkeletonGrid, 
  SkeletonMetricCard 
} from "./skeleton";

/**
 * LoadingState — Estados de carga unificados para toda la app
 * Uso: En lugar de <div>Cargando...</div>, usar estos componentes
 */

/**
 * DashboardLoading — Loading del dashboard (cliente o trainer)
 */
export function DashboardLoading({ role = "client" }: { role?: "client" | "trainer" }) {
  if (role === "client") {
    return (
      <div className="space-y-9 pb-4">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-3 w-48 bg-subtle/60 rounded animate-pulse" />
          <div className="h-10 w-64 bg-subtle/60 rounded animate-pulse" />
          <div className="h-4 w-56 bg-subtle/60 rounded animate-pulse" />
        </div>

        {/* Hero + weekly progress */}
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <SkeletonHeroCard />
          </div>
          <div className="space-y-5">
            <div className="h-48 bg-subtle/60 rounded-3xl animate-pulse" />
            <div className="h-40 bg-subtle/60 rounded-3xl animate-pulse" />
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <SkeletonMetricCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Trainer dashboard
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-subtle/60 rounded animate-pulse" />
          <div className="h-4 w-72 bg-subtle/60 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-32 bg-subtle/60 rounded-lg animate-pulse" />
          <div className="h-10 w-32 bg-subtle/60 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map(i => (
          <SkeletonMetricCard key={i} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-80 bg-subtle/60 rounded-2xl animate-pulse" />
        <div className="h-80 bg-subtle/60 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}

/**
 * ClientListLoading — Loading de lista de clientes (trainer)
 */
export function ClientListLoading({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-subtle/60 rounded animate-pulse" />
        <div className="h-10 w-32 bg-subtle/60 rounded-lg animate-pulse" />
      </div>
      <SkeletonList count={count} variant="row" />
    </div>
  );
}

/**
 * ToolsLoading — Loading del hub de herramientas
 */
export function ToolsLoading() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-subtle/60 rounded animate-pulse" />
        <div className="h-4 w-72 bg-subtle/60 rounded animate-pulse" />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-10 w-32 bg-subtle/60 rounded-full animate-pulse shrink-0" />
        ))}
      </div>

      {/* Tools grid */}
      <SkeletonGrid count={6} cols={3} />
    </div>
  );
}

/**
 * WorkoutLoading — Loading de página de entrenamiento
 */
export function WorkoutLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="h-6 w-32 bg-subtle/60 rounded animate-pulse" />
        <div className="h-10 w-64 bg-subtle/60 rounded animate-pulse" />
        <div className="h-4 w-48 bg-subtle/60 rounded animate-pulse" />
      </div>

      {/* Exercise list */}
      <div className="space-y-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-subtle/60 rounded-2xl animate-pulse" />
        ))}
      </div>

      {/* Timer/Actions */}
      <div className="h-24 bg-subtle/60 rounded-2xl animate-pulse" />
    </div>
  );
}

/**
 * ProgressLoading — Loading de página de progreso
 */
export function ProgressLoading() {
  return (
    <div className="space-y-6">
      {/* Tabs skeleton */}
      <div className="flex gap-2 border-b border-subtle pb-2">
        {["Peso", "Cargas", "Medidas", "Fotos"].map(tab => (
          <div key={tab} className="h-10 w-24 bg-subtle/60 rounded-t-lg animate-pulse" />
        ))}
      </div>

      {/* Chart skeleton */}
      <div className="h-64 bg-subtle/60 rounded-2xl animate-pulse" />

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-subtle/60 rounded-2xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

/**
 * CheckinFormLoading — Loading de formulario de check-in
 */
export function CheckinFormLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-48 bg-subtle/60 rounded animate-pulse" />
        <div className="h-4 w-64 bg-subtle/60 rounded animate-pulse" />
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-56 bg-subtle/60 rounded animate-pulse" />
            <div className="h-12 bg-subtle/60 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>

      {/* Photo upload */}
      <div className="h-32 bg-subtle/60 rounded-2xl animate-pulse" />

      {/* Submit button */}
      <div className="h-12 bg-subtle/60 rounded-xl animate-pulse" />
    </div>
  );
}

/**
 * MessagesLoading — Loading de chat
 */
export function MessagesLoading() {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-16 border-b border-subtle flex items-center px-4 gap-3">
        <div className="w-10 h-10 bg-subtle/60 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-32 bg-subtle/60 rounded animate-pulse" />
          <div className="h-3 w-24 bg-subtle/60 rounded animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
          >
            <div className={`h-16 bg-subtle/60 rounded-2xl animate-pulse ${
              i % 2 === 0 ? "w-3/4" : "w-2/3"
            }`} />
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="h-16 border-t border-subtle px-4 flex items-center gap-2">
        <div className="flex-1 h-10 bg-subtle/60 rounded-full animate-pulse" />
        <div className="w-10 h-10 bg-subtle/60 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
