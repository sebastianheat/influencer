export type ProviderId = "instagram" | "tiktok" | "shopify";

export type TokenResult = {
  accessToken: string;
  refreshToken?: string;
  externalId?: string;
  username?: string;
  scope?: string;
  expiresIn?: number;
};

type Provider = {
  id: ProviderId;
  label: string;
  clientId?: string;
  clientSecret?: string;
  scope: string;
  needsShop?: boolean;
  authorizeUrl: (p: {
    clientId: string;
    redirectUri: string;
    state: string;
    scope: string;
    shop?: string;
  }) => string;
  exchangeToken: (p: {
    clientId: string;
    clientSecret: string;
    code: string;
    redirectUri: string;
    shop?: string;
  }) => Promise<TokenResult>;
};

/* Credentials come from env vars — set them in Vercel once each app is registered. */
export const providers: Record<ProviderId, Provider> = {
  instagram: {
    id: "instagram",
    label: "Instagram",
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
    scope: "user_profile,user_media",
    authorizeUrl: ({ clientId, redirectUri, state, scope }) =>
      `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
        redirectUri,
      )}&scope=${encodeURIComponent(scope)}&response_type=code&state=${state}`,
    exchangeToken: async ({ clientId, clientSecret, code, redirectUri }) => {
      const res = await fetch("https://api.instagram.com/oauth/access_token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
          code,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error_message || "Instagram token error");
      return { accessToken: j.access_token, externalId: String(j.user_id ?? "") };
    },
  },

  tiktok: {
    id: "tiktok",
    label: "TikTok",
    clientId: process.env.TIKTOK_CLIENT_KEY,
    clientSecret: process.env.TIKTOK_CLIENT_SECRET,
    scope: "user.info.basic,user.info.profile",
    authorizeUrl: ({ clientId, redirectUri, state, scope }) =>
      `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientId}&scope=${encodeURIComponent(
        scope,
      )}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`,
    exchangeToken: async ({ clientId, clientSecret, code, redirectUri }) => {
      const res = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_key: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: redirectUri,
        }),
      });
      const j = await res.json();
      if (!res.ok || j.error) throw new Error(j.error_description || "TikTok token error");
      return {
        accessToken: j.access_token,
        refreshToken: j.refresh_token,
        externalId: j.open_id,
        scope: j.scope,
        expiresIn: j.expires_in,
      };
    },
  },

  shopify: {
    id: "shopify",
    label: "Shopify",
    clientId: process.env.SHOPIFY_API_KEY,
    clientSecret: process.env.SHOPIFY_API_SECRET,
    scope: "read_products,read_orders",
    needsShop: true,
    authorizeUrl: ({ clientId, redirectUri, state, scope, shop }) =>
      `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${encodeURIComponent(
        scope,
      )}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`,
    exchangeToken: async ({ clientId, clientSecret, code, shop }) => {
      const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error_description || "Shopify token error");
      return { accessToken: j.access_token, scope: j.scope, username: shop };
    },
  },
};

export function isConfigured(id: ProviderId): boolean {
  const p = providers[id];
  return Boolean(p?.clientId && p?.clientSecret);
}

/* Where to send the user back to after connecting. */
export function returnPathFor(id: ProviderId): string {
  return id === "shopify" ? "/brand" : "/creator/profile";
}
