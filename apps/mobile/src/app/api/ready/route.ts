import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/db";

/**
 * Endpoint de readiness para Kubernetes.
 * Indica si la aplicación está lista para recibir tráfico.
 * Verifica dependencias críticas antes de marcar como ready.
 */
export async function GET() {
  try {
    const checks = {
      ready: true,
      timestamp: new Date().toISOString(),
      checks: {
        database: false,
        environment: false,
      },
    };

    // 1. Verificar variables de entorno críticas
    const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length === 0) {
      checks.checks.environment = true;
    } else {
      checks.ready = false;
      checks.checks.environment = false;
      console.warn("Missing environment variables:", missingVars);
    }

    // 2. Verificar conexión a base de datos
    const dbConnected = await checkDatabaseConnection();
    if (dbConnected) {
      checks.checks.database = true;
    } else {
      checks.ready = false;
      checks.checks.database = false;
    }

    // Determinar estado HTTP
    const statusCode = checks.ready ? 200 : 503;

    return NextResponse.json(
      {
        ready: checks.ready,
        timestamp: checks.timestamp,
        checks: checks.checks,
      },
      {
        status: statusCode,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    console.error("Readiness check failed:", error);
    return NextResponse.json(
      {
        ready: false,
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  }
}
