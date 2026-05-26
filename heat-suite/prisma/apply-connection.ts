import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  await pool.query(
    'CREATE TABLE IF NOT EXISTS "Connection" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "provider" TEXT NOT NULL, "externalId" TEXT, "username" TEXT, "accessToken" TEXT, "refreshToken" TEXT, "shop" TEXT, "scope" TEXT, "expiresAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Connection_pkey" PRIMARY KEY ("id"));',
  );
  await pool.query(
    'CREATE UNIQUE INDEX IF NOT EXISTS "Connection_userId_provider_key" ON "Connection"("userId","provider");',
  );
  try {
    await pool.query(
      'ALTER TABLE "Connection" ADD CONSTRAINT "Connection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;',
    );
    console.log("FK added");
  } catch (e) {
    console.log("FK skip:", (e as Error).message.slice(0, 50));
  }
  const r = await pool.query('SELECT count(*) FROM "Connection";');
  console.log("Connection table OK, rows =", r.rows[0].count);
  await pool.end();
}

main();
