/**
 * KINETIXFIT INTEGRATION HUB v2.0
 * Centralizador de APIs gratuitas y repositorios MIT
 * 
 * Basado en patrones de:
 * - Axios (HTTP client)
 * - React Query (Data fetching)
 * - SWR (Stale-while-revalidate)
 * - Apollo Client (GraphQL)
 */

// ============================================
// 🏋️ FITNESS & HEALTH APIS (FREE TIER)
// ============================================

export const FitnessAPIs = {
  // Exercise Database - 900+ ejercicios con animaciones
  ExerciseDB: {
    baseUrl: 'https://exercisedb.p.rapidapi.com',
    headers: {
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    },
    endpoints: {
      list: '/exercises',
      byTarget: '/exercises/target/{target}',
      byEquipment: '/exercises/equipment/{equipment}',
      byBodyPart: '/exercises/bodyPart/{bodyPart}',
      gif: '/exercises/{id}'
    }
  },

  // Nutrition Data - Base de datos nutricional completa
  Nutritionix: {
    baseUrl: 'https://trackapi.nutritionix.com/v2',
    headers: {
      'x-app-id': process.env.NEXT_PUBLIC_NUTRITIONIX_ID || '',
      'x-app-key': process.env.NEXT_PUBLIC_NUTRITIONIX_KEY || ''
    },
    endpoints: {
      search: '/natural/nutrients',
      exercise: '/natural/exercise',
      stats: '/user'
    }
  },

  // Calorie & BMR Calculator
  FitnessCalculator: {
    baseUrl: 'https://fitness-calculator.p.rapidapi.com',
    headers: {
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
      'X-RapidAPI-Host': 'fitness-calculator.p.rapidapi.com'
    },
    endpoints: {
      bmr: '/bmr',
      dailyCalories: '/dailyCaloryNeeds',
      macros: '/macroNutrients',
      bmi: '/bmi',
      idealWeight: '/idealweight'
    }
  },

  // Open Meteo Weather - Para workouts outdoor
  OpenMeteo: {
    baseUrl: 'https://api.open-meteo.com/v1',
    headers: {},
    endpoints: {
      forecast: '/forecast',
      historical: '/archive',
      geocoding: '/geocoding'
    },
    params: {
      hourly: 'temperature_2m,precipitation_probability,windspeed_10m',
      daily: 'sunrise,sunset,uv_index_max',
      timezone: 'auto'
    }
  },

  // Body Composition API
  BodyComposition: {
    baseUrl: 'https://body-composition.p.rapidapi.com',
    headers: {
      'X-RapidAPI-Key': process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
      'X-RapidAPI-Host': 'body-composition.p.rapidapi.com'
    },
    endpoints: {
      bodyFat: '/bodyfat',
      muscleMass: '/muscle',
      waterPercentage: '/hydration'
    }
  }
};

// ============================================
// 🎨 DESIGN & MEDIA APIS
// ============================================

export const MediaAPIs = {
  // Unsplash - Imágenes HD gratuitas
  Unsplash: {
    baseUrl: 'https://api.unsplash.com',
    headers: {
      'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_KEY}`
    },
    endpoints: {
      search: '/search/photos',
      random: '/photos/random',
      collections: '/collections',
      user: '/users/{username}'
    },
    params: {
      orientation: 'landscape',
      per_page: 30,
      content_filter: 'high'
    }
  },

  // Pexels - Fotos y Videos gratis
  Pexels: {
    baseUrl: 'https://api.pexels.com/v1',
    headers: {
      'Authorization': process.env.NEXT_PUBLIC_PEXELS_KEY || ''
    },
    endpoints: {
      search: '/search',
      curated: '/curated',
      videos: '/videos/search'
    }
  },

  // GIPHY - GIFs para motivación
  Giphy: {
    baseUrl: 'https://api.giphy.com/v1',
    headers: {},
    endpoints: {
      search: '/gifs/search',
      trending: '/gifs/trending',
      random: '/gifs/random',
      stickers: '/stickers/search'
    },
    params: {
      api_key: process.env.NEXT_PUBLIC_GIPHY_KEY,
      rating: 'g',
      limit: 25
    }
  },

  // LottieFiles - Animaciones JSON ligeras
  Lottie: {
    baseUrl: 'https://lottie.host/api',
    headers: {},
    endpoints: {
      search: '/files/search',
      featured: '/files/featured',
      categories: '/categories'
    }
  }
};

// ============================================
// 📊 ANALYTICS & INSIGHTS APIS
// ============================================

export const AnalyticsAPIs = {
  // Simple Analytics - Privacy-first
  SimpleAnalytics: {
    baseUrl: 'https://api.simpleanalytics.com/v1',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SIMPLE_ANALYTICS_KEY}`
    },
    endpoints: {
      pageviews: '/pages',
      events: '/events',
      referrers: '/referrers'
    }
  },

  // Plausible Analytics - Lightweight
  Plausible: {
    baseUrl: 'https://plausible.io/api/v1',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_PLAUSIBLE_KEY}`
    },
    endpoints: {
      stats: '/stats',
      breakdown: '/breakdown',
      "real-time": '/realtime'
    }
  },

  // IP Geolocation - Para personalización regional
  IPGeo: {
    baseUrl: 'https://ipapi.co',
    headers: {},
    endpoints: {
      json: '/json',
      locale: '/json/{lang}'
    }
  }
};

