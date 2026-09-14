import type { TourStep } from "@/components/guided-tour";

/**
 * Guiones del tour guiado. Cada paso habla con voz del sistema (tts)
 * hasta que llegue la grabación del narrador (track).
 */

export const CLIENT_TOUR_KEY = "ec-tour-v1-client";
export const TRAINER_TOUR_KEY = "ec-tour-v1-trainer";

export const CLIENT_TOUR: TourStep[] = [
  {
    title: "Bienvenido a tu equipo",
    text: "Soy tu coach de voz. Te muestro tu app en 30 segundos. Puedes saltar el tour cuando quieras.",
    tts: "Bienvenido a KinetixFitt. Soy tu coach de voz. Te muestro tu app en treinta segundos. Puedes saltar cuando quieras.",
  },
  {
    target: '[data-tour="entreno-hoy"]',
    title: "Tu entreno de hoy",
    text: "Acá vive tu sesión del día. Tocás comenzar y yo te acompaño serie por serie con mi voz.",
    tts: "Aquí está tu entrenamiento de hoy. Presiona comenzar y yo te acompaño serie por serie.",
  },
  {
    target: 'nav[aria-label="Navegación principal"] a[href="/client/workout"]',
    title: "Entrenar",
    text: "Este botón es tu casa: tus semanas, tus sesiones y tus cronómetros.",
    tts: "Este botón es tu casa: tus semanas, tus sesiones y tus cronómetros.",
  },
  {
    target: 'nav[aria-label="Navegación principal"] a[href="/client/progress"]',
    title: "Tu progreso",
    text: "Peso, marcas, fotos y racha. Todo lo que subas lo ve tu coach.",
    tts: "En progreso ves tu peso, tus marcas y tus fotos. Todo lo que subas, tu coach lo ve.",
  },
  {
    target: 'a[href="/client/checkins"]',
    title: "Check-in semanal",
    text: "Una vez por semana contame cómo venís. Es la base de tu plan.",
    tts: "Cada semana contame cómo venís en el check-in. Es la base de tu plan.",
  },
  {
    target: 'a[href="/client/messages"]',
    title: "Hablá con tu coach",
    text: "Mensaje directo con tu entrenador. Responde cada check-in personalmente.",
    tts: "Habla con tu coach cuando quieras. Y mi voz te guía en cada entreno.",
  },
  {
    title: "Listo, a entrenar",
    text: "Eso es todo. Tu primera serie te espera. Nos vemos ahí.",
    tts: "Listo. A entrenar. Nos vemos en tu primera serie.",
  },
];

export const TRAINER_TOUR: TourStep[] = [
  {
    title: "Tu centro de control",
    text: "Bienvenido a tu panel. Acá controlás todo tu negocio en un vistazo. Te lo muestro.",
    tts: "Bienvenido a tu panel. Acá controlás todo tu negocio en un vistazo.",
  },
  {
    target: '[data-tour="kpis"]',
    title: "Tus números",
    text: "Clientes activos, check-ins pendientes, entrenos de hoy y mensajes. Si algo pide atención, se ilumina.",
    tts: "Acá ves lo que necesita tu atención: check-ins, mensajes y clientes en riesgo.",
  },
  {
    target: '[data-tour="atencion"]',
    title: "Atención necesaria",
    text: "Tu lista priorizada: quién necesita respuesta hoy. Tocás y vas directo.",
    tts: "Tu lista priorizada: quién necesita respuesta hoy. Tocas y vas directo.",
  },
  {
    target: '[data-tour="clientes"]',
    title: "Tus clientes",
    text: "Cada ficha tiene progreso, programa, check-ins y notas privadas.",
    tts: "Cada cliente tiene su ficha completa: progreso, programa y check-ins.",
  },
  {
    target: 'a[href="/trainer/workouts"]',
    title: "Crear rutinas",
    text: "Acá nacen los programas. Los creás una vez y se los asignás a quien quieras.",
    tts: "Acá creás rutinas y programas, y se los asignás a tus clientes.",
  },
  {
    title: "Tu app está viva",
    text: "Cada dato que cargues mueve todo: rachas, avisos y progreso. A dirigir.",
    tts: "Tu app está viva. Cada dato que cargues mueve todo el sistema.",
  },
];
