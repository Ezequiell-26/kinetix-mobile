/**
 * Componente de Configuración de Notificaciones Push
 * Permite al usuario activar/desactivar notificaciones y gestionar preferencias
 */

'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { Bell, BellOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  isNotificationSupported,
  getNotificationPermission,
  requestNotificationPermission,
  usePushNotifications,
  NotificationType,
  notificationTemplates,
} from '@/lib/push-notifications';

interface NotificationPreferences {
  workoutReminder: boolean;
  mealReminder: boolean;
  coachMessage: boolean;
  achievementUnlocked: boolean;
  checkinDue: boolean;
  programUpdate: boolean;
  challengeInvite: boolean;
}

const defaultPreferences: NotificationPreferences = {
  workoutReminder: true,
  mealReminder: true,
  coachMessage: true,
  achievementUnlocked: true,
  checkinDue: true,
  programUpdate: true,
  challengeInvite: false,
};

export function PushNotificationSettings() {
  const { t } = useTranslation();
  const { isSupported, permission, requestPermission, isGranted } = usePushNotifications();
  
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [isRequesting, setIsRequesting] = useState(false);

  // Cargar preferencias guardadas
  useEffect(() => {
    const saved = localStorage.getItem('notification_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading notification preferences:', e);
      }
    }
  }, []);

  // Guardar preferencias
  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    localStorage.setItem('notification_preferences', JSON.stringify(newPrefs));
  };

  // Solicitar permiso
  const handleRequestPermission = async () => {
    setIsRequesting(true);
    try {
      await requestPermission();
    } finally {
      setIsRequesting(false);
    }
  };

  // Enviar notificación de prueba
  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🔔 Notificación de prueba', {
        body: '¡Las notificaciones están funcionando correctamente!',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-192.png',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isGranted ? (
              <Bell className="h-5 w-5 text-green-500" />
            ) : (
              <BellOff className="h-5 w-5 text-zinc-400" />
            )}
            <div>
              <CardTitle>Notificaciones Push</CardTitle>
              <p className="text-xs text-zinc-500 mt-1">
                Recibí recordatorios y actualizaciones en tu dispositivo
              </p>
            </div>
          </div>
          <Badge variant={isGranted ? 'default' : 'muted'}>
            {isGranted ? 'Activadas' : isSupported ? 'Desactivadas' : 'No soportadas'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estado del soporte */}
        {!isSupported && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-500">
            Tu navegador no soporta notificaciones push. Probá con Chrome, Firefox o Edge.
          </div>
        )}

        {/* Botón para solicitar permiso */}
        {!isGranted && isSupported && (
          <Button 
            onClick={handleRequestPermission} 
            disabled={isRequesting}
            className="w-full"
          >
            {permission === 'denied' ? 'Permiso denegado - Configurá manualmente' : 'Activar notificaciones'}
          </Button>
        )}

        {/* Preferencias de notificaciones */}
        {isGranted && (
          <>
            <div className="space-y-4">
              <h4 className="font-medium text-sm">Tipos de notificaciones</h4>
              
              <div className="space-y-3">
                <NotificationToggle
                  label="Recordatorio de entrenamiento"
                  description="Te avisa cuando es hora de entrenar"
                  enabled={preferences.workoutReminder}
                  onToggle={(v) => updatePreference('workoutReminder', v)}
                />
                
                <NotificationToggle
                  label="Recordatorio de comidas"
                  description="Te recuerda registrar tus comidas"
                  enabled={preferences.mealReminder}
                  onToggle={(v) => updatePreference('mealReminder', v)}
                />
                
                <NotificationToggle
                  label="Mensajes del coach"
                  description="Cuando tu coach te envía un mensaje"
                  enabled={preferences.coachMessage}
                  onToggle={(v) => updatePreference('coachMessage', v)}
                />
                
                <NotificationToggle
                  label="Logros desbloqueados"
                  description="Celebrá tus nuevas conquistas"
                  enabled={preferences.achievementUnlocked}
                  onToggle={(v) => updatePreference('achievementUnlocked', v)}
                />
                
                <NotificationToggle
                  label="Check-in pendiente"
                  description="Te recuerda completar tu check-in semanal"
                  enabled={preferences.checkinDue}
                  onToggle={(v) => updatePreference('checkinDue', v)}
                />
                
                <NotificationToggle
                  label="Actualización de programa"
                  description="Cuando tu plan de ejercicios cambia"
                  enabled={preferences.programUpdate}
                  onToggle={(v) => updatePreference('programUpdate', v)}
                />
                
                <NotificationToggle
                  label="Desafíos especiales"
                  description="Invitaciones a nuevos desafíos"
                  enabled={preferences.challengeInvite}
                  onToggle={(v) => updatePreference('challengeInvite', v)}
                />
              </div>
            </div>

            {/* Botón de prueba */}
            <div className="pt-4 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={sendTestNotification}
                className="w-full"
              >
                Enviar notificación de prueba
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Componente Toggle individual
interface NotificationToggleProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

function NotificationToggle({ label, description, enabled, onToggle }: NotificationToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
      <Switch
        checked={enabled}
        onCheckedChange={onToggle}
        aria-label={label}
      />
    </div>
  );
}

// Hook para verificar preferencias
export function useNotificationPreferences() {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultPreferences);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('notification_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading notification preferences:', e);
      }
    }
    setLoaded(true);
  }, []);

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    localStorage.setItem('notification_preferences', JSON.stringify(newPrefs));
  };

  return { preferences, updatePreference, loaded };
}

// Función para verificar si se debe mostrar una notificación
export function shouldShowNotification(type: NotificationType): boolean {
  if (typeof window === 'undefined') return false;
  
  const saved = localStorage.getItem('notification_preferences');
  if (!saved) return true; // Default: mostrar todas
  
  try {
    const prefs: NotificationPreferences = JSON.parse(saved);
    
    switch (type) {
      case 'workout-reminder':
        return prefs.workoutReminder;
      case 'meal-reminder':
        return prefs.mealReminder;
      case 'coach-message':
        return prefs.coachMessage;
      case 'achievement-unlocked':
        return prefs.achievementUnlocked;
      case 'checkin-due':
        return prefs.checkinDue;
      case 'program-update':
        return prefs.programUpdate;
      case 'challenge-invite':
        return prefs.challengeInvite;
      default:
        return true;
    }
  } catch {
    return true;
  }
}
