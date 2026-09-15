/**
 * Sistema de Sincronización Offline para KINETIXFITT
 * Maneja operaciones en segundo plano cuando no hay conexión
 */

'use client';

import { useEffect, useCallback, useState } from 'react';

// Tipos para operaciones pendientes
export interface PendingOperation {
  id: string;
  type: 'workout-log' | 'measurement' | 'checkin' | 'message';
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

const STORAGE_KEY = 'kinetixfit_offline_operations';
const MAX_RETRIES = 3;
const SYNC_INTERVAL = 30000; // 30 segundos

// Verificar estado de conexión
export function isOnline(): boolean {
  if (typeof window === 'undefined') return true;
  return navigator.onLine;
}

// Escuchar cambios de conexión
export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return online;
}

// Guardar operación pendiente en IndexedDB
export async function queueOperation(operation: Omit<PendingOperation, 'id' | 'timestamp' | 'retryCount'>): Promise<string> {
  const id = `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  const pendingOp: PendingOperation = {
    ...operation,
    id,
    timestamp: Date.now(),
    retryCount: 0,
  };

  try {
    // Usar localStorage como fallback simple
    const existing = getQueuedOperations();
    const updated = [...existing, pendingOp];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    console.log('[Offline Sync] Operación encolada:', operation.type);
    return id;
  } catch (error) {
    console.error('[Offline Sync] Error guardando operación:', error);
    throw error;
  }
}

// Obtener operaciones pendientes
export function getQueuedOperations(): PendingOperation[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('[Offline Sync] Error leyendo operaciones:', error);
    return [];
  }
}

// Eliminar operación completada
export async function removeOperation(id: string): Promise<void> {
  try {
    const existing = getQueuedOperations();
    const updated = existing.filter(op => op.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('[Offline Sync] Error eliminando operación:', error);
  }
}

// Sincronizar operaciones pendientes con el servidor
export async function syncPendingOperations(): Promise<{ success: number; failed: number }> {
  const operations = getQueuedOperations();
  let success = 0;
  let failed = 0;

  for (const operation of operations) {
    // Saltar si excede reintentos máximos
    if (operation.retryCount >= MAX_RETRIES) {
      console.warn('[Offline Sync] Operación descartada por muchos reintentos:', operation.id);
      await removeOperation(operation.id);
      failed++;
      continue;
    }

    try {
      const response = await fetch(operation.endpoint, {
        method: operation.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operation.data),
      });

      if (response.ok) {
        await removeOperation(operation.id);
        success++;
        console.log('[Offline Sync] Operación sincronizada:', operation.type);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      // Incrementar contador de reintentos
      operation.retryCount++;
      try {
        const existing = getQueuedOperations();
        const updated = existing.map(op => 
          op.id === operation.id ? { ...op, retryCount: op.retryCount + 1 } : op
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('[Offline Sync] Error actualizando retry count:', e);
      }
      
      failed++;
      console.error('[Offline Sync] Error sincronizando operación:', operation.type, error);
    }
  }

  return { success, failed };
}

// Hook para sincronización automática
export function useAutoSync() {
  const online = useOnlineStatus();

  useEffect(() => {
    if (!online) return;

    // Intentar sincronizar cuando se recupera la conexión
    const syncNow = async () => {
      const operations = getQueuedOperations();
      if (operations.length === 0) return;

      console.log('[Offline Sync] Iniciando sincronización...', operations.length, 'operaciones pendientes');
      const result = await syncPendingOperations();
      console.log('[Offline Sync] Sincronización completada:', result);
    };

    syncNow();

    // Reintentar periódicamente
    const interval = setInterval(syncNow, SYNC_INTERVAL);
    return () => clearInterval(interval);
  }, [online]);
}

// Funciones específicas por tipo de operación
export async function queueWorkoutLog(workoutData: any): Promise<string> {
  return queueOperation({
    type: 'workout-log',
    method: 'POST',
    endpoint: '/api/workout-logs',
    data: workoutData,
  });
}

export async function queueMeasurement(measurementData: any): Promise<string> {
  return queueOperation({
    type: 'measurement',
    method: 'POST',
    endpoint: '/api/measurements',
    data: measurementData,
  });
}

export async function queueCheckin(checkinData: any): Promise<string> {
  return queueOperation({
    type: 'checkin',
    method: 'POST',
    endpoint: '/api/checkins',
    data: checkinData,
  });
}

export async function queueMessage(messageData: any): Promise<string> {
  return queueOperation({
    type: 'message',
    method: 'POST',
    endpoint: '/api/messages',
    data: messageData,
  });
}

// Contador de operaciones pendientes
export function getPendingCount(): number {
  return getQueuedOperations().length;
}

// Limpiar todas las operaciones (útil después de logout)
export function clearAllOperations(): void {
  localStorage.removeItem(STORAGE_KEY);
  console.log('[Offline Sync] Todas las operaciones fueron limpiadas');
}
