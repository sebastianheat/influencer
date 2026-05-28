import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import bcrypt from "bcryptjs";
import { influencers, campaigns, applications } from "../src/lib/data";

// Neon serverless driver over WebSocket (443) — works where TCP 5432 is blocked.
neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function applySchema() {
  const sql = fs.readFileSync(path.join(process.cwd(), "prisma/init.sql"), "utf8");
  const pool = new Pool({ connectionString });
  try {
    await pool.query(sql);
    console.log("Esquema aplicado (init.sql).");
  } finally {
    await pool.end();
  }
}

const STATUS = {
  draft: "DRAFT",
  active: "ACTIVE",
  review: "REVIEW",
  completed: "COMPLETED",
} as const;

const APP_STATUS = {
  pending: "PENDING",
  shortlisted: "SHORTLISTED",
  accepted: "ACCEPTED",
  rejected: "REJECTED",
} as const;

async function main() {
  if (process.env.APPLY_SCHEMA === "1") await applySchema();

  const pass = await bcrypt.hash("demo1234", 10);

  // Clean
  await prisma.application.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.creatorProfile.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();

  // Admin
  await prisma.user.create({
    data: { email: "admin@heat.test", name: "Equipo Heat", role: "ADMIN", passwordHash: pass },
  });

  // Brand
  const brandUser = await prisma.user.create({
    data: { email: "brand@heat.test", name: "Nueva Isapre", role: "BRAND", passwordHash: pass },
  });
  const brand = await prisma.brand.create({
    data: {
      userId: brandUser.id,
      name: "Nueva Isapre",
      website: "https://www.nuevaisapre.cl",
      description:
        "Compara 1.782 planes de las 7 isapres del mercado. Sin alza 2026 en Nueva Masvida. Asesoría gratuita por WhatsApp.",
      logo: "🩺",
    },
  });

  // Creators (one user per influencer; inf-1 is the demo creator login)
  const creatorIdByMockId: Record<string, string> = {};
  for (const inf of influencers) {
    const email =
      inf.id === "inf-1"
        ? "creator@heat.test"
        : `${inf.handle.replace("@", "")}@creators.heat.test`;
    const user = await prisma.user.create({
      data: { email, name: inf.name, role: "CREATOR", passwordHash: pass },
    });
    const profile = await prisma.creatorProfile.create({
      data: {
        userId: user.id,
        handle: inf.handle,
        bio: inf.bio,
        location: inf.location,
        region: inf.region,
        comuna: inf.comuna,
        age: inf.age,
        niche: inf.niche,
        platforms: inf.platforms,
        followers: inf.followers,
        igFollowers: inf.igFollowers,
        ttFollowers: inf.ttFollowers,
        engagement: inf.engagement,
        reach: inf.reach,
        rating: inf.rating,
        reviewScore: inf.reviewScore,
        priceFrom: inf.priceFrom,
        verified: inf.verified,
        completedCampaigns: inf.completedCampaigns,
        audienceMale: inf.audience.male,
        audienceFemale: inf.audience.female,
        audienceOther: inf.audience.other,
      },
    });
    creatorIdByMockId[inf.id] = profile.id;
  }

  // Campaigns (all under the demo brand)
  const campaignIdByMockId: Record<string, string> = {};
  for (const c of campaigns) {
    const created = await prisma.campaign.create({
      data: {
        brandId: brand.id,
        title: c.title,
        status: STATUS[c.status],
        niche: c.niche,
        tag: c.tag,
        collabTypes: c.collabTypes,
        platforms: c.platforms,
        budget: c.budget,
        payPerCreator: c.payPerCreator,
        spots: c.spots,
        filled: c.filled,
        deadline: new Date(c.deadline),
        cover: c.cover,
        brief: c.brief,
        deliverables: c.deliverables,
        requirements: c.requirements,
        minFollowers: c.minFollowers,
        createdAt: new Date(c.createdAt),
      },
    });
    campaignIdByMockId[c.id] = created.id;
  }

  // Applications
  for (const a of applications) {
    const campaignId = campaignIdByMockId[a.campaignId];
    const creatorId = creatorIdByMockId[a.influencerId];
    if (!campaignId || !creatorId) continue;
    await prisma.application.create({
      data: {
        campaignId,
        creatorId,
        status: APP_STATUS[a.status],
        message: a.message,
        proposedRate: a.proposedRate,
        appliedAt: new Date(a.appliedAt),
      },
    });
  }

  console.log("Seed completo: usuarios demo brand@heat.test / creator@heat.test / admin@heat.test (contraseña demo1234)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
