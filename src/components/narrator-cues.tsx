"use client";
import { useEffect, useRef } from "react";
import { playTrack, oncePerDay } from "@/lib/voice";

/** Narrador de racha: suena una vez por día si la racha viene en marcha. */
export function StreakVoice({ streak }: { streak: number }) {
  const doneRef = useRef(false);
  useEffect(() => {
    if (doneRef.current || streak < 2) return;
    doneRef.current = true;
    if (oncePerDay("racha")) playTrack("racha");
  }, [streak]);
  return null;
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
