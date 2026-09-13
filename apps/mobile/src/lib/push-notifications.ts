/**
 * Sistema de Notificaciones Push Web
 * Soporta notificaciones nativas del navegador y fallback a toast
 */

'use client';

import { useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// Tipos de notificaciones
export type NotificationType = 
  | 'workout-reminder'
  | 'meal-reminder'
  | 'coach-message'
  | 'achievement-unlocked'
  | 'checkin-due'
  | 'payment-due'
  | 'program-update'
  | 'challenge-invite';

export interface PushNotification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  timestamp: number;
}

// Verificar soporte de notificaciones
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

// Obtener estado de permiso
export function getNotificationPermission(): NotificationPermission {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  return Notification.permission;
}

// Solicitar permiso
export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

// Enviar notificación push nativa
export function sendNativeNotification(
  title: string,
  options?: NotificationOptions
): Notification | null {
  if (!isNotificationSupported()) {
    console.warn('Notificaciones no soportadas');
    return null;
  }

  if (Notification.permission !== 'granted') {
    console.warn('Permiso de notificaciones no concedido');
    return null;
  }

  try {
    return new Notification(title, {
      ...options,
      requireInteraction: false,
      silent: false,
    });
  } catch (error) {
    console.error('Error al enviar notificación:', error);
    return null;
  }
}

// Enviar notificación como toast (fallback)
export function sendToastNotification(
  title: string,
  description?: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info'
) {
  const toastOptions = {
    duration: 5000,
    position: 'top-right' as const,
  };

  switch (type) {
    case 'success':
      toast.success(title, { description, ...toastOptions });
      break;
    case 'error':
      toast.error(title, { description, ...toastOptions });
      break;
    case 'warning':
      toast.warning(title, { description, ...toastOptions });
      break;
    default:
      toast.info(title, { description, ...toastOptions });
  }
}

// Enviar notificación con fallback automático
export function sendSmartNotification(
  notification: PushNotification
): void {
  const { title, body, icon, type } = notification;

  // Intentar notificación nativa primero
  if (getNotificationPermission() === 'granted') {
    const native = sendNativeNotification(title, {
      body,
      icon: icon || '/icon-192.png',
      badge: '/icon-192.png',
      tag: notification.id,
      requireInteraction: false,
    });

    if (native) {
      // Auto cerrar después de 5 segundos
      setTimeout(() => native.close(), 5000);
      return;
    }
  }

  // Fallback a toast
  const toastType = type.includes('achievement') ? 'success' : 'info';
  sendToastNotification(title, body, toastType);
}

// Hook para manejar notificaciones
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(isNotificationSupported());
    if (isNotificationSupported()) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;
    
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermission('granted');
      // Suscribirse a topic en Firebase si está configurado
      await subscribeToTopics();
    }
    return granted;
  }, [isSupported]);

  const sendNotification = useCallback((notification: PushNotification) => {
    sendSmartNotification(notification);
  }, []);

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    isGranted: permission === 'granted',
    isDenied: permission === 'denied',
  };
}

// Suscribirse a topics de Firebase Cloud Messaging
async function subscribeToTopics() {
  // Implementación futura con Firebase
  console.log('Subscribiendo a topics de notificaciones...');
}

// Service Worker para notificaciones push
export function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('Service Workers no soportados');
    return Promise.resolve(null);
  }

  return navigator.serviceWorker.register('/sw.js', {
    scope: '/',
  }).catch((error) => {
    console.error('Error registrando Service Worker:', error);
    return null;
  });
}

// Manejar clicks en notificaciones
export function setupNotificationClickHandler() {
  if (!isNotificationSupported()) return;

  window.addEventListener('notificationclick', (event: any) => {
    event.notification.close();
    
    const url = event.notification.data?.url || '/dashboard';
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  });
}

// Notificaciones predefinidas por tipo
export const notificationTemplates: Record<NotificationType, { title: string; body: string }> = {
  'workout-reminder': {
    title: '⏰ Hora de entrenar',
    body: '¡Es momento de tu sesión de hoy! Vamos con todo 💪',
  },
  'meal-reminder': {
    title: '🍽️ Hora de comer',
    body: 'No olvides registrar tu comida y mantener tus macros',
  },
  'coach-message': {
    title: '💬 Nuevo mensaje de tu coach',
    body: 'Ezequiel te ha enviado un mensaje. ¡Revisalo!',
  },
  'achievement-unlocked': {
    title: '🏆 ¡Logro desbloqueado!',
    body: 'Felicitaciones por alcanzar una nueva meta',
  },
  'checkin-due': {
    title: '📋 Check-in semanal',
    body: 'Es hora de tu check-in. Completalo para ajustar tu plan',
  },
  'payment-due': {
    title: '💳 Pago pendiente',
    body: 'Tu suscripción vence pronto. Renová para continuar',
  },
  'program-update': {
    title: '📝 Programa actualizado',
    body: 'Tu entrenador ha actualizado tu programa de ejercicios',
  },
  'challenge-invite': {
    title: '🎯 Desafío especial',
    body: 'Has sido invitado a un nuevo desafío. ¡Aceptalo!',
  },
};

// Enviar notificación usando plantilla
export function sendTemplateNotification(
  type: NotificationType,
  customData?: Partial<PushNotification>
) {
  const template = notificationTemplates[type];
  
  sendSmartNotification({
    id: `${type}-${Date.now()}`,
    type,
    title: template.title,
    body: template.body,
    timestamp: Date.now(),
    ...customData,
  });
}

// Import React hooks
import { useState, useEffect, useCallback } from 'react';
