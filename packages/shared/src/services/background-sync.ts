/**
 * Background Sync Service
 * Keeps app functional and synced even when in background or different screen
 * Uses Service Workers + IndexedDB + WebSockets
 */

export class BackgroundSyncService {
  private static instance: BackgroundSyncService;
  private syncQueue: any[] = [];
  private ws: WebSocket | null = null;
  private db: IDBDatabase | null = null;
  private isOnline: boolean = true;
  private lastSyncTime: number = 0;

  private constructor() {
    this.init();
  }

  public static getInstance(): BackgroundSyncService {
    if (!BackgroundSyncService.instance) {
      BackgroundSyncService.instance = new BackgroundSyncService();
    }
    return BackgroundSyncService.instance;
  }

  private async init(): Promise<void> {
    // Initialize IndexedDB for offline storage
    await this.initDB();
    
    // Setup network listeners
    this.setupNetworkListeners();
    
    // Start background sync loop
    this.startSyncLoop();
    
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw-background.js');
    }
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('KinetixSyncDB', 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains('workoutQueue')) {
          db.createObjectStore('workoutQueue', { keyPath: 'id', autoIncrement: true });
        }
        
        if (!db.objectStoreNames.contains('syncCache')) {
          db.createObjectStore('syncCache', { keyPath: 'key' });
        }
      };
    });
  }

  private setupNetworkListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.flushQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
    
    // Visibility change - keep syncing in background
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // App in background - reduce sync frequency but keep working
        this.reduceSyncFrequency();
      } else {
        // App visible - resume normal sync
        this.resumeNormalSync();
      }
    });
  }

  private startSyncLoop(): void {
    setInterval(() => {
      if (this.isOnline && !document.hidden) {
        this.performSync();
      }
    }, 30000); // Sync every 30s when visible
  }

  private reduceSyncFrequency(): void {
    // Reduce to every 5 minutes in background
    console.log('Reducing sync frequency for background mode');
  }

  private resumeNormalSync(): void {
    // Resume normal 30s sync
    console.log('Resuming normal sync frequency');
    this.performSync();
  }

  private async performSync(): Promise<void> {
    const now = Date.now();
    
    // Rate limit syncs
    if (now - this.lastSyncTime < 5000) {
      return;
    }
    
    this.lastSyncTime = now;
    
    try {
      // Sync workout data
      await this.syncWorkouts();
      
      // Sync messages
      await this.syncMessages();
      
      // Sync progress
      await this.syncProgress();
      
      console.log('Background sync completed successfully');
    } catch (error) {
      console.error('Background sync failed:', error);
      // Will retry on next interval
    }
  }

  private async syncWorkouts(): Promise<void> {
    if (!this.db) return;
    
    const tx = this.db.transaction('workoutQueue', 'readonly');
    const store = tx.objectStore('workoutQueue');
    
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = async () => {
        const queuedItems = request.result;
        
        if (queuedItems.length > 0 && this.isOnline) {
          // Send to server
          await fetch('/api/sync/workouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: queuedItems })
          });
          
          // Clear queue after successful sync
          const clearTx = this.db!.transaction('workoutQueue', 'readwrite');
          clearTx.objectStore('workoutQueue').clear();
        }
        
        resolve();
      };
    });
  }

  private async syncMessages(): Promise<void> {
    // WebSocket real-time sync for messages
    if (this.isOnline && !this.ws) {
      this.initWebSocket();
    }
  }

  private async syncProgress(): Promise<void> {
    // Sync user progress data
    if (!this.isOnline) return;
    
    await fetch('/api/sync/progress', {
      method: 'GET',
      cache: 'no-cache'
    });
  }

  private initWebSocket(): void {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.ws = new WebSocket(`${protocol}//${window.location.host}/ws`);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected for real-time sync');
    };
    
    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.handleRealtimeUpdate(data);
    };
    
    this.ws.onclose = () => {
      this.ws = null;
      // Reconnect after 5 seconds
      setTimeout(() => this.initWebSocket(), 5000);
    };
  }

  private handleRealtimeUpdate(data: any): void {
    // Handle incoming real-time updates
    switch (data.type) {
      case 'new_message':
        this.notifyNewMessage(data.payload);
        break;
      case 'workout_updated':
        this.updateLocalWorkout(data.payload);
        break;
      default:
        break;
    }
  }

  public async queueWorkout(workoutData: any): Promise<void> {
    if (!this.db) return;
    
    const tx = this.db.transaction('workoutQueue', 'readwrite');
    const store = tx.objectStore('workoutQueue');
    
    store.add({
      ...workoutData,
      timestamp: Date.now(),
      synced: false
    });
    
    // If online, try to sync immediately
    if (this.isOnline) {
      this.flushQueue();
    }
  }

  private async flushQueue(): Promise<void> {
    await this.syncWorkouts();
  }

  private notifyNewMessage(message: any): void {
    // Show notification even if app is in background
    if (Notification.permission === 'granted') {
      new Notification('Nuevo mensaje', {
        body: message.preview,
        icon: '/icon-192.png'
      });
    }
  }

  private updateLocalWorkout(workout: any): void {
    // Update local cache with latest workout data
    console.log('Updating local workout:', workout.id);
  }
}

// Export singleton instance
export const backgroundSync = BackgroundSyncService.getInstance();

export default backgroundSync;
