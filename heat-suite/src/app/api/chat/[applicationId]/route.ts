import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function authorize(applicationId: string) {
  const session = await auth();
  if (!session?.user?.id) return null;
  const app = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      campaign: { include: { brand: true } },
      creator: true,
    },
  });
  if (!app) return null;
  const userId = session.user.id;
  if (app.campaign.brand.userId === userId) return { role: "brand" as const, userId };
  if (app.creator.userId === userId) return { role: "creator" as const, userId };
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> },
) {
  const { applicationId } = await params;
  const ok = await authorize(applicationId);
  if (!ok) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const since = req.nextUrl.searchParams.get("since");
  const sinceDate = since ? new Date(since) : null;

  const messages = await prisma.message.findMany({
    where: {
      applicationId,
      ...(sinceDate && !isNaN(sinceDate.getTime())
        ? { createdAt: { gt: sinceDate } }
        : {}),
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      body: true,
      createdAt: true,
      senderId: true,
    },
  });

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      body: m.body,
      createdAt: m.createdAt.toISOString(),
      mine: m.senderId === ok.userId,
    })),
    role: ok.role,
  });
}
