/**
 * Sistema de Caché Avanzado para EZEQUIEL COACHING
 * Implementación tipo Redis con soporte para TTL, invalidación y persistencia
 */

interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl?: number; // Time to live en milisegundos
  tags?: string[];
}

interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  evictions: number;
}

export class AdvancedCache {
  private cache: Map<string, CacheEntry<any>>;
  private max_size: number;
  private stats: CacheStats;
  private persistence_key: string = 'ezequiel_coaching_cache';
  private tags_index: Map<string, Set<string>>;

  constructor(maxSize: number = 1000) {
    this.cache = new Map();
    this.max_size = maxSize;
    this.tags_index = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      evictions: 0,
    };
    
    // Cargar desde localStorage si está disponible
    if (typeof window !== 'undefined') {
      this.loadFromPersistence();
    }
    
    // Limpieza periódica de entradas expiradas
    setInterval(() => this.cleanup(), 60000); // Cada minuto
  }

  /**
   * Obtener valor del caché
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      this.stats.misses++;
      return null;
    }

    // Verificar si ha expirado
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      this.stats.misses++;
      return null;
    }

    this.stats.hits++;
    return entry.value as T;
  }

  /**
   * Establecer valor en caché con TTL opcional
   */
  set<T>(key: string, value: T, options?: {
    ttl?: number; // en milisegundos
    tags?: string[];
  }): void {
    // Si el caché está lleno, eliminar la entrada más antigua
    if (this.cache.size >= this.max_size) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey) {
        this.delete(oldestKey);
        this.stats.evictions++;
      }
    }

    const entry: CacheEntry<T> = {
      value,
      timestamp: Date.now(),
      ttl: options?.ttl,
      tags: options?.tags,
    };

    this.cache.set(key, entry);
    this.stats.size = this.cache.size;

    // Indexar por tags
    if (options?.tags) {
      options.tags.forEach(tag => {
        if (!this.tags_index.has(tag)) {
          this.tags_index.set(tag, new Set());
        }
        this.tags_index.get(tag)!.add(key);
      });
    }

    // Guardar en persistencia
    this.saveToPersistence();
  }

  /**
   * Eliminar entrada del caché
   */
  delete(key: string): boolean {
    const entry = this.cache.get(key);
    
    if (entry?.tags) {
      entry.tags.forEach(tag => {
        const tag_set = this.tags_index.get(tag);
        if (tag_set) {
          tag_set.delete(key);
          if (tag_set.size === 0) {
            this.tags_index.delete(tag);
          }
        }
      });
    }

    return this.cache.delete(key);
  }

  /**
   * Invalidar caché por tags
   */
  invalidateByTag(tag: string): number {
    const keys = this.tags_index.get(tag);
    if (!keys) return 0;

    let count = 0;
    keys.forEach(key => {
      if (this.delete(key)) {
        count++;
      }
    });

    return count;
  }

  /**
   * Invalidar múltiples tags
   */
  invalidateByTags(tags: string[]): number {
    let count = 0;
    tags.forEach(tag => {
      count += this.invalidateByTag(tag);
    });
    return count;
  }

  /**
   * Limpiar todo el caché
   */
  clear(): void {
    this.cache.clear();
    this.tags_index.clear();
    this.stats.size = 0;
    this.saveToPersistence();
  }

  /**
   * Limpieza de entradas expiradas
   */
  cleanup(): number {
    let count = 0;
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (entry.ttl && now - entry.timestamp > entry.ttl) {
        this.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Obtener estadísticas del caché
   */
  getStats(): CacheStats & { hitRate: number } {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
    };
  }

  /**
   * Resetear estadísticas
   */
  resetStats(): void {
    this.stats = {
      hits: 0,
      misses: 0,
      size: this.cache.size,
      evictions: 0,
    };
  }

  /**
   * Guardar en localStorage para persistencia
   */
  private saveToPersistence(): void {
    try {
      if (typeof window === 'undefined') return;
      
      const serializable = Array.from(this.cache.entries()).reduce((acc, [key, entry]) => {
        // Solo guardar entradas sin TTL o que no hayan expirado
        if (!entry.ttl || Date.now() - entry.timestamp <= entry.ttl) {
          acc[key] = entry;
        }
        return acc;
      }, {} as Record<string, CacheEntry<any>>);

      localStorage.setItem(this.persistence_key, JSON.stringify(serializable));
    } catch (error) {
      console.warn('Failed to persist cache:', error);
    }
  }

  /**
   * Cargar desde localStorage
   */
  private loadFromPersistence(): void {
    try {
      const data = localStorage.getItem(this.persistence_key);
      if (!data) return;

      const parsed = JSON.parse(data) as Record<string, CacheEntry<any>>;
      const now = Date.now();

      Object.entries(parsed).forEach(([key, entry]) => {
        // Solo cargar entradas que no hayan expirado
        if (!entry.ttl || now - entry.timestamp <= entry.ttl) {
          this.cache.set(key, entry);
          
          // Reconstruir índice de tags
          if (entry.tags) {
            entry.tags.forEach(tag => {
              if (!this.tags_index.has(tag)) {
                this.tags_index.set(tag, new Set());
              }
              this.tags_index.get(tag)!.add(key);
            });
          }
        }
      });

      this.stats.size = this.cache.size;
    } catch (error) {
      console.warn('Failed to load cache from persistence:', error);
    }
  }

  /**
   * Obtener todas las keys (para debugging)
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Verificar si existe una key
   */
  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Obtener o establecer (con función de factory)
   */
  getOrSet<T>(key: string, factory: () => T, options?: {
    ttl?: number;
    tags?: string[];
  }): T {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = factory();
    this.set(key, value, options);
    return value;
  }

  /**
   * Obtener o establecer (con función async)
   */
  async getOrSetAsync<T>(
    key: string, 
    factory: () => Promise<T>, 
    options?: {
      ttl?: number;
      tags?: string[];
    }
  ): Promise<T> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await factory();
    this.set(key, value, options);
    return value;
  }
}

// Instancia singleton para uso global
export const cache = new AdvancedCache(1000);

// Helper functions
export function createCacheNamespace(prefix: string) {
  return {
    get: <T>(key: string) => cache.get<T>(`${prefix}:${key}`),
    set: <T>(key: string, value: T, options?: { ttl?: number; tags?: string[] }) => 
      cache.set(`${prefix}:${key}`, value, options),
    delete: (key: string) => cache.delete(`${prefix}:${key}`),
    has: (key: string) => cache.has(`${prefix}:${key}`),
    getOrSet: <T>(key: string, factory: () => T, options?: { ttl?: number; tags?: string[] }) =>
      cache.getOrSet(`${prefix}:${key}`, factory, options),
    getOrSetAsync: <T>(key: string, factory: () => Promise<T>, options?: { ttl?: number; tags?: string[] }) =>
      cache.getOrSetAsync(`${prefix}:${key}`, factory, options),
  };
}

// Namespaces predefinidos
export const userCache = createCacheNamespace('user');
export const workoutCache = createCacheNamespace('workout');
export const nutritionCache = createCacheNamespace('nutrition');
export const exerciseCache = createCacheNamespace('exercise');
export const analyticsCache = createCacheNamespace('analytics');
