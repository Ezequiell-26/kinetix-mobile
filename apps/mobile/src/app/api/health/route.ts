import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/db";

/**
 * Endpoint de health check para Kubernetes y monitoreo.
 * Verifica:
 * - Estado de la aplicación
 * - Variables de entorno críticas
 * - Conexión a base de datos (opcional)
 */
export async function GET() {
  try {
    // Verificaciones básicas
    const checks = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      database: "unknown",
      uptime: process.uptime(),
    };

    // Verificar conexión a base de datos
    const dbConnected = await checkDatabaseConnection();
    checks.database = dbConnected ? "connected" : "disconnected";

    // Determinar estado general
    const isHealthy = dbConnected;
    
    return NextResponse.json(
      {
        ...checks,
        status: isHealthy ? "healthy" : "degraded",
      },
      { 
        status: isHealthy ? 200 : 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Content-Type-Options": "nosniff",
        }
      }
    );
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { 
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        }
      }
    );
  }
}
