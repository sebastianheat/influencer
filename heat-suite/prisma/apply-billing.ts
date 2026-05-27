import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const cols = [
    'ADD COLUMN IF NOT EXISTS "stripeCustomerId" TEXT',
    'ADD COLUMN IF NOT EXISTS "subscriptionId" TEXT',
    `ADD COLUMN IF NOT EXISTS "plan" TEXT NOT NULL DEFAULT 'none'`,
    'ADD COLUMN IF NOT EXISTS "subscriptionStatus" TEXT',
    'ADD COLUMN IF NOT EXISTS "currentPeriodEnd" TIMESTAMP(3)',
  ];
  for (const c of cols) {
    await pool.query(`ALTER TABLE "Brand" ${c};`);
  }
  console.log("Brand subscription columns OK");
  await pool.end();
}
main();
