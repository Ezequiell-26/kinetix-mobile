import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/db";

/**
 * Endpoint de readiness para Kubernetes/Vercel.
 * Solo informa si las dependencias críticas están listas; nunca expone secretos
 * ni detalles de excepciones al cliente.
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

    const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];
    const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

    if (missingVars.length === 0) {
      checks.checks.environment = true;
    } else {
      checks.ready = false;
      console.error("[readiness] critical environment is incomplete");
    }

    const dbConnected = await checkDatabaseConnection();
    if (dbConnected) {
      checks.checks.database = true;
    } else {
      checks.ready = false;
    }

    return NextResponse.json(
      {
        ready: checks.ready,
        timestamp: checks.timestamp,
        checks: checks.checks,
      },
      {
        status: checks.ready ? 200 : 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error) {
    console.error("[readiness] check failed", error);
    return NextResponse.json(
      {
        ready: false,
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  }
}
