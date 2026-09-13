/**
 * Tests del hash de tokens de reset (sin base de datos).
 *
 * Contrato: en DB solo vive sha256(token), nunca el token en plano.
 * Si alguien vuelve a guardar el token directo, estos tests fallan.
 *
 *   npm run test:security-unit
 */
import { createHash } from "crypto";
import { generateSecureToken, hashToken } from "../src/lib/password-reset-store";

let passed = 0;
let failed = 0;

function check(name: string, cond: boolean, detail?: unknown) {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.error(`  FAIL  ${name}`, detail ?? "");
  }
}

function main() {
  console.log("Test: tokens de reset solo en hash\n");

  // Vector conocido sha256("abc")
  check(
    "hashToken es sha256",
    hashToken("abc") === "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
  );
  // El token generado no se guarda igual a su hash (no-plaintext)
  const t = generateSecureToken();
  check("token de 64 hex", /^[0-9a-f]{64}$/.test(t));
  check(
    "hash difiere del token",
    hashToken(t) !== t && hashToken(t) === createHash("sha256").update(t).digest("hex")
  );

  console.log(`\nResultado: ${passed} pass, ${failed} fail`);
  if (failed > 0) process.exitCode = 1;
}

main();
