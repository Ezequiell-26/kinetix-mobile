"use client";

import * as React from "react";
import { Download, FileText, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "@/hooks/use-translation";

export interface ExportData {
  type: "workouts" | "progress" | "measurements" | "checkins" | "all";
  format: "csv" | "json";
  dateRange?: { start: Date; end: Date };
}

interface ExportActionsProps {
  availableExports?: Array<"workouts" | "progress" | "measurements" | "checkins">;
  onExport?: (data: ExportData) => Promise<void>;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function ExportActions({
  availableExports = ["workouts", "progress", "measurements", "checkins"],
  onExport,
}: ExportActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedType, setSelectedType] = React.useState<ExportData["type"]>("all");
  const [selectedFormat, setSelectedFormat] = React.useState<ExportData["format"]>("json");
  const { t } = useTranslation();

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const exportData: ExportData = {
        type: selectedType,
        format: selectedFormat,
        dateRange: { start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), end: new Date() },
      };

      if (onExport) {
        await onExport(exportData);
      } else {
        const response = await fetch("/api/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ type: selectedType, format: selectedFormat }),
        });
        if (!response.ok) {
          const payload = (await response.json().catch(() => null)) as { error?: string } | null;
          throw new Error(payload?.error || "No se pudieron exportar tus datos.");
        }
        const blob = await response.blob();
        const extension = selectedFormat;
        downloadBlob(blob, `kinetixfitt-${selectedType}-${new Date().toISOString().slice(0, 10)}.${extension}`);
      }
      setIsOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "No se pudieron exportar tus datos.");
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    { value: "workouts" as const, label: t("export.types.workouts") || "Entrenamientos" },
    { value: "progress" as const, label: t("export.types.progress") || "Progreso" },
    { value: "measurements" as const, label: t("export.types.measurements") || "Medidas" },
    { value: "checkins" as const, label: t("export.types.checkins") || "Check-ins" },
    { value: "all" as const, label: t("export.types.all") || "Todo" },
  ].filter((option) => option.value === "all" || availableExports.includes(option.value));

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Exportar datos</DialogTitle>
          <DialogDescription>Descargá tus propios datos de KinetixFitt en un formato portable.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de datos</label>
            <div className="grid grid-cols-2 gap-2">
              {exportOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedType === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(option.value)}
                  className="justify-start"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Formato</label>
            <div className="grid grid-cols-2 gap-2">
              <Button variant={selectedFormat === "json" ? "default" : "outline"} size="sm" onClick={() => setSelectedFormat("json")} className="justify-center">
                <FileText className="h-4 w-4 mr-1" /> JSON
              </Button>
              <Button variant={selectedFormat === "csv" ? "default" : "outline"} size="sm" onClick={() => setSelectedFormat("csv")} className="justify-center">
                <FileText className="h-4 w-4 mr-1" /> CSV
              </Button>
            </div>
          </div>
          {error && <p role="alert" className="text-sm text-red-400 rounded-lg border border-red-500/20 bg-red-500/10 p-3">{error}</p>}
          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground space-y-1">
            <p>• Se exportan datos reales de tu cuenta.</p>
            <p>• No se envía tu información a un proveedor externo.</p>
            <p>• El servidor limita el tamaño de la exportación.</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={() => void handleExport()} disabled={isExporting}>
            {isExporting ? "Exportando..." : <><Download className="mr-2 h-4 w-4" /> Exportar</>}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function useDataExport() {
  const [isExporting, setIsExporting] = React.useState(false);
  const [lastExport, setLastExport] = React.useState<Date | null>(null);

  const exportData = async (data: ExportData) => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type: data.type, format: data.format }),
      });
      if (!response.ok) throw new Error("No se pudieron exportar tus datos.");
      downloadBlob(await response.blob(), `kinetixfitt-${data.type}-${Date.now()}.${data.format}`);
      setLastExport(new Date());
    } finally {
      setIsExporting(false);
    }
  };

  const shareData = async (data: ExportData) => {
    if (navigator.share) {
      await navigator.share({ title: "KinetixFitt", text: `Mis datos de ${data.type}`, url: window.location.origin });
      return;
    }
    await navigator.clipboard.writeText(`KinetixFitt · ${data.type} · exportado localmente`);
  };

  const printData = () => window.print();

  return { isExporting, lastExport, exportData, shareData, printData };
}
