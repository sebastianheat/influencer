import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { auth } from "@/auth";
import type {
  Application,
  ApplicationStatus,
  Campaign,
  CampaignStatus,
  Influencer,
  OdtStatus,
  Platform,
  TopPost,
} from "./types";

/* ---------- helpers ---------- */

const postCovers = ["heat-gradient-soft", "heat-gradient-blue", "heat-gradient"];

function genPosts(seed: number, baseReach: number): TopPost[] {
  const captions = [
    "Probando el nuevo producto 🔥",
    "Mi rutina de la mañana ☀️",
    "Respondiendo sus preguntas 💬",
    "Detrás de cámaras del shooting 🎬",
    "Lo que nadie te cuenta… 👀",
    "Colaboración que amé 💜",
  ];
  return Array.from({ length: 6 }).map((_, i) => {
    const r = baseReach * (1 - i * 0.12);
    return {
      caption: captions[i],
      cover: postCovers[(seed + i) % postCovers.length],
      likes: Math.round(r * 0.08),
      comments: Math.round(r * 0.004),
      shares: Math.round(r * 0.02),
      saves: Math.round(r * 0.006),
      reach: Math.round(r),
      views: Math.round(r * 1.6),
      engagement: Math.round((6 + ((seed + i) % 10)) * 10) / 10,
    };
  });
}

const campaignStatus = (s: string): CampaignStatus =>
  ({ DRAFT: "draft", ACTIVE: "active", REVIEW: "review", COMPLETED: "completed" } as const)[
    s as "DRAFT" | "ACTIVE" | "REVIEW" | "COMPLETED"
  ];

const appStatus = (s: string): ApplicationStatus =>
  ({ PENDING: "pending", SHORTLISTED: "shortlisted", ACCEPTED: "accepted", REJECTED: "rejected" } as const)[
    s as "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED"
  ];

type CreatorRow = Prisma.CreatorProfileGetPayload<{ include: { user: true } }>;

function mapCreator(c: CreatorRow, seed = 1): Influencer {
  return {
    id: c.id,
    name: c.user?.name ?? "Creador",
    handle: c.handle,
    avatar: "",
    niche: c.niche,
    platforms: c.platforms as Platform[],
    followers: c.followers,
    engagement: c.engagement,
    location: c.location,
    rating: c.rating,
    priceFrom: c.priceFrom,
    bio: c.bio,
    verified: c.verified,
    completedCampaigns: c.completedCampaigns,
    age: c.age,
    region: c.region,
    comuna: c.comuna,
    igFollowers: c.igFollowers,
    ttFollowers: c.ttFollowers,
    reviewScore: c.reviewScore,
    reach: c.reach,
    audience: { male: c.audienceMale, female: c.audienceFemale, other: c.audienceOther },
    topPosts: genPosts(seed, Math.max(c.reach, 40000)),
  } as Influencer;
}

const creatorInclude = { user: true } as const;

function mapCampaign(
  c: {
    id: string;
    title: string;
    status: string;
    niche: string;
    tag: string;
    collabTypes: string[];
    platforms: string[];
    budget: number;
    payPerCreator: number;
    spots: number;
    filled: number;
    deadline: Date;
    createdAt: Date;
    cover: string;
    brief: string;
    deliverables: string[];
    requirements: string[];
    minFollowers: number;
    brand: { name: string; logo: string | null };
    _count: { applications: number };
  },
): Campaign {
  return {
    id: c.id,
    title: c.title,
    brand: c.brand.name,
    brandLogo: c.brand.logo ?? "🩺",
    status: campaignStatus(c.status),
    niche: c.niche,
    collabTypes: c.collabTypes as Campaign["collabTypes"],
    platforms: c.platforms as Platform[],
    budget: c.budget,
    payPerCreator: c.payPerCreator,
    spots: c.spots,
    filled: c.filled,
    applicants: c._count.applications,
    deadline: c.deadline.toISOString(),
    createdAt: c.createdAt.toISOString(),
    cover: c.cover,
    brief: c.brief,
    deliverables: c.deliverables,
    requirements: c.requirements,
    minFollowers: c.minFollowers,
    tag: c.tag,
  };
}

const campaignInclude = {
  brand: { select: { name: true, logo: true } },
  _count: { select: { applications: true } },
} as const;

/* ---------- session ---------- */

export async function currentBrandId(): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const brand = await prisma.brand.findUnique({ where: { userId: session.user.id } });
  return brand?.id ?? null;
}

export async function getCurrentBrandShopify(): Promise<{
  shop: string;
  accessToken: string;
} | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const conn = await prisma.connection.findFirst({
    where: { userId: session.user.id, provider: "shopify" },
  });
  if (!conn?.shop || !conn.accessToken) return null;
  return { shop: conn.shop, accessToken: conn.accessToken };
}

export async function getConnectedProviders(): Promise<Set<string>> {
  const session = await auth();
  if (!session?.user?.id) return new Set();
  const rows = await prisma.connection.findMany({
    where: { userId: session.user.id },
    select: { provider: true },
  });
  return new Set(rows.map((r) => r.provider));
}

export type ChatConvo = {
  applicationId: string;
  campaignTitle: string;
  peerName: string;
  peerHandle: string;
  lastBody: string | null;
  lastAt: string | null;
  unread: boolean;
  odtStatus: string | null;
};

