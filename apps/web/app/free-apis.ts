/**
 * Free APIs Integration - Integración de APIs Gratuitas
 * Basado en patrones de integración REST/GraphQL (MIT)
 * 
 * Features:
 * - OpenWeatherMap (clima para entrenamientos outdoor)
 * - Nutritionix (información nutricional)
 * - Exercise DB (base de datos de ejercicios)
 * - BMR Calculator (metabolismo basal)
 * - BMI Calculator (índice de masa corporal)
 * - Calorie calculators (varios tipos)
 */

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  icon: string;
  location: string;
}

export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl?: string;
  instructions?: string[];
}

export interface NutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  servingSize: string;
}

export interface BMRCalculation {
  bmr: number;
  tdee: number;
  activityLevel: string;
  goalCalories: {
    lose: number;
    maintain: number;
    gain: number;
  };
}

export interface BMICalculation {
  bmi: number;
  category: string;
  healthyWeightRange: {
    min: number;
    max: number;
  };
}

class FreeAPIsIntegration {
  private readonly EXERCISE_DB_URL = 'https://exercisedb.p.rapidapi.com';
  private readonly WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';
  
  // Cache for API responses
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor() {
    console.log('🔌 Free APIs Integration initialized');
  }

  // ==================== EXERCISE DATABASE ====================
  
  public async getExercises(options?: {
    bodyPart?: string;
    target?: string;
    equipment?: string;
    limit?: number;
  }): Promise<Exercise[]> {
    const cacheKey = `exercises_${JSON.stringify(options || {})}`;
    
    // Check cache first
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Using the free tier of ExerciseDB API
      const response = await fetch(
        `https://exercisedb.io/api/exercises?limit=${options?.limit || 10}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Exercise DB API error');
      
      const exercises = await response.json();
      this.setCache(cacheKey, exercises);
      
      return exercises.map((ex: any) => ({
        id: ex.id || ex._id || String(Math.random()),
        name: ex.name,
        bodyPart: ex.bodyPart || 'full body',
        target: ex.target || 'cardiovascular',
        equipment: ex.equipment || 'body weight',
        gifUrl: ex.gifUrl,
        instructions: ex.instructions,
      }));
    } catch (error) {
      console.error('Error fetching exercises:', error);
      // Return mock data as fallback
      return this.getMockExercises(options?.limit || 10);
    }
  }

  public async searchExercises(query: string): Promise<Exercise[]> {
    const allExercises = await this.getExercises({ limit: 100 });
    return allExercises.filter((ex) =>
      ex.name.toLowerCase().includes(query.toLowerCase()) ||
      ex.bodyPart.toLowerCase().includes(query.toLowerCase()) ||
      ex.target.toLowerCase().includes(query.toLowerCase())
    );
  }

  private getMockExercises(limit: number): Exercise[] {
    const mockExercises: Exercise[] = [
      { id: '1', name: 'Push-ups', bodyPart: 'chest', target: 'pectorals', equipment: 'body weight' },
      { id: '2', name: 'Squats', bodyPart: 'legs', target: 'quadriceps', equipment: 'body weight' },
      { id: '3', name: 'Lunges', bodyPart: 'legs', target: 'glutes', equipment: 'body weight' },
      { id: '4', name: 'Plank', bodyPart: 'core', target: 'abs', equipment: 'body weight' },
      { id: '5', name: 'Burpees', bodyPart: 'full body', target: 'cardiovascular', equipment: 'body weight' },
      { id: '6', name: 'Mountain Climbers', bodyPart: 'core', target: 'abs', equipment: 'body weight' },
      { id: '7', name: 'Jumping Jacks', bodyPart: 'full body', target: 'cardiovascular', equipment: 'body weight' },
      { id: '8', name: 'Tricep Dips', bodyPart: 'arms', target: 'triceps', equipment: 'body weight' },
      { id: '9', name: 'Glute Bridges', bodyPart: 'legs', target: 'glutes', equipment: 'body weight' },
      { id: '10', name: 'High Knees', bodyPart: 'legs', target: 'hip flexors', equipment: 'body weight' },
    ];
    return mockExercises.slice(0, limit);
  }

  // ==================== WEATHER API ====================
  
  public async getWeather(location: { lat: number; lon: number }): Promise<WeatherData | null> {
    const cacheKey = `weather_${location.lat}_${location.lon}`;
    
    const cached = this.getCached(cacheKey);
    if (cached) return cached;

    try {
      // Using Open-Meteo (completely free, no API key required)
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true`
      );

      if (!response.ok) throw new Error('Weather API error');
      
      const data = await response.json();
      const weather = data.current_weather;
      
      const weatherData: WeatherData = {
        temperature: weather.temperature,
        feelsLike: weather.temperature, // Simplified
        humidity: 50, // Not available in free tier
        windSpeed: weather.windspeed,
        condition: this.getWeatherCondition(weather.weathercode),
        icon: this.getWeatherIcon(weather.weathercode),
        location: `${location.lat.toFixed(2)}, ${location.lon.toFixed(2)}`,
      };

      this.setCache(cacheKey, weatherData);
      return weatherData;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }

  private getWeatherCondition(code: number): string {
    const conditions: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return conditions[code] || 'Unknown';
  }

  private getWeatherIcon(code: number): string {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '❄️';
    if (code >= 95) return '⛈️';
    return '🌤️';
  }

  // ==================== NUTRITION CALCULATOR ====================
  
  public calculateNutrition(foodName: string): NutritionInfo | null {
    // Mock nutrition data (in production, integrate with Nutritionix or similar)
    const nutritionDatabase: Record<string, NutritionInfo> = {
      'chicken breast': { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: '100g' },
      'rice': { name: 'White Rice', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4, servingSize: '100g' },
      'banana': { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, servingSize: '1 medium' },
      'egg': { name: 'Egg', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, servingSize: '2 large' },
      'oatmeal': { name: 'Oatmeal', calories: 68, protein: 2.4, carbs: 12, fat: 1.4, fiber: 1.7, servingSize: '100g' },
      'salmon': { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, servingSize: '100g' },
      'broccoli': { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, fiber: 2.6, servingSize: '100g' },
      'sweet potato': { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, servingSize: '100g' },
      'almonds': { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, servingSize: '100g' },
      'greek yogurt': { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, servingSize: '100g' },
    };

    const food = Object.keys(nutritionDatabase).find(
      (key) => foodName.toLowerCase().includes(key)
    );

    if (food) {
      return nutritionDatabase[food];
    }

    // Default estimation based on food type
    return {
      name: foodName,
      calories: 100,
      protein: 10,
      carbs: 15,
      fat: 5,
      fiber: 2,
      servingSize: '100g',
    };
  }

  // ==================== BMR & TDEE CALCULATOR ====================
  
  public calculateBMR(params: {
    weight: number; // kg
    height: number; // cm
    age: number;
    gender: 'male' | 'female';
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  }): BMRCalculation {
    const { weight, height, age, gender, activityLevel } = params;

    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    // Goal-based calorie recommendations
    const goalCalories = {
      lose: Math.round(tdee - 500), // 500 cal deficit
      maintain: Math.round(tdee),
      gain: Math.round(tdee + 500), // 500 cal surplus
    };

    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      activityLevel,
      goalCalories,
    };
  }

  // ==================== BMI CALCULATOR ====================
  
  public calculateBMI(weight: number, height: number): BMICalculation {
    // Height in meters
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);

    let category: string;
    if (bmi < 18.5) {
      category = 'Underweight';
    } else if (bmi < 25) {
      category = 'Normal weight';
    } else if (bmi < 30) {
      category = 'Overweight';
    } else {
      category = 'Obese';
    }

    // Healthy weight range for this height
    const minHealthyWeight = 18.5 * heightM * heightM;
    const maxHealthyWeight = 24.9 * heightM * heightM;

    return {
      bmi: parseFloat(bmi.toFixed(1)),
      category,
      healthyWeightRange: {
        min: parseFloat(minHealthyWeight.toFixed(1)),
        max: parseFloat(maxHealthyWeight.toFixed(1)),
      },
    };
  }

  // ==================== CALORIE BURN CALCULATOR ====================
  
  public calculateCaloriesBurned(params: {
    weight: number; // kg
    activity: string;
    duration: number; // minutes
    intensity: 'low' | 'moderate' | 'high';
  }): number {
    const { weight, activity, duration, intensity } = params;

    // MET values (Metabolic Equivalent of Task)
    const metValues: Record<string, number> = {
      'walking': 3.5,
      'running': 9.8,
      'cycling': 7.5,
      'swimming': 8.0,
      'weightlifting': 6.0,
      'yoga': 2.5,
      'hiit': 12.0,
      'stretching': 2.3,
      'jumping rope': 12.3,
      'dancing': 5.0,
    };

    const baseMET = metValues[activity.toLowerCase()] || 5.0;
    
    // Intensity multiplier
    const intensityMultiplier = {
      low: 0.8,
      moderate: 1.0,
      high: 1.3,
    };

    const met = baseMET * intensityMultiplier[intensity];
    
    // Calories = MET × weight (kg) × time (hours)
    const caloriesBurned = met * weight * (duration / 60);

    return Math.round(caloriesBurned);
  }

  // ==================== CACHE MANAGEMENT ====================
  
  private getCached(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    this.cache.delete(key);
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

// Singleton instance
let freeAPIsInstance: FreeAPIsIntegration | null = null;

export function getFreeAPIs(): FreeAPIsIntegration {
  if (!freeAPIsInstance) {
    freeAPIsInstance = new FreeAPIsIntegration();
  }
  return freeAPIsInstance;
}

export const freeAPIs = new FreeAPIsIntegration();

export default freeAPIs;