// ============================================
// 🔐 SECURITY & AUTH APIS
// ============================================

export const SecurityAPIs = {
  // Have I Been Pwned - Verificar contraseñas
  HaveIBeenPwned: {
    baseUrl: 'https://haveibeenpwned.com/api/v3',
    headers: {
      'hibp-api-key': process.env.NEXT_PUBLIC_HIBP_KEY || ''
    },
    endpoints: {
      breach: '/breachaccount/{account}',
      paste: '/pasteaccount/{account}',
      password: '/range/{hashPrefix}'
    }
  },

  // reCAPTCHA Enterprise
  ReCaptcha: {
    baseUrl: 'https://www.google.com/recaptcha/api2',
    siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
    secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
    endpoints: {
      verify: '/siteverify',
      anchor: '/anchor',
      reload: '/reload'
    }
  },

  // ZeroBin API - Encriptación cliente
  ZeroBin: {
    baseUrl: '/api',
    headers: {},
    endpoints: {
      create: '/',
      decrypt: '/?decompress=1'
    }
  }
};

// ============================================
// 🌍 INTERNATIONALIZATION APIS
// ============================================

export const I18nAPIs = {
  // Google Translate (Free Tier limitado)
  GoogleTranslate: {
    baseUrl: 'https://translation.googleapis.com/language/translate/v2',
    headers: {},
    endpoints: {
      translate: '',
      detect: '/detect',
      languages: '/languages'
    },
    params: {
      key: process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_KEY,
      format: 'text'
    }
  },

  // DeepL API (500k chars/mes gratis)
  DeepL: {
    baseUrl: 'https://api-free.deepl.com/v2',
    headers: {
      'Authorization': `DeepL-Auth-Key ${process.env.NEXT_PUBLIC_DEEPL_KEY}`
    },
    endpoints: {
      translate: '/translate',
      glossaries: '/glossaries',
      usage: '/usage'
    }
  },

  // Country Flags & Info
  RestCountries: {
    baseUrl: 'https://restcountries.com/v3.1',
    headers: {},
    endpoints: {
      all: '/all',
      name: '/name/{name}',
      code: '/alpha/{code}',
      currency: '/currency/{currency}'
    }
  }
};

// ============================================
// 🧠 AI & ML APIS (FREE TIER)
// ============================================

