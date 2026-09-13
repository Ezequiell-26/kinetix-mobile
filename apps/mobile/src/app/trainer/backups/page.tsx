"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDesc, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Trash2, RefreshCw, Database, AlertCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface Backup {
  filename: string;
  sizeBytes: number;
  sizeMB: string;
  createdAt: string;
}

export default function BackupsPage() {
  const router = useRouter();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadBackups = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/backups");
      if (!res.ok) {
        throw new Error("Error al cargar backups");
      }
      const data = await res.json();
      setBackups(data.backups || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  const handleCreateBackup = async () => {
    try {
      setCreating(true);
      setSuccess(null);
      setError(null);
      const res = await fetch("/api/backups", { method: "POST" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al crear backup");
      }
      const data = await res.json();
      setSuccess(`Backup creado exitosamente (${data.backup.sizeMB} MB)`);
      await loadBackups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBackup = async (filename: string) => {
    if (!confirm(`¿Estás seguro de eliminar el backup "${filename}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/backups/${encodeURIComponent(filename)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al eliminar backup");
      }
      setSuccess("Backup eliminado exitosamente");
      await loadBackups();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const handleDownload = (filename: string) => {
    // En producción, esto debería ser un endpoint que sirva el archivo
    alert(`Descarga iniciada para: ${filename}\n\nEn producción, este botón descargará el archivo desde S3 o el servidor.`);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Backups de Base de Datos</h1>
        <p className="text-muted-foreground">
          Gestiona las copias de seguridad de tu base de datos. Los backups se realizan automáticamente todos los días a las 3:00 AM.
        </p>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="text-red-800 font-medium">{error}</p>
          </CardContent>
        </Card>
      )}

      {success && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6 flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">{success}</p>
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Crear Backup Manual</CardTitle>
          <CardDesc>
            Genera una copia de seguridad completa de la base de datos ahora mismo.
          </CardDesc>
        </CardHeader>
        <CardContent>
          <Button onClick={handleCreateBackup} disabled={creating} className="gap-2">
            {creating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Creando backup...
              </>
            ) : (
              <>
                <Database className="h-4 w-4" />
                Crear Backup Ahora
              </>
            )}
          </Button>
          <p className="text-sm text-muted-foreground mt-2">
            Los backups se comprimen automáticamente y se suben a almacenamiento seguro si está configurado.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Backups Existentes</CardTitle>
              <CardDesc>
                {backups.length} backup{backups.length !== 1 ? "s" : ""} disponible{backups.length !== 1 ? "s" : ""}
              </CardDesc>
            </div>
            <Button variant="outline" size="sm" onClick={loadBackups} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Recargar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Cargando backups...</div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay backups disponibles</p>
              <p className="text-sm mt-1">Crea tu primer backup manual o espera al próximo automático</p>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup) => (
                <div
                  key={backup.filename}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{backup.filename}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span>{backup.sizeMB} MB</span>
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(backup.createdAt), { addSuffix: true, locale: es })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(backup.filename)}
                      title="Descargar"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteBackup(backup.filename)}
                      title="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6 bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Información Importante</CardTitle>
        </CardHeader>
        <CardContent className="text-blue-800 space-y-2">
          <p className="text-sm">
            • Los backups automáticos se realizan diariamente a las 3:00 AM (hora del servidor)
          </p>
          <p className="text-sm">
            • Se mantienen máximo 7 backups. Los más antiguos se eliminan automáticamente
          </p>
          <p className="text-sm">
            • Si está configurado S3, los backups se suben automáticamente a la nube
          </p>
          <p className="text-sm">
            • Para restaurar un backup, contacta al administrador del sistema
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
