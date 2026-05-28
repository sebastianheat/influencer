import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  // Connection — Stripe Connect status
  const connectionCols = [
    'ADD COLUMN IF NOT EXISTS "chargesEnabled" BOOLEAN NOT NULL DEFAULT false',
    'ADD COLUMN IF NOT EXISTS "payoutsEnabled" BOOLEAN NOT NULL DEFAULT false',
    'ADD COLUMN IF NOT EXISTS "detailsSubmitted" BOOLEAN NOT NULL DEFAULT false',
  ];
  for (const c of connectionCols) {
    await pool.query(`ALTER TABLE "Connection" ${c};`);
  }
  console.log("Connection Stripe Connect columns OK");

  // Brand — balance
  await pool.query(
    'ALTER TABLE "Brand" ADD COLUMN IF NOT EXISTS "balance" INTEGER NOT NULL DEFAULT 0;',
  );
  console.log("Brand balance column OK");

  // BrandBalanceTransaction
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "BrandBalanceTransaction" (
      "id"            TEXT NOT NULL,
      "brandId"       TEXT NOT NULL,
      "amount"        INTEGER NOT NULL,
      "reason"        TEXT NOT NULL,
      "applicationId" TEXT,
      "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "BrandBalanceTransaction_pkey" PRIMARY KEY ("id")
    );
  `);
  await pool.query(`
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'BrandBalanceTransaction_brandId_fkey'
      ) THEN
        ALTER TABLE "BrandBalanceTransaction"
          ADD CONSTRAINT "BrandBalanceTransaction_brandId_fkey"
          FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$;
  `);
  console.log("BrandBalanceTransaction table OK");

  // Application — ODT lifecycle + payment fields
  const appCols = [
    'ADD COLUMN IF NOT EXISTS "odtStatus" TEXT',
    'ADD COLUMN IF NOT EXISTS "brandAmount" INTEGER',
    'ADD COLUMN IF NOT EXISTS "creatorAmount" INTEGER',
    'ADD COLUMN IF NOT EXISTS "commissionAmount" INTEGER',
    'ADD COLUMN IF NOT EXISTS "stripeCheckoutSessionId" TEXT',
    'ADD COLUMN IF NOT EXISTS "stripePaymentIntentId" TEXT',
    'ADD COLUMN IF NOT EXISTS "stripeTransferId" TEXT',
    'ADD COLUMN IF NOT EXISTS "paidAt" TIMESTAMP(3)',
    'ADD COLUMN IF NOT EXISTS "contentSubmittedAt" TIMESTAMP(3)',
    'ADD COLUMN IF NOT EXISTS "contentUrl" TEXT',
    'ADD COLUMN IF NOT EXISTS "releasedAt" TIMESTAMP(3)',
    'ADD COLUMN IF NOT EXISTS "rejectedAt" TIMESTAMP(3)',
    'ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT',
  ];
  for (const c of appCols) {
    await pool.query(`ALTER TABLE "Application" ${c};`);
  }
  console.log("Application ODT columns OK");

  await pool.end();
}
main();
