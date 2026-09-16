import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/db";

/** Public liveness/readiness probe with minimal information disclosure. */
export async function GET() {
  try {
    const database = await checkDatabaseConnection();
    return NextResponse.json(
      {
        status: database ? "healthy" : "degraded",
        timestamp: new Date().toISOString(),
      },
      {
        status: database ? 200 : 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Content-Type-Options": "nosniff",
        },
      },
    );
  } catch (error) {
    console.error("[health] check failed", error);
    return NextResponse.json(
      { status: "unhealthy", timestamp: new Date().toISOString() },
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
