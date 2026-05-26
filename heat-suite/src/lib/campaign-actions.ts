"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { currentBrandId, currentCreatorId } from "@/lib/queries";
import type { ApplicationStatus } from "@/lib/types";

const toDbAppStatus = {
  pending: "PENDING",
  shortlisted: "SHORTLISTED",
  accepted: "ACCEPTED",
  rejected: "REJECTED",
} as const;

export async function updateApplicationStatus(
  appId: string,
  status: ApplicationStatus,
) {
  const brandId = await currentBrandId();
  if (!brandId) return { error: "No autorizado" };

  const app = await prisma.application.findUnique({
    where: { id: appId },
    include: { campaign: true },
  });
  if (!app || app.campaign.brandId !== brandId) return { error: "No encontrado" };

  await prisma.application.update({
    where: { id: appId },
    data: { status: toDbAppStatus[status] },
  });
  revalidatePath(`/brand/campaigns/${app.campaignId}`);
  revalidatePath(`/brand/campaigns/${app.campaignId}/postulantes`);
  return { ok: true };
}

export async function applyToCampaign(
  campaignId: string,
  message: string,
  proposedRate: number,
) {
  const creatorId = await currentCreatorId();
  if (!creatorId) return { error: "Inicia sesión como creador" };

  await prisma.application.upsert({
    where: { campaignId_creatorId: { campaignId, creatorId } },
    create: { campaignId, creatorId, message, proposedRate, status: "PENDING" },
    update: { message, proposedRate },
  });
  revalidatePath(`/creator/campaigns/${campaignId}`);
  revalidatePath(`/creator/applications`);
  return { ok: true };
}

export async function createCampaign(input: {
  title: string;
  brief: string;
  niche: string;
  tag: string;
  collabTypes: string[];
  platforms: string[];
  payPerCreator: number;
  budget: number;
  spots: number;
  minFollowers: number;
  deadline: string;
}) {
  const brandId = await currentBrandId();
  if (!brandId) return { error: "No autorizado" };

  const c = await prisma.campaign.create({
    data: {
      brandId,
      title: input.title || "Nueva campaña",
      brief: input.brief,
      niche: input.niche,
      tag: input.tag,
      collabTypes: input.collabTypes,
      platforms: input.platforms,
      payPerCreator: input.payPerCreator,
      budget: input.budget,
      spots: input.spots,
      minFollowers: input.minFollowers,
      deadline: input.deadline ? new Date(input.deadline) : new Date(Date.now() + 30 * 86400000),
      status: "ACTIVE",
      cover: "heat-gradient-soft",
    },
  });
  revalidatePath("/brand/campaigns");
  return { ok: true, id: c.id };
}
