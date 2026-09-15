"use client";
import Image from "next/image";
import { Paperclip, Check, AlertTriangle, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

export function FileUpload({ type="progress", onUploaded, accept="image/*", label="Arrastrá fotos acá o elegí archivos" }:{type?:string; onUploaded?:(url:string)=>void; accept?:string; label?:string}){
  const [uploading,setUploading]=useState(false);
  const [preview,setPreview]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);
  const inputRef=useRef<HTMLInputElement>(null);

  async function handleFile(file:File){
    if(!file||uploading)return;
    setUploading(true); setError(null);
    try{
      const form=new FormData(); form.append("file",file); form.append("type",type);
      const res=await fetch("/api/uploads",{method:"POST",body:form});
      const data=await res.json().catch(()=>null);
      if(!res.ok||!data?.url) throw new Error(data?.error||"No se pudo subir el archivo.");
      setPreview(data.url); onUploaded?.(data.url);
    }catch(cause){
      setError(cause instanceof Error?cause.message:"No se pudo subir el archivo.");
    }finally{setUploading(false); if(inputRef.current)inputRef.current.value="";}
  }

  return <div className="space-y-2">
    <div onDragOver={e=>{e.preventDefault()}} onDrop={e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f)void handleFile(f)}} onClick={()=>!uploading&&inputRef.current?.click()} className={`cursor-pointer rounded-xl border-2 border-dashed p-6 text-center text-sm transition ${error?"border-red-500/30 bg-red-500/5":"border-white/[.08] hover:border-primary/30 hover:bg-white/[.02]"} ${uploading?"pointer-events-none opacity-70":""}`}>
      {preview?<div className="space-y-2"><Image src={preview} alt="Archivo subido" width={96} height={96} className="mx-auto h-24 w-24 rounded-xl border border-white/[.08] object-cover" unoptimized/><p className="flex items-center justify-center gap-1 text-xs font-bold text-primary"><Check size={11}/> Subido correctamente</p></div>:<><p className="font-semibold text-zinc-300">{uploading?<span className="inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin"/> Subiendo...</span>:label}</p><p className="mt-1 text-xs text-zinc-600">Privadas • solo vos y tu coach • máx. 5MB</p></>}
    </div>
    <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={e=>{const f=e.target.files?.[0];if(f)void handleFile(f)}}/>
    {error&&<div role="alert" className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs text-red-200"><AlertTriangle size={14} className="mt-0.5 shrink-0"/>{error}</div>}
    {preview&&<p className="break-all text-center text-[11px] text-zinc-600">Archivo listo para usar en KinetixFitt</p>}
  </div>;
}

export function MessageFileButton({ onFile }:{onFile:(url:string,type:string)=>void}){
  const inputRef=useRef<HTMLInputElement>(null);
  const [uploading,setUploading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  async function handle(e:React.ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0]; if(!file||uploading)return;
    setUploading(true);setError(null);
    try{
      const form=new FormData();form.append("file",file);form.append("type","message");
      const res=await fetch("/api/uploads",{method:"POST",body:form});const data=await res.json().catch(()=>null);
      if(!res.ok||!data?.url)throw new Error(data?.error||"No se pudo subir el archivo.");
      onFile(data.url,file.type);
    }catch(cause){setError(cause instanceof Error?cause.message:"No se pudo subir el archivo.");}
    finally{setUploading(false);if(inputRef.current)inputRef.current.value="";}
  }
  return <div className="flex flex-col items-center gap-1"><button type="button" disabled={uploading} onClick={()=>inputRef.current?.click()} aria-label="Adjuntar archivo" className="rounded-xl border border-white/[.08] bg-[#0B151E] p-2.5 text-zinc-400 transition hover:border-primary/30 hover:text-primary disabled:opacity-50">{uploading?<Loader2 size={16} className="animate-spin"/>:<Paperclip size={16}/>}</button><input ref={inputRef} type="file" accept="image/*,video/mp4,application/pdf" className="hidden" onChange={handle}/>{error&&<span role="alert" className="max-w-40 text-center text-[10px] text-red-300">{error}</span>}</div>;
}
