"use client";
import { MessageCircle } from "lucide-react";
export function WhatsappFloat(){
  return (
    <a
      href="https://wa.me/5490000000000?text=Hola%20Ezequiel%20%F0%9F%92%AA"
      target="_blank"
      // Sin rel="noopener" la página destino podía manipular esta ventana vía
      // window.opener. El enlace solo tenía un ícono, así que tampoco tenía
      // nombre accesible: los lectores de pantalla lo anunciaban vacío.
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp a Ezequiel"
      className="fixed bottom-[88px] right-3 z-30 lg:bottom-6 w-12 h-12 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#080808]"
    >
      <MessageCircle size={24} className="text-white" fill="currentColor" aria-hidden="true" />
    </a>
  );
}
