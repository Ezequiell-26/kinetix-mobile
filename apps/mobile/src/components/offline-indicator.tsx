/**
 * Componente de Indicador Offline
 * Muestra el estado de conexión y operaciones pendientes
 */

'use client';

import { useEffect, useState } from 'react';
import { useOnlineStatus, getPendingCount } from '@/lib/offline-sync';
import { WifiOff, Wifi, RefreshCw, CheckCircle } from 'lucide-react';

export function OfflineIndicator() {
  const online = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // Actualizar contador de operaciones pendientes
    const updateCount = () => {
      setPendingCount(getPendingCount());
    };

    updateCount();
    const interval = setInterval(updateCount, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    if (!online || syncing) return;
    
    setSyncing(true);
    try {
      const { syncPendingOperations } = await import('@/lib/offline-sync');
      const result = await syncPendingOperations();
      setPendingCount(result.failed);
      
      // Mostrar toast de resultado
      const { toast } = await import('sonner');
      if (result.success > 0) {
        toast.success(`${result.success} operación(es) sincronizada(s)`);
      }
      if (result.failed > 0) {
        toast.warning(`${result.failed} operación(es) fallaron. Reintentando...`);
      }
    } catch (error) {
      console.error('Error en sync manual:', error);
    } finally {
      setSyncing(false);
    }
  };

  // No mostrar si está online y no hay operaciones pendientes
  if (online && pendingCount === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ${
      !online 
        ? 'bg-red-500 text-white' 
        : pendingCount > 0 
          ? 'bg-amber-500 text-white' 
          : 'bg-green-500 text-white'
    }`}>
      {!online ? (
        <>
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Sin conexión</span>
        </>
      ) : pendingCount > 0 ? (
        <>
          {syncing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <span className="text-sm font-medium">
            {syncing ? 'Sincronizando...' : `${pendingCount} pendiente(s)`}
          </span>
          {!syncing && (
            <button
              onClick={handleManualSync}
              className="ml-2 px-2 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-medium transition-colors"
            >
              Sincronizar
            </button>
          )}
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4" />
          <span className="text-sm font-medium">En línea</span>
        </>
      )}
    </div>
  );
}

// Versión minimalista para usar en layouts
export function OfflineIndicatorMinimal() {
  const online = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updateCount = () => setPendingCount(getPendingCount());
    updateCount();
    const interval = setInterval(updateCount, 10000);
    return () => clearInterval(interval);
  }, []);

  if (online && pendingCount === 0) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-50 p-2 rounded-full shadow-lg ${
      !online ? 'bg-red-500' : 'bg-amber-500'
    } text-white`}>
      {!online ? (
        <WifiOff className="w-5 h-5" />
      ) : (
        <div className="relative">
          <RefreshCw className="w-5 h-5 animate-spin" />
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default OfflineIndicator;
