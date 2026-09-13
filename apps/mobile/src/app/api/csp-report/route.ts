import { NextResponse } from "next/server";

/**
 * Endpoint para reportes de Content Security Policy (CSP)
 * Recibe violaciones de CSP y las loguea para análisis
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { "csp-report": report } = body;
    
    if (!report) {
      return NextResponse.json({ error: "Invalid report" }, { status: 400 });
    }
    
    // Logear la violación (en producción enviar a Sentry/monitoring)
    console.error("[CSP VIOLATION]", {
      blockedUri: report["blocked-uri"],
      directive: report["effective-directive"],
      originalPolicy: report["original-policy"],
      sourceFile: report["source-file"],
      lineNumber: report["line-number"],
      columnNumber: report["column-number"],
      timestamp: new Date().toISOString()
    });
    
    // En producción: enviar a servicio externo
    // await sendToSentry(report);
    // await saveToDatabase(report);
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[CSP] Error processing report:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
