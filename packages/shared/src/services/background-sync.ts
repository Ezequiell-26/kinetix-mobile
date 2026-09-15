"use client";

export type OfflineWorkout = Record<string, unknown> & { clientMutationId?: string; timestamp?: number };

export class BackgroundSyncService {
  private static instance: BackgroundSyncService | null = null;
  private db: IDBDatabase | null = null;
  private isOnline = typeof navigator === "undefined" ? true : navigator.onLine;
  private syncTimer: ReturnType<typeof setInterval> | null = null;
  private initialized = false;

  private constructor() {}

  public static getInstance() {
    if (!BackgroundSyncService.instance) BackgroundSyncService.instance = new BackgroundSyncService();
    return BackgroundSyncService.instance;
  }

  public async init(): Promise<void> {
    if (this.initialized || typeof window === "undefined") return;
    this.initialized = true;
    await this.initDB();
    this.isOnline = navigator.onLine;
    window.addEventListener("online", this.handleOnline);
    window.addEventListener("offline", this.handleOffline);
    document.addEventListener("visibilitychange", this.handleVisibility);
    this.syncTimer = setInterval(() => { if (this.isOnline) void this.performSync(); }, 30000);
    if ("serviceWorker" in navigator) {
      await navigator.serviceWorker.register("/sw-background.js").catch(() => undefined);
    }
    if (this.isOnline) await this.performSync();
  }

  public async destroy(): Promise<void> {
    if (typeof window !== "undefined") {
      window.removeEventListener("online", this.handleOnline);
      window.removeEventListener("offline", this.handleOffline);
      document.removeEventListener("visibilitychange", this.handleVisibility);
    }
    if (this.syncTimer) clearInterval(this.syncTimer);
    this.syncTimer = null;
    this.db?.close();
    this.db = null;
    this.initialized = false;
  }

  private handleOnline = () => { this.isOnline = true; void this.performSync(); };
  private handleOffline = () => { this.isOnline = false; };
  private handleVisibility = () => { if (!document.hidden && this.isOnline) void this.performSync(); };

  private async initDB(): Promise<void> {
    if (typeof indexedDB === "undefined") return;
    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open("KinetixSyncDB", 2);
      request.onerror = () => reject(request.error || new Error("IndexedDB unavailable"));
      request.onsuccess = () => resolve(request.result);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("workoutQueue")) db.createObjectStore("workoutQueue", { keyPath: "id", autoIncrement: true });
        if (!db.objectStoreNames.contains("syncCache")) db.createObjectStore("syncCache", { keyPath: "key" });
      };
    });
  }

  public async queueWorkout(workoutData: OfflineWorkout): Promise<void> {
    if (!this.db) return;
    const item = { ...workoutData, clientMutationId: workoutData.clientMutationId || crypto.randomUUID(), timestamp: Date.now() };
    await new Promise<void>((resolve, reject) => {
      const tx = this.db!.transaction("workoutQueue", "readwrite");
      tx.objectStore("workoutQueue").add(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("No se pudo guardar la sesión offline"));
    });
    if (this.isOnline) await this.performSync();
  }

  private async readQueue(): Promise<Array<OfflineWorkout & { id: number }>> {
    if (!this.db) return [];
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction("workoutQueue", "readonly");
      const request = tx.objectStore("workoutQueue").getAll();
      request.onsuccess = () => resolve(request.result as Array<OfflineWorkout & { id: number }>);
      request.onerror = () => reject(request.error || new Error("No se pudo leer la cola offline"));
    });
  }

  private async removeIds(ids: number[]): Promise<void> {
    if (!this.db || !ids.length) return;
    await new Promise<void>((resolve, reject) => {
      const tx = this.db!.transaction("workoutQueue", "readwrite");
      const store = tx.objectStore("workoutQueue");
      ids.forEach((id) => store.delete(id));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error("No se pudo limpiar la cola offline"));
    });
  }

  public async performSync(): Promise<void> {
    if (!this.isOnline || !this.db) return;
    const queue = await this.readQueue();
    if (!queue.length) return;
    const response = await fetch("/api/sync/workouts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: queue.map(({ id: _id, ...item }) => item) }),
      cache: "no-store",
    }).catch(() => null);
    if (!response || !response.ok) return;
    const data = await response.json().catch(() => null) as { accepted?: number; rejected?: number } | null;
    if (data?.rejected) return;
    await this.removeIds(queue.map((item) => item.id));
  }

  public async flushQueue() { await this.performSync(); }

  public get status() { return this.isOnline ? "online" : "offline"; }
}

export const backgroundSync = BackgroundSyncService.getInstance();
export default backgroundSync;
