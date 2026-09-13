'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
    this.props.onError?.(error, errorInfo);
    
    // En producción, podrías enviar el error a un servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      // Aquí iría la integración con Sentry u otro servicio
      // Sentry.captureException(error, { contexts: { react: errorInfo } });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    const { hasError, error } = this.state;
    const { children, fallback } = this.props;

    if (hasError) {
      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 p-4">
          <Card className="max-w-md w-full shadow-2xl border-red-200 dark:border-red-900">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                ¡Algo salió mal!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-2">
                <p className="text-gray-600 dark:text-gray-300">
                  Ha ocurrido un error inesperado. No te preocupes, nuestro equipo ha sido notificado.
                </p>
                {error && (
                  <details className="text-left mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <summary className="cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ver detalles del error
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto max-h-32">
                      {error.toString()}
                    </pre>
                  </details>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleReset}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Intentar de nuevo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = '/'}
                  className="flex-1"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ir al inicio
                </Button>
              </div>
              
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Si el problema persiste, contacta a soporte técnico.
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    return children;
  }
}

// Hook para usar ErrorBoundary funcionalmente
import { useState, useEffect } from 'react';

export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleError = (err: Error) => {
    setError(err);
    setHasError(true);
  };

  const reset = () => {
    setError(null);
    setHasError(false);
  };

  return { error, hasError, handleError, reset };
}

export default ErrorBoundary;
