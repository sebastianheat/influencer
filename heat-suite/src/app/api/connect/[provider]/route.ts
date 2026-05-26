import { NextResponse, type NextRequest } from "next/server";
import { randomBytes } from "node:crypto";
import { auth } from "@/auth";
import { providers, isConfigured, returnPathFor, type ProviderId } from "@/lib/oauth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ provider: string }> },
) {
  const { provider } = await params;
  const id = provider as ProviderId;
  const cfg = providers[id];
  const origin = req.nextUrl.origin;
  const back = returnPathFor(id);

  if (!cfg) return NextResponse.redirect(new URL("/", origin));

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  if (!isConfigured(id)) {
    return NextResponse.redirect(new URL(`${back}?error=config&p=${id}`, origin));
  }

  const shop = req.nextUrl.searchParams.get("shop") ?? undefined;
  if (cfg.needsShop && !shop) {
    return NextResponse.redirect(new URL(`${back}?error=shop&p=${id}`, origin));
  }

  const state = randomBytes(16).toString("hex");
  const redirectUri = `${origin}/api/connect/${id}/callback`;
  const url = cfg.authorizeUrl({
    clientId: cfg.clientId!,
    redirectUri,
    state,
    scope: cfg.scope,
    shop,
  });

  const res = NextResponse.redirect(url);
  const cookieOpts = { httpOnly: true, secure: true, sameSite: "lax" as const, maxAge: 600, path: "/" };
  res.cookies.set(`oauth_state_${id}`, state, cookieOpts);
  if (shop) res.cookies.set(`oauth_shop_${id}`, shop, cookieOpts);
  return res;
}
