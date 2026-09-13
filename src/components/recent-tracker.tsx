"use client";

import { useEffect, useState } from "react";
import { Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RecentItem {
  id: string;
  label: string;
  path: string;
  timestamp: number;
}

interface RecentTrackerProps {
  role: "client" | "trainer" | "admin";
}

const STORAGE_KEY = "kinetixfitt_recent_items";
const MAX_ITEMS = 5;

export function RecentTracker({ role }: RecentTrackerProps) {
  const [items, setItems] = useState<RecentItem[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Filter by role if needed
        setItems(Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : []);
      }
    } catch (e) {
      console.error("Failed to load recent items", e);
    }
  }, []);

  useEffect(() => {
    // Track current page visit
    if (typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      const currentTitle = document.title || currentPath;
      
      const newItem: RecentItem = {
        id: `${Date.now()}`,
        label: currentTitle.split("|")[0].trim(),
        path: currentPath,
        timestamp: Date.now(),
      };

      setItems(prev => {
        // Remove duplicate paths
        const filtered = prev.filter(item => item.path !== currentPath);
        const updated = [newItem, ...filtered].slice(0, MAX_ITEMS);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, []);

  const removeItem = (id: string) => {
    setItems(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearAll = () => {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-20 lg:bottom-8 right-4 z-40 transition-all duration-300",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      <div className="bg-[#09090B]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-sm font-medium text-white/70">
            <Clock className="w-4 h-4" />
            <span>Recientes</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-6 px-2 text-xs text-white/50 hover:text-[#D6FF2A] hover:bg-white/5"
          >
            Limpiar
          </Button>
        </div>

        {/* Items */}
        <div className="max-h-64 overflow-y-auto">
          {items.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className="group flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{item.label}</p>
                <p className="text-xs text-white/40 truncate">{item.path}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeItem(item.id);
                }}
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-white/40 hover:text-red-400 hover:bg-red-400/10"
              >
                <X className="w-3 h-3" />
              </Button>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
