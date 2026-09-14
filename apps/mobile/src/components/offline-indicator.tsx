"use client";
import { useEffect, useState } from "react";
export function OfflineIndicator(){
  const [offline,setOffline]=useState(false);
  useEffect(()=>{
    const on = ()=>setOffline(!navigator.onLine);
    on();
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return ()=>{ window.removeEventListener("online", on); window.removeEventListener("offline", on); };
  },[]);
  if(!offline) return null;
  return (
    <div className="fixed top-[60px] left-0 right-0 z-40 bg-amber-500 text-black text-center py-2 px-3 text-xs font-bold">
      Sin conexión — modo offline activo. Tus series se guardarán y sincronizarán luego.
    </div>
  );
}
