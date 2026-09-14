/**
 * pg-apply.cjs — Aplica un .sql a Supabase por el pooler con driver pg directo.
 *
 * Por qué existe: `prisma db execute` NO commitea a través del pooler de
 * Supabase (exit 0 silencioso, 0 tablas creadas — 2026-09-13) y
 * `prisma migrate dev` no puede crear shadow DB en el pooler. Este script sí.
 *
 * Uso (nunca commitear secrets: las URLs van por env):
 *   $env:POOL="postgresql://postgres.[REF]:[PW]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
 *   node scripts/ad-hoc/pg-apply.cjs apps/mobile/prisma/migrations/<nombre>/migration.sql
 *
 * Requiere: npm i --no-save pg (o tener pg en /tmp/pg-run/node_modules).
 */
const { Client } = require("pg");
const fs = require("fs");

const CONN = process.env.POOL || process.env.DATABASE_URL;
const FILE = process.argv[2];

if (!CONN || !FILE) {
  console.error("Uso: POOL=<pooler-url> node scripts/ad-hoc/pg-apply.cjs <archivo.sql>");
  process.exit(2);
}

(async () => {
  const sql = fs.readFileSync(FILE, "utf8");
  const stmts = sql.split(/;\s*\n/).map((s) => s.trim()).filter(Boolean);
  console.log("statements:", stmts.length);
  const client = new Client({
    connectionString: CONN,
    ssl: { require: true, rejectUnauthorized: false },
    statement_timeout: 60000,
  });
  await client.connect();
  console.log("CONNECTED");
  let ok = 0;
  for (const s of stmts) {
    try {
      await client.query(s);
      ok++;
    } catch (e) {
      if (/already exists/i.test(e.message)) { ok++; continue; }
      console.error("FAIL:", e.message.slice(0, 200), "\n-->", s.slice(0, 160));
      process.exitCode = 1;
      break;
    }
  }
  const tables = await client.query(
    "SELECT count(*)::int AS n FROM pg_tables WHERE schemaname='public'"
  );
  console.log(`APPLIED ${ok}/${stmts.length} — tablas public:`, tables.rows[0].n);
  await client.end();
})().catch((e) => { console.error("FATAL:", e.message.slice(0, 300)); process.exit(1); });
