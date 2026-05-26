import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { providers, returnPathFor, type ProviderId } from "@/lib/oauth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const id = provider as ProviderId;
  const cfg = providers[id];
  const origin = req.nextUrl.origin;
  const back = returnPathFor(id);
  const fail = (reason: string) =>
    NextResponse.redirect(new URL(`${back}?error=${reason}&p=${id}`, origin));

  if (!cfg) return NextResponse.redirect(new URL("/", origin));

  const session = await auth();
  if (!session?.user?.id) return NextResponse.redirect(new URL("/login", origin));

  const sp = req.nextUrl.searchParams;
  if (sp.get("error")) return fail("denied");

  const code = sp.get("code");
  const state = sp.get("state");
  const savedState = req.cookies.get(`oauth_state_${id}`)?.value;
  if (!code || !state || state !== savedState) return fail("state");

  const shop = req.cookies.get(`oauth_shop_${id}`)?.value;
  const redirectUri = `${origin}/api/connect/${id}/callback`;

  let token;
  try {
    token = await cfg.exchangeToken({
      clientId: cfg.clientId!,
      clientSecret: cfg.clientSecret!,
      code,
      redirectUri,
      shop,
    });
  } catch {
    return fail("token");
  }

  const expiresAt = token.expiresIn
    ? new Date(Date.now() + token.expiresIn * 1000)
    : null;

  await prisma.connection.upsert({
    where: { userId_provider: { userId: session.user.id, provider: id } },
    create: {
      userId: session.user.id,
      provider: id,
      externalId: token.externalId,
      username: token.username,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      shop: shop ?? null,
      scope: token.scope,
      expiresAt,
    },
    update: {
      externalId: token.externalId,
      username: token.username,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      shop: shop ?? null,
      scope: token.scope,
      expiresAt,
    },
  });

  return NextResponse.redirect(new URL(`${back}?connected=${id}`, origin));
}
