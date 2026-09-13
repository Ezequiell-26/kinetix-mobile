"use client";

import * as React from "react";
import { Download, FileText, Share2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslation } from "@/lib/i18n";

interface ExportData {
  type: 'workouts' | 'nutrition' | 'progress' | 'measurements' | 'checkins' | 'all';
  format: 'pdf' | 'csv' | 'json';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

interface ExportActionsProps {
  userId?: string;
  availableExports?: Array<'workouts' | 'nutrition' | 'progress' | 'measurements' | 'checkins'>;
  onExport?: (data: ExportData) => Promise<void>;
}

export function ExportActions({
  userId,
  availableExports = ['workouts', 'nutrition', 'progress', 'measurements', 'checkins'],
  onExport,
}: ExportActionsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState<ExportData['type']>('all');
  const [selectedFormat, setSelectedFormat] = React.useState<ExportData['format']>('pdf');
  const t = useTranslation();

  const handleExport = async () => {
    if (!onExport) {
      // Export por defecto - descarga directa
      await performDefaultExport(selectedType, selectedFormat);
      return;
    }

    setIsExporting(true);
    try {
      await onExport({
        type: selectedType,
        format: selectedFormat,
        dateRange: {
          start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Últimos 90 días
          end: new Date(),
        },
      });
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
      setIsOpen(false);
    }
  };

  const performDefaultExport = async (type: ExportData['type'], format: ExportData['format']) => {
    // Generar datos de ejemplo para exportación
    const mockData = generateMockExportData(type);
    
    let content: string;
    let mimeType: string;
    let extension: string;

    if (format === 'json') {
      content = JSON.stringify(mockData, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else if (format === 'csv') {
      content = convertToCSV(mockData);
      mimeType = 'text/csv';
      extension = 'csv';
    } else {
      // PDF - generar HTML simple para impresión
      content = generatePDFContent(mockData, type);
      mimeType = 'text/html';
      extension = 'html';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kinetix-${type}-${new Date().toISOString().split('T')[0]}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsOpen(false);
  };

  const generateMockExportData = (type: ExportData['type']) => {
    const baseData = {
      exportedAt: new Date().toISOString(),
      userId: userId || 'anonymous',
      type,
    };

    switch (type) {
      case 'workouts':
        return {
          ...baseData,
          workouts: [
            {
              id: '1',
              name: 'Rutina de Pecho',
              date: new Date().toISOString(),
              duration: 3600,
              exercises: [
                { name: 'Press de Banca', sets: 4, reps: 10, weight: 80 },
                { name: 'Press Inclinado', sets: 3, reps: 12, weight: 65 },
              ],
            },
          ],
        };
      case 'nutrition':
        return {
          ...baseData,
          nutrition: [
            {
              date: new Date().toISOString(),
              calories: 2500,
              protein: 180,
              carbs: 250,
              fat: 70,
              meals: [
                { name: 'Desayuno', calories: 500 },
                { name: 'Almuerzo', calories: 800 },
                { name: 'Cena', calories: 700 },
              ],
            },
          ],
        };
      case 'progress':
        return {
          ...baseData,
          progress: [
            {
              date: new Date().toISOString(),
              weight: 75.5,
              bodyFat: 15.2,
              muscleMass: 65.3,
              photos: ['before.jpg', 'after.jpg'],
            },
          ],
        };
      case 'measurements':
        return {
          ...baseData,
          measurements: [
            {
              date: new Date().toISOString(),
              chest: 100,
              waist: 80,
              hips: 95,
              arms: 35,
              thighs: 55,
            },
          ],
        };
      case 'checkins':
        return {
          ...baseData,
          checkins: [
            {
              date: new Date().toISOString(),
              mood: 8,
              energy: 7,
              sleep: 7.5,
              notes: 'Buena semana de entrenamiento',
            },
          ],
        };
      case 'all':
      default:
        return {
          ...baseData,
          summary: {
            totalWorkouts: 156,
            totalDays: 90,
            adherence: 87.5,
            avgCalories: 2450,
            weightChange: -3.2,
          },
        };
    }
  };

  const convertToCSV = (data: any): string => {
    // Conversión simple a CSV
    const rows: string[] = [];
    
    if (Array.isArray(data)) {
      if (data.length === 0) return '';
      
      const headers = Object.keys(data[0]);
      rows.push(headers.join(','));
      
      data.forEach((item) => {
        const values = headers.map((header) => {
          const value = item[header];
          if (typeof value === 'string' && value.includes(',')) {
            return `"${value}"`;
          }
          return value;
        });
        rows.push(values.join(','));
      });
    } else if (typeof data === 'object') {
      // Objeto anidado - aplanar
      const flattened = flattenObject(data);
      const headers = Object.keys(flattened);
      rows.push(headers.join(','));
      rows.push(headers.map(h => flattened[h]).join(','));
    }
    
    return rows.join('\n');
  };

  const flattenObject = (obj: any, prefix = ''): any => {
    return Object.keys(obj).reduce((acc: any, k: string) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  const generatePDFContent = (data: any, type: ExportData['type']): string => {
    // HTML simple para imprimir como PDF
    return `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Kinetix - Exportación ${type}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            h1 { color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f3f4f6; }
            .meta { color: #6b7280; font-size: 14px; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <h1>Kinetix - ${type.charAt(0).toUpperCase() + type.slice(1)}</h1>
          <p class="meta">Exportado el: ${new Date().toLocaleDateString('es-ES')}</p>
          <pre>${JSON.stringify(data, null, 2)}</pre>
        </body>
      </html>
    `;
  };

  const exportOptions = [
    { value: 'workouts', label: t('export.types.workouts') || 'Entrenamientos' },
    { value: 'nutrition', label: t('export.types.nutrition') || 'Nutrición' },
    { value: 'progress', label: t('export.types.progress') || 'Progreso' },
    { value: 'measurements', label: t('export.types.measurements') || 'Medidas' },
    { value: 'checkins', label: t('export.types.checkins') || 'Check-ins' },
    { value: 'all', label: t('export.types.all') || 'Todo' },
  ].filter(opt => 
    selectedType === 'all' || 
    availableExports.includes(opt.value as any) || 
    opt.value === 'all'
  );

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: FileText },
    { value: 'csv', label: 'CSV', icon: FileText },
    { value: 'json', label: 'JSON', icon: FileText },
  ];

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
          <DialogTitle>Exportar Datos</DialogTitle>
          <DialogDescription>
            Selecciona qué datos quieres exportar y en qué formato.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Datos</label>
            <div className="grid grid-cols-2 gap-2">
              {exportOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedType === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(option.value as ExportData['type'])}
                  className="justify-start"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Formato</label>
            <div className="grid grid-cols-3 gap-2">
              {formatOptions.map((option) => (
                <Button
                  key={option.value}
                  variant={selectedFormat === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedFormat(option.value as ExportData['format'])}
                  className="justify-center"
                >
                  <option.icon className="h-4 w-4 mr-1" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            <p>• Los datos se exportarán con información de los últimos 90 días</p>
            <p>• El archivo se descargará automáticamente</p>
            <p>• Puedes importar estos datos en otra cuenta</p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              'Exportando...'
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Hook para usar exportaciones
export function useDataExport(userId?: string) {
  const [isExporting, setIsExporting] = React.useState(false);
  const [lastExport, setLastExport] = React.useState<Date | null>(null);

  const exportData = async (data: ExportData) => {
    setIsExporting(true);
    try {
      // Llamada API para exportación en servidor
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          ...data,
        }),
      });

      if (!response.ok) throw new Error('Error al exportar');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `kinetix-export-${Date.now()}.${data.format}`;
      link.click();
      URL.revokeObjectURL(url);

      setLastExport(new Date());
    } finally {
      setIsExporting(false);
    }
  };

  const shareData = async (data: ExportData) => {
    if (navigator.share) {
      const mockData = JSON.stringify({ type: data.type, date: new Date() });
      await navigator.share({
        title: 'Kinetix - Datos de Entrenamiento',
        text: `Mis datos de ${data.type}`,
        url: window.location.origin,
      });
    } else {
      // Fallback: copiar al portapapeles
      await navigator.clipboard.writeText(JSON.stringify(data));
    }
  };

  const printData = () => {
    window.print();
  };

  return {
    isExporting,
    lastExport,
    exportData,
    shareData,
    printData,
  };
}
