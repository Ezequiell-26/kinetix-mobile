"use client";

import * as React from "react";
import { Activity, TrendingUp, Zap, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface WearableData {
  steps?: number;
  distance?: number; // km
  calories?: number;
  heartRate?: number; // bpm
  sleepHours?: number;
  activeMinutes?: number;
  floors?: number;
}

interface WearableSyncProps {
  provider: 'apple-health' | 'google-fit' | 'garmin' | 'fitbit' | 'polar';
  isConnected: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onDataSync?: (data: WearableData) => void;
  lastSync?: Date;
}

export function WearableSync({
  provider,
  isConnected,
  onConnect,
  onDisconnect,
  onDataSync,
  lastSync,
}: WearableSyncProps) {
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [wearableData, setWearableData] = React.useState<WearableData | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const providerConfig = {
    'apple-health': {
      name: 'Apple Health',
      color: 'bg-red-500',
      icon: '🍎',
    },
    'google-fit': {
      name: 'Google Fit',
      color: 'bg-blue-500',
      icon: '🔵',
    },
    garmin: {
      name: 'Garmin Connect',
      color: 'bg-cyan-600',
      icon: '⌚',
    },
    fitbit: {
      name: 'Fitbit',
      color: 'bg-teal-500',
      icon: '📊',
    },
    polar: {
      name: 'Polar Flow',
      color: 'bg-red-600',
      icon: '❤️',
    },
  };

  const config = providerConfig[provider];

  const handleConnect = async () => {
    if (!onConnect) {
      // Simulación de conexión
      await simulateConnection();
      return;
    }

    try {
      setIsSyncing(true);
      await onConnect();
      await fetchWearableData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDisconnect = async () => {
    if (onDisconnect) {
      await onDisconnect();
    }
    setWearableData(null);
    setError(null);
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setError(null);
    
    try {
      await fetchWearableData();
      
      if (wearableData && onDataSync) {
        onDataSync(wearableData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al sincronizar');
    } finally {
      setIsSyncing(false);
    }
  };

  const simulateConnection = async () => {
    // Simular proceso de conexión OAuth
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // En producción, esto sería una llamada real a la API del wearable
    const mockData: WearableData = {
      steps: Math.floor(Math.random() * 15000) + 5000,
      distance: +(Math.random() * 15 + 3).toFixed(2),
      calories: Math.floor(Math.random() * 1000) + 1800,
      heartRate: Math.floor(Math.random() * 40) + 60,
      sleepHours: +(Math.random() * 3 + 6).toFixed(1),
      activeMinutes: Math.floor(Math.random() * 120) + 30,
      floors: Math.floor(Math.random() * 20) + 5,
    };
    
    setWearableData(mockData);
  };

  const fetchWearableData = async () => {
    // Simulación - en producción llamar API real del wearable
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData: WearableData = {
      steps: Math.floor(Math.random() * 15000) + 5000,
      distance: +(Math.random() * 15 + 3).toFixed(2),
      calories: Math.floor(Math.random() * 1000) + 1800,
      heartRate: Math.floor(Math.random() * 40) + 60,
      sleepHours: +(Math.random() * 3 + 6).toFixed(1),
      activeMinutes: Math.floor(Math.random() * 120) + 30,
      floors: Math.floor(Math.random() * 20) + 5,
    };
    
    setWearableData(mockData);
  };

  const getStepGoal = () => 10000;
  const getCaloriesGoal = () => 2500;
  const getActiveMinutesGoal = () => 60;
  const getSleepGoal = () => 8;

  const stepProgress = wearableData?.steps 
    ? Math.min((wearableData.steps / getStepGoal()) * 100, 100) 
    : 0;
  
  const caloriesProgress = wearableData?.calories
    ? Math.min((wearableData.calories / getCaloriesGoal()) * 100, 100)
    : 0;
  
  const activeMinutesProgress = wearableData?.activeMinutes
    ? Math.min((wearableData.activeMinutes / getActiveMinutesGoal()) * 100, 100)
    : 0;
  
  const sleepProgress = wearableData?.sleepHours
    ? Math.min((wearableData.sleepHours / getSleepGoal()) * 100, 100)
    : 0;

  if (!isConnected) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.icon}</span>
              <div>
                <CardTitle className="text-lg">{config.name}</CardTitle>
                <p className="text-xs text-zinc-500 mt-1">Conecta tu dispositivo wearable</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <button
            onClick={handleConnect}
            disabled={isSyncing}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${config.color} hover:opacity-90 disabled:opacity-50`}
          >
            {isSyncing ? 'Conectando...' : `Conectar con ${config.name}`}
          </button>
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Se te redirigirá para autorizar el acceso a tus datos de salud
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <div>
              <CardTitle className="text-lg">{config.name}</CardTitle>
              <p className="text-xs text-zinc-500 mt-1">
                {lastSync 
                  ? `Sincronizado: ${lastSync.toLocaleTimeString()}`
                  : 'Conectado'}
              </p>
            </div>
          </div>
          <Badge variant={isSyncing ? "muted" : "default"}>
            {isSyncing ? 'Sincronizando' : 'Conectado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
            {error}
          </div>
        )}

        {wearableData && (
          <>
            {/* Steps */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span>Pasos</span>
                </div>
                <span className="font-medium">
                  {wearableData.steps?.toLocaleString()} / {getStepGoal().toLocaleString()}
                </span>
              </div>
              <Progress value={stepProgress} className="h-2" />
            </div>

            {/* Calories */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span>Calorías Activas</span>
                </div>
                <span className="font-medium">
                  {wearableData.calories?.toLocaleString()} / {getCaloriesGoal().toLocaleString()}
                </span>
              </div>
              <Progress value={caloriesProgress} className="h-2" />
            </div>

            {/* Active Minutes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  <span>Minutos Activos</span>
                </div>
                <span className="font-medium">
                  {wearableData.activeMinutes} / {getActiveMinutesGoal()} min
                </span>
              </div>
              <Progress value={activeMinutesProgress} className="h-2" />
            </div>

            {/* Sleep */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-purple-500" />
                  <span>Sueño</span>
                </div>
                <span className="font-medium">
                  {wearableData.sleepHours} / {getSleepGoal()} hrs
                </span>
              </div>
              <Progress value={sleepProgress} className="h-2" />
            </div>

            {/* Additional Stats Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Distancia</p>
                <p className="text-lg font-semibold">{wearableData.distance} km</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Ritmo Cardíaco</p>
                <p className="text-lg font-semibold">{wearableData.heartRate} bpm</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Pisos</p>
                <p className="text-lg font-semibold">{wearableData.floors}</p>
              </div>
            </div>
          </>
        )}

        {/* Sync Button */}
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="w-full py-2 px-4 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <svg
            className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          {isSyncing ? 'Sincronizando...' : 'Sincronizar Ahora'}
        </button>

        {/* Disconnect */}
        <button
          onClick={handleDisconnect}
          className="w-full py-2 text-sm text-destructive hover:text-destructive/80 transition-colors"
        >
          Desconectar {config.name}
        </button>
      </CardContent>
    </Card>
  );
}

// Hook para manejar múltiples wearables
export function useWearableSync() {
  const [connectedProviders, setConnectedProviders] = React.useState<Array<'apple-health' | 'google-fit' | 'garmin' | 'fitbit' | 'polar'>>([]);
  const [lastSyncDates, setLastSyncDates] = React.useState<Record<string, Date>>({});
  const [aggregatedData, setAggregatedData] = React.useState<WearableData | null>(null);

  const connectProvider = async (provider: 'apple-health' | 'google-fit' | 'garmin' | 'fitbit' | 'polar') => {
    // Simulación de conexión OAuth
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnectedProviders(prev => [...prev, provider]);
    setLastSyncDates(prev => ({ ...prev, [provider]: new Date() }));
  };

  const disconnectProvider = async (provider: string) => {
    setConnectedProviders(prev => prev.filter(p => p !== provider));
    setLastSyncDates(prev => {
      const updated = { ...prev };
      delete updated[provider];
      return updated;
    });
  };

  const aggregateData = (dataSources: WearableData[]): WearableData => {
    if (dataSources.length === 0) return {};
    
    return {
      steps: Math.max(...dataSources.map(d => d.steps || 0)),
      distance: Math.max(...dataSources.map(d => d.distance || 0)),
      calories: Math.max(...dataSources.map(d => d.calories || 0)),
      heartRate: dataSources.map(d => d.heartRate || 0).reduce((a, b) => a + b, 0) / dataSources.length,
      sleepHours: Math.max(...dataSources.map(d => d.sleepHours || 0)),
      activeMinutes: Math.max(...dataSources.map(d => d.activeMinutes || 0)),
      floors: Math.max(...dataSources.map(d => d.floors || 0)),
    };
  };

  return {
    connectedProviders,
    lastSyncDates,
    aggregatedData,
    connectProvider,
    disconnectProvider,
    aggregateData,
  };
}
