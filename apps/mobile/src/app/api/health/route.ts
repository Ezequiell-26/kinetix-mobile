import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/db";

/**
 * Endpoint de health check para monitoreo.
 * La respuesta pública no expone detalles internos de errores.
 */
export async function GET() {
  try {
    const dbConnected = await checkDatabaseConnection();
    const healthy = dbConnected;

    return NextResponse.json(
      {
        status: healthy ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || "1.0.0",
        environment: process.env.NODE_ENV || "development",
        database: dbConnected ? "connected" : "disconnected",
        uptime: process.uptime(),
      },
      {
        status: healthy ? 200 : 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error) {
    console.error("[health] check failed", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  }
}
