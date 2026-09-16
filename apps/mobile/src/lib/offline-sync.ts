/**
 * Sistema de sincronización offline para KinetixFitt.
 * Persiste operaciones pequeñas y las reintenta cuando vuelve la conexión.
 */

"use client";

import { useEffect, useState } from "react";

export interface PendingOperation {
  id: string;
  type: "workout-log" | "measurement" | "checkin" | "message";
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint: string;
  data: unknown;
  timestamp: number;
  retryCount: number;
}

const STORAGE_KEY = "kinetixfit_offline_operations";
const MAX_RETRIES = 3;
const MAX_QUEUE_SIZE = 200;
const MAX_ITEM_BYTES = 256 * 1024;
const SYNC_INTERVAL = 30000;

export function isOnline(): boolean {
  return typeof window === "undefined" ? true : navigator.onLine;
}

export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    setOnline(navigator.onLine);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
}

function readQueue(): PendingOperation[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((op): op is PendingOperation => {
      return !!op && typeof op === "object" && typeof (op as PendingOperation).id === "string" && typeof (op as PendingOperation).endpoint === "string";
    });
  } catch {
    return [];
  }
}

function writeQueue(queue: PendingOperation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(queue.slice(-MAX_QUEUE_SIZE)));
}

export async function queueOperation(operation: Omit<PendingOperation, "id" | "timestamp" | "retryCount">): Promise<string> {
  if (typeof window === "undefined") throw new Error("Offline queue solo está disponible en el navegador");
  const serialized = JSON.stringify(operation.data);
  if (serialized.length > MAX_ITEM_BYTES) throw new Error("La operación offline es demasiado grande");

  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `op_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const pendingOp: PendingOperation = { ...operation, id, timestamp: Date.now(), retryCount: 0 };
  const existing = readQueue();
  if (existing.length >= MAX_QUEUE_SIZE) existing.shift();
  writeQueue([...existing, pendingOp]);
  return id;
}

export function getQueuedOperations(): PendingOperation[] {
  return readQueue();
}

export async function removeOperation(id: string): Promise<void> {
  writeQueue(readQueue().filter((op) => op.id !== id));
}

export async function syncPendingOperations(): Promise<{ success: number; failed: number }> {
  if (!isOnline()) return { success: 0, failed: 0 };
  const operations = readQueue();
  let success = 0;
  let failed = 0;

  for (const operation of operations) {
    if (operation.retryCount >= MAX_RETRIES) {
      failed++;
      continue;
    }

    try {
      const response = await fetch(operation.endpoint, {
        method: operation.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(operation.data),
      });

      if (response.ok || response.status === 409) {
        await removeOperation(operation.id);
        success++;
        continue;
      }

      // 4xx normalmente indica payload/auth inválidos; no martillar el servidor.
      if (response.status >= 400 && response.status < 500 && response.status !== 408 && response.status !== 429) {
        failed++;
        continue;
      }

      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      const nextRetry = operation.retryCount + 1;
      const current = readQueue();
      writeQueue(current.map((op) => op.id === operation.id ? { ...op, retryCount: nextRetry } : op));
      failed++;
      console.warn("[Offline Sync] retry", operation.type, nextRetry, error);
    }
  }

  return { success, failed };
}

export function useAutoSync() {
  const online = useOnlineStatus();

  useEffect(() => {
    if (!online) return;
    const syncNow = async () => {
      if (getQueuedOperations().length > 0) await syncPendingOperations();
    };
    void syncNow();
    const interval = window.setInterval(() => void syncNow(), SYNC_INTERVAL);
    return () => window.clearInterval(interval);
  }, [online]);
}

export function queueWorkoutLog(workoutData: unknown) {
  return queueOperation({ type: "workout-log", method: "POST", endpoint: "/api/workout-logs", data: workoutData });
}
export function queueMeasurement(measurementData: unknown) {
  return queueOperation({ type: "measurement", method: "POST", endpoint: "/api/measurements", data: measurementData });
}
export function queueCheckin(checkinData: unknown) {
  return queueOperation({ type: "checkin", method: "POST", endpoint: "/api/checkins", data: checkinData });
}
export function queueMessage(messageData: unknown) {
  return queueOperation({ type: "message", method: "POST", endpoint: "/api/messages", data: messageData });
}

export function getPendingCount(): number {
  return readQueue().length;
}

export function clearAllOperations(): void {
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
}