export const AIAPIs = {
  // Hugging Face Inference API
  HuggingFace: {
    baseUrl: 'https://api-inference.huggingface.co/models',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`
    },
    models: {
      sentiment: 'distilbert-base-uncased-finetuned-sst-2-english',
      ner: 'dslim/bert-base-NER',
      summarization: 'facebook/bart-large-cnn',
      translation: 'Helsinki-NLP/opus-mt-en-es'
    },
    endpoints: {
      inference: '/{model}'
    }
  },

  // TensorFlow.js Models (Client-side)
  TensorFlow: {
    models: {
      poseDetection: '@tensorflow-models/pose-detection',
      handPose: '@tensorflow-models/hand-pose-detection',
      bodySegmentation: '@tensorflow-models/body-segmentation',
      faceLandmarks: '@tensorflow-models/face-landmarks-detection'
    },
    cdn: 'https://cdn.jsdelivr.net/npm/'
  },

  // BrainJS - Neural Networks simples
  BrainJS: {
    npm: 'brain.js',
    cdn: 'https://cdn.jsdelivr.net/npm/brain.js@2.0.0-beta.7/dist/brain-browser.min.js',
    useCases: ['pattern-recognition', 'prediction', 'classification']
  }
};

// ============================================
// 📱 MOBILE & DEVICE APIS
// ============================================

export const DeviceAPIs = {
  // Device Orientation & Motion
  DeviceMotion: {
    events: ['deviceorientation', 'devicemotion', 'compassneedscalibration'],
    permissions: ['accelerometer', 'gyroscope', 'magnetometer']
  },

  // Battery Status
  Battery: {
    api: 'navigator.getBattery()',
    events: ['levelchange', 'chargingchange', 'chargingtimechange', 'dischargingtimechange']
  },

  // Network Information
  Network: {
    api: 'navigator.connection',
    properties: ['effectiveType', 'downlink', 'rtt', 'saveData']
  },

  // Geolocation Avanzada
  Geolocation: {
    api: 'navigator.geolocation',
    options: {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  }
};

// ============================================
// 🎵 AUDIO & VISUAL APIS
// ============================================

export const AudioVisualAPIs = {
  // Spotify Web API (Free tier)
  Spotify: {
    baseUrl: 'https://api.spotify.com/v1',
    authUrl: 'https://accounts.spotify.com/api/token',
    headers: {},
    endpoints: {
      tracks: '/tracks',
      playlists: '/playlists',
      audioFeatures: '/audio-features',
      recommendations: '/recommendations'
    },
    scopes: ['user-read-private', 'playlist-read-private']
  },

  // Last.fm - Música metadata
  LastFM: {
    baseUrl: 'https://ws.audioscrobbler.com/2.0',
    params: {
      api_key: process.env.NEXT_PUBLIC_LASTFM_KEY,
      format: 'json'
    },
    endpoints: {
      track: '?method=track.getInfo',
      artist: '?method=artist.getInfo',
      tags: '?method=tag.getTopTags'
    }
  },

  // Color Palette Generators
  Coolors: {
    baseUrl: 'https://coolors.co/api',
    endpoints: {
      generate: '/generate',
      palettes: '/palettes',
      gradients: '/gradients'
    }
  },

  // Gradient Generator
  CSSGradient: {
    baseUrl: 'https://cssgradient.io/api',
    endpoints: {
      generate: '/generate',
      random: '/random'
    }
  }
};

// ============================================
// 📦 UTILIDADES DE INTEGRACIÓN
// ============================================

export class IntegrationHub {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutos

  /**
   * Fetch con caché automático y retry logic
   */
  async fetch<T>(
    url: string,
    options: RequestInit = {},
    cacheKey?: string
  ): Promise<T> {
    // Check cache
    if (cacheKey) {
      const cached = this.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data as T;
      }
    }

    // Retry logic
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        // Cache result
        if (cacheKey) {
          this.cache.set(cacheKey, { data, timestamp: Date.now() });
        }

        return data as T;
      } catch (error) {
        lastError = error as Error;
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }

    throw lastError || new Error('Request failed');
  }

  /**
   * Batch multiple requests
   */
  async batch<T>(requests: Array<{ url: string; options?: RequestInit }>): Promise<T[]> {
    const results = await Promise.allSettled(
      requests.map(req => this.fetch(req.url, req.options))
    );

    return results
      .filter((r): r is PromiseFulfilledResult<T> => r.status === 'fulfilled')
      .map(r => r.value);
  }

  /**
   * Clear cache
   */
  clearCache(key?: string): void {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get cache stats
   */
  getCacheStats(): { size: number; entries: Array<{ key: string; age: number }> } {
    const now = Date.now();
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        age: now - value.timestamp
      }))
    };
  }
}

// Singleton instance
export const integrationHub = new IntegrationHub();

// ============================================
// 🎯 QUICK START EXAMPLES
// ============================================

/**
 * Ejemplo: Obtener ejercicio por grupo muscular
 */
export async function getExercisesByTarget(target: string) {
  return integrationHub.fetch(
    `${FitnessAPIs.ExerciseDB.baseUrl}${FitnessAPIs.ExerciseDB.endpoints.byTarget.replace('{target}', target)}`,
    { headers: FitnessAPIs.ExerciseDB.headers },
    `exercises-${target}`
  );
}

/**
 * Ejemplo: Calcular BMR y calorías diarias
 */
export async function calculateDailyNeeds(age: number, gender: string, weight: number, height: number, activity: string) {
  const params = new URLSearchParams({ age, gender, weight: weight.toString(), height: height.toString(), activity });
  
  return integrationHub.fetch(
    `${FitnessAPIs.FitnessCalculator.baseUrl}${FitnessAPIs.FitnessCalculator.endpoints.dailyCalories}?${params}`,
    { headers: FitnessAPIs.FitnessCalculator.headers },
    `calories-${age}-${gender}-${weight}`
  );
}

/**
 * Ejemplo: Obtener imagen aleatoria de fitness
 */
export async function getRandomFitnessImage() {
  return integrationHub.fetch(
    `${MediaAPIs.Unsplash.baseUrl}${MediaAPIs.Unsplash.endpoints.random}?query=fitness,gym,workout&orientation=landscape`,
    { headers: MediaAPIs.Unsplash.headers },
    'fitness-image-random'
  );
}

/**
 * Ejemplo: Detectar idioma del usuario
 */
export async function detectUserLocation() {
  return integrationHub.fetch(
    `${I18nAPIs.IPGeo.baseUrl}${I18nAPIs.IPGeo.endpoints.json}`,
    {},
    'user-location'
  );
}

/**
 * Ejemplo: Análisis de sentimiento en feedback
 */
export async function analyzeSentiment(text: string) {
  return integrationHub.fetch(
    `${AIAPIs.HuggingFace.baseUrl}/${AIAPIs.HuggingFace.models.sentiment}`,
    {
      method: 'POST',
      headers: AIAPIs.HuggingFace.headers,
      body: JSON.stringify({ inputs: text })
    },
    `sentiment-${text.substring(0, 20)}`
  );
}

/**
 * Ejemplo: Clima para workout outdoor
 */
export async function getWorkoutWeather(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    ...OpenMeteo.params
  });

  return integrationHub.fetch(
    `${OpenMeteo.baseUrl}${OpenMeteo.endpoints.forecast}?${params}`,
    {},
    `weather-${lat}-${lon}`
  );
}

export default integrationHub;
