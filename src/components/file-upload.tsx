"use client";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export function FileUpload({ type="progress", onUploaded, accept="image/*", label="Arrastrá fotos acá o elegí archivos" }:{type?:string; onUploaded?:(url:string)=>void; accept?:string; label?:string}){
  const [uploading,setUploading]=useState(false);
  const [preview,setPreview]=useState<string|null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File){
    if(!file) return;
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);
    const res = await fetch("/api/uploads",{method:"POST", body: form});
    const data = await res.json();
    if(res.ok && data.url){
      setPreview(data.url);
      onUploaded?.(data.url);
    } else {
      alert(data.error || "Error al subir");
    }
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <div
        onDragOver={e=>e.preventDefault()}
        onDrop={e=>{e.preventDefault(); const f=e.dataTransfer.files[0]; if(f) handleFile(f);}}
        onClick={()=>inputRef.current?.click()}
        className="border-2 border-dashed border-zinc-800 rounded-xl p-6 text-center text-sm text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900/30 cursor-pointer transition"
      >
        {preview ? (
          <div className="space-y-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="preview" className="w-24 h-24 object-cover rounded-xl mx-auto border border-zinc-800" />
            <p className="text-xs text-emerald-400">✓ Subido</p>
          </div>
        ) : (
          <>
            <p>{uploading ? "Subiendo..." : label}</p>
            <p className="text-xs mt-1">Privadas • solo vos y Ezequiel • máx 5MB</p>
          </>
        )}
      </div>
      <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e=>{const f=e.target.files?.[0]; if(f) handleFile(f);}} />
      {preview && <p className="text-xs text-zinc-500 text-center break-all">{preview}</p>}
    </div>
  );
}

export function MessageFileButton({ onFile }:{onFile:(url:string, type:string)=>void}){
  const inputRef = useRef<HTMLInputElement>(null);
  async function handle(e: React.ChangeEvent<HTMLInputElement>){
    const file = e.target.files?.[0];
    if(!file) return;
    const form = new FormData();
    form.append("file", file);
    form.append("type", "message");
    const res = await fetch("/api/uploads",{method:"POST", body: form});
    const data = await res.json();
    if(res.ok) onFile(data.url, file.type);
    else alert("Error al subir archivo");
  }
  return (
    <>
      <button onClick={()=>inputRef.current?.click()} className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400">
        📎
      </button>
      <input ref={inputRef} type="file" accept="image/*,video/*,application/pdf" className="hidden" onChange={handle} />
    </>
  );
}
