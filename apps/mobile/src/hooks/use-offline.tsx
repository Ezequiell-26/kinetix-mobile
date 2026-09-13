/**
 * Hook para funcionalidades offline en EZEQUIEL COACHING
 * Proporciona detección de estado online/offline y cola de acciones pendientes
 */

import { useState, useEffect, useCallback } from 'react';

interface OfflineQueueItem {
  id: string;
  type: 'workout-log' | 'checkin' | 'message' | 'nutrition' | 'measurement';
  payload: any;
  timestamp: number;
  retries: number;
}

interface UseOfflineReturn {
  isOnline: boolean;
  queue: OfflineQueueItem[];
  queueLength: number;
  addToQueue: (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retries'>) => void;
  clearQueue: () => void;
  syncQueue: () => Promise<void>;
  removeQueuedItem: (id: string) => void;
}

const QUEUE_STORAGE_KEY = 'ezequiel-offline-queue';

export function useOffline(): UseOfflineReturn {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [queue, setQueue] = useState<OfflineQueueItem[]>([]);

  // Cargar cola desde localStorage al iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        setQueue(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading offline queue:', error);
    }
  }, []);

  // Guardar cola en localStorage cuando cambia
  useEffect(() => {
    try {
      localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
    } catch (error) {
      console.error('Error saving offline queue:', error);
    }
  }, [queue]);

  // Escuchar eventos de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Intentar sincronizar automáticamente al recuperar conexión
      setTimeout(() => syncQueue(), 1000);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Agregar item a la cola
  const addToQueue = useCallback((item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'retries'>) => {
    const newItem: OfflineQueueItem = {
      ...item,
      id: `${item.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0,
    };

    setQueue(prev => [...prev, newItem]);

    // Registrar service worker sync si está disponible
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if ('sync' in registration) {
          (registration as ServiceWorkerRegistration & { sync: { register(tag: string): Promise<void> } })
            .sync.register('sync-workout-logs').catch(console.error);
        }
      }).catch(() => {});
    }
  }, []);

  // Eliminar item de la cola
  const removeQueuedItem = useCallback((id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  }, []);

  // Limpiar toda la cola
  const clearQueue = useCallback(() => {
    setQueue([]);
    localStorage.removeItem(QUEUE_STORAGE_KEY);
  }, []);

  // Sincronizar cola con el servidor
  const syncQueue = useCallback(async () => {
    if (!isOnline || queue.length === 0) return;

    const maxRetries = 3;
    const itemsToSync = [...queue];

    for (const item of itemsToSync) {
      if (item.retries >= maxRetries) {
        console.warn(`Item ${item.id} exceeded max retries, removing from queue`);
        removeQueuedItem(item.id);
        continue;
      }

      try {
        let endpoint = '';
        switch (item.type) {
          case 'workout-log':
            endpoint = '/api/workout-logs';
            break;
          case 'checkin':
            endpoint = '/api/checkins';
            break;
          case 'message':
            endpoint = '/api/messages';
            break;
          case 'nutrition':
            endpoint = '/api/nutrition';
            break;
          case 'measurement':
            endpoint = '/api/measurements';
            break;
          default:
            throw new Error(`Unknown item type: ${item.type}`);
        }

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.payload),
        });

        if (response.ok) {
          removeQueuedItem(item.id);
          console.log(`Successfully synced item ${item.id}`);
        } else {
          throw new Error(`Server responded with ${response.status}`);
        }
      } catch (error) {
        console.error(`Failed to sync item ${item.id}:`, error);
        // Incrementar reintentos
        setQueue(prev =>
          prev.map(i =>
            i.id === item.id ? { ...i, retries: i.retries + 1 } : i
          )
        );
      }
    }
  }, [isOnline, queue, removeQueuedItem]);

  return {
    isOnline,
    queue,
    queueLength: queue.length,
    addToQueue,
    clearQueue,
    syncQueue,
    removeQueuedItem,
  };
}

/**
 * HOC para envolver componentes que necesitan soporte offline
 */
export function withOffline<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  OfflineFallback?: React.ComponentType<{ isOnline: boolean; queueLength: number }>
) {
  return function WithOffline(props: P) {
    const offline = useOffline();

    if (!offline.isOnline && OfflineFallback) {
      return <OfflineFallback isOnline={offline.isOnline} queueLength={offline.queueLength} />;
    }

    return <WrappedComponent {...props} />;
  };
}

/**
 * Componente para mostrar estado offline
 */
export const OfflineBanner: React.FC<{ isOnline: boolean; queueLength: number }> = ({ isOnline, queueLength }) => {
  if (isOnline && queueLength === 0) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 p-4 text-white text-center ${
        isOnline ? 'bg-green-600' : 'bg-red-600'
      }`}
      role="alert"
      aria-live="polite"
    >
      {!isOnline ? (
        <span>Estás offline. Los cambios se guardarán automáticamente cuando recuperes la conexión.</span>
      ) : (
        <span>Conexión restaurada. Sincronizando {queueLength} cambio(s) pendiente(s)...</span>
      )}
    </div>
  );
};

export default useOffline;
