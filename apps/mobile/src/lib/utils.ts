import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function formatCurrency(v:number, cur="ARS"){ return new Intl.NumberFormat("es-AR",{style:"currency",currency:cur}).format(v); }
export function formatDate(d:Date|string){ return new Date(d).toLocaleDateString("es-AR",{day:"2-digit",month:"short",year:"numeric"}); }
