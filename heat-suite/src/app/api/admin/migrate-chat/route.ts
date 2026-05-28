import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

export const dynamic = "force-dynamic";

// One-shot: crea tabla Message para chat 1-on-1 por ODT.
// Idempotente.
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const steps: string[] = [];
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "Message" (
        "id"              TEXT NOT NULL,
        "applicationId"   TEXT NOT NULL,
        "senderId"        TEXT NOT NULL,
        "body"            TEXT NOT NULL,
        "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "readByBrandAt"   TIMESTAMP(3),
        "readByCreatorAt" TIMESTAMP(3),
        CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
      );
    `);
    steps.push("Message table");

    await pool.query(`
      DO $$ BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'Message_applicationId_fkey'
        ) THEN
          ALTER TABLE "Message"
            ADD CONSTRAINT "Message_applicationId_fkey"
            FOREIGN KEY ("applicationId") REFERENCES "Application"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM pg_constraint WHERE conname = 'Message_senderId_fkey'
        ) THEN
          ALTER TABLE "Message"
            ADD CONSTRAINT "Message_senderId_fkey"
            FOREIGN KEY ("senderId") REFERENCES "User"("id")
            ON DELETE CASCADE ON UPDATE CASCADE;
        END IF;
      END $$;
    `);
    steps.push("Message foreign keys");

    await pool.query(`
      CREATE INDEX IF NOT EXISTS "Message_applicationId_createdAt_idx"
      ON "Message"("applicationId", "createdAt");
    `);
    steps.push("Message index");

    return NextResponse.json({ ok: true, applied: steps });
  } catch (e) {
    return NextResponse.json(
      { error: "migration_failed", message: String(e), applied: steps },
      { status: 500 },
    );
  } finally {
    await pool.end();
  }
}
