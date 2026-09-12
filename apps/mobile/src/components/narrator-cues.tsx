"use client";
import { useState, useEffect, useRef } from "react";
import { playTrack, oncePerDay } from "@/lib/voice";
import { CLIENT_TOUR_KEY } from "@/lib/tours";

/** Narrador de racha: suena una vez por día si la racha viene en marcha. */
export function StreakVoice({ streak }: { streak: number }) {
  const doneRef = useRef(false);
  useEffect(() => {
    if (doneRef.current || streak < 2) return;
    doneRef.current = true;
    // Si el tour de bienvenida aún no se vio, él tiene la palabra (sin pisarse).
    try {
      if (!localStorage.getItem(CLIENT_TOUR_KEY)) return;
    } catch {}
    if (oncePerDay("racha")) playTrack("racha");
  }, [streak]);
  return null;
}

/** Saludo según la hora: la app saluda distinto mañana, tarde y noche. */
export function TimeGreeting({ name }: { name: string }) {
  const [text, setText] = useState(`Hola, ${name}.`);
  useEffect(() => {
    const h = new Date().getHours();
    const g = h < 12 ? "Buen día" : h < 20 ? "Buenas tardes" : "Buenas noches";
    setText(`${g}, ${name}.`);
  }, [name]);
  return <>{text}</>;
}

/** Narrador de check-in: saluda una vez por día si hay check-in pendiente. */
export function CheckinVoice({ pending }: { pending: boolean }) {
  const doneRef = useRef(false);
  useEffect(() => {
    if (doneRef.current || !pending) return;
    doneRef.current = true;
    if (oncePerDay("checkin")) playTrack("checkin");
  }, [pending]);
  return null;
}
