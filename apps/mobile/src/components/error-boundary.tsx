"use client";

import React, { Component, ReactNode } from "react";
import * as Sentry from "@sentry/nextjs";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to Sentry
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return <DefaultErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

function DefaultErrorFallback({ error }: { error: Error | null }) {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-950">
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">
            Algo salió mal
          </h1>
          <p className="text-sm text-zinc-400">
            Lo sentimos, ocurrió un error inesperado. Ya hemos sido notificados y
            estamos trabajando para solucionarlo.
          </p>
        </div>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && error && (
          <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 text-left">
            <p className="text-xs font-mono text-red-400 break-all">
              {error.message}
            </p>
            {error.stack && (
              <pre className="mt-2 text-xs text-zinc-500 overflow-auto max-h-40">
                {error.stack}
              </pre>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleReload}
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-primary text-black font-bold hover:bg-primary/90 transition-colors"
          >
            <RefreshCw size={18} />
            Reintentar
          </button>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl border border-zinc-800 bg-zinc-900 text-white font-bold hover:bg-zinc-800 transition-colors"
          >
            <Home size={18} />
            Inicio
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-xs text-zinc-600">
          Si el problema persiste,{" "}
          <Link href="/support" className="text-primary hover:underline">
            contactá a soporte
          </Link>
        </p>
      </div>
    </div>
  );
}

// Specialized error boundaries for different sections

export function DashboardErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Error al cargar el dashboard
          </h2>
          <p className="text-sm text-zinc-400 mb-4">
            Ocurrió un error al cargar esta página.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg bg-primary text-black font-bold hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}

export function WorkoutErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-8 text-center">
          <AlertTriangle size={40} className="text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">
            Error en el entrenamiento
          </h2>
          <p className="text-sm text-zinc-400 mb-4">
            No pudimos cargar el entrenamiento. Tu progreso está guardado.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 rounded-lg bg-primary text-black font-bold"
            >
              Reintentar
            </button>
            <Link
              href="/client/dashboard"
              className="px-6 py-2 rounded-lg border border-zinc-800 text-white font-bold"
            >
              Volver al dashboard
            </Link>
          </div>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