export async function getBrandConversations(): Promise<ChatConvo[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  const brand = await prisma.brand.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!brand) return [];
  const apps = await prisma.application.findMany({
    where: {
      status: "ACCEPTED",
      campaign: { brandId: brand.id },
    },
    select: {
      id: true,
      odtStatus: true,
      campaign: { select: { title: true } },
      creator: { select: { handle: true, user: { select: { name: true } } } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true, readByBrandAt: true },
      },
    },
  });
  return apps.map((a) => {
    const last = a.messages[0];
    return {
      applicationId: a.id,
      campaignTitle: a.campaign.title,
      peerName: a.creator.user.name,
      peerHandle: a.creator.handle,
      lastBody: last?.body ?? null,
      lastAt: last?.createdAt?.toISOString() ?? null,
      unread: Boolean(last && !last.readByBrandAt),
      odtStatus: a.odtStatus,
    };
  });
}

export async function getCreatorConversations(): Promise<ChatConvo[]> {
  const session = await auth();
  if (!session?.user?.id) return [];
  const creator = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (!creator) return [];
  const apps = await prisma.application.findMany({
    where: {
      status: "ACCEPTED",
      creatorId: creator.id,
    },
    select: {
      id: true,
      odtStatus: true,
      campaign: { select: { title: true, brand: { select: { name: true, logo: true } } } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true, readByCreatorAt: true },
      },
    },
  });
  return apps.map((a) => {
    const last = a.messages[0];
    return {
      applicationId: a.id,
      campaignTitle: a.campaign.title,
      peerName: a.campaign.brand.name,
      peerHandle: a.campaign.brand.logo ?? "🏷️",
      lastBody: last?.body ?? null,
      lastAt: last?.createdAt?.toISOString() ?? null,
      unread: Boolean(last && !last.readByCreatorAt),
      odtStatus: a.odtStatus,
    };
  });
}

export async function getBrandBalance(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;
  const brand = await prisma.brand.findUnique({
    where: { userId: session.user.id },
    select: { balance: true },
  });
  return brand?.balance ?? 0;
}

export type StripeConnectStatus = {
  exists: boolean;
  detailsSubmitted: boolean;
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
};

export async function getCreatorStripeStatus(): Promise<StripeConnectStatus> {
  const session = await auth();
  if (!session?.user?.id) {
    return { exists: false, detailsSubmitted: false, payoutsEnabled: false, chargesEnabled: false };
  }
  const conn = await prisma.connection.findUnique({
    where: { userId_provider: { userId: session.user.id, provider: "stripe" } },
    select: {
      externalId: true,
      detailsSubmitted: true,
      payoutsEnabled: true,
      chargesEnabled: true,
    },
  });
  return {
    exists: Boolean(conn?.externalId),
    detailsSubmitted: Boolean(conn?.detailsSubmitted),
    payoutsEnabled: Boolean(conn?.payoutsEnabled),
    chargesEnabled: Boolean(conn?.chargesEnabled),
  };
}

export async function currentCreatorId(): Promise<string | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const creator = await prisma.creatorProfile.findUnique({
    where: { userId: session.user.id },
  });
  return creator?.id ?? null;
}

/* ---------- creators ---------- */

export async function getCreators(): Promise<Influencer[]> {
  const rows = await prisma.creatorProfile.findMany({
    include: creatorInclude,
    orderBy: { followers: "desc" },
  });
  return rows.map((r, i) => mapCreator(r as CreatorRow, i + 1));
}

export async function getCreator(id: string): Promise<Influencer | null> {
  const row = await prisma.creatorProfile.findUnique({ where: { id }, include: creatorInclude });
  return row ? mapCreator(row as CreatorRow) : null;
}

/* ---------- campaigns ---------- */

export async function getCampaigns(): Promise<Campaign[]> {
  const rows = await prisma.campaign.findMany({
    include: campaignInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapCampaign);
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const row = await prisma.campaign.findUnique({ where: { id }, include: campaignInclude });
  return row ? mapCampaign(row) : null;
}

/* ---------- applications ---------- */

export type AppRow = { app: Application; inf: Influencer };

function mapOdtStatus(s: string | null): OdtStatus | null {
  if (!s) return null;
  if (
    s === "pending_payment" ||
    s === "paid" ||
    s === "content_submitted" ||
    s === "released" ||
    s === "rejected"
  )
    return s;
  return null;
}

export async function getApplicationsForCampaign(campaignId: string): Promise<AppRow[]> {
  const rows = await prisma.application.findMany({
    where: { campaignId },
    include: { creator: { include: creatorInclude } },
    orderBy: { appliedAt: "asc" },
  });
  return rows.map((a, i) => ({
    app: {
      id: a.id,
      campaignId: a.campaignId,
      influencerId: a.creatorId,
      status: appStatus(a.status),
      appliedAt: a.appliedAt.toISOString(),
      message: a.message,
      proposedRate: a.proposedRate,
      odtStatus: mapOdtStatus(a.odtStatus),
      brandAmount: a.brandAmount,
      creatorAmount: a.creatorAmount,
      contentUrl: a.contentUrl,
      rejectionReason: a.rejectionReason,
    },
    inf: mapCreator(a.creator as CreatorRow, i + 1),
  }));
}

export async function getApplicationsForCreator(creatorId: string) {
  const rows = await prisma.application.findMany({
    where: { creatorId },
    include: { campaign: { include: campaignInclude } },
    orderBy: { appliedAt: "desc" },
  });
  return rows.map((a) => ({
    app: {
      id: a.id,
      campaignId: a.campaignId,
      influencerId: a.creatorId,
      status: appStatus(a.status),
      appliedAt: a.appliedAt.toISOString(),
      message: a.message,
      proposedRate: a.proposedRate,
      odtStatus: mapOdtStatus(a.odtStatus),
      brandAmount: a.brandAmount,
      creatorAmount: a.creatorAmount,
      contentUrl: a.contentUrl,
      rejectionReason: a.rejectionReason,
    },
    campaign: mapCampaign(a.campaign),
  }));
}
