const API_VERSION = "2026-04";

export type ShopifyProduct = {
  id: number;
  title: string;
  image: string | null;
  price: string | null;
  status: string;
  vendor: string;
  productType: string;
  inventory: number;
};

export async function fetchShopifyProducts(
  shop: string,
  token: string,
  limit = 24,
): Promise<ShopifyProduct[]> {
  const res = await fetch(
    `https://${shop}/admin/api/${API_VERSION}/products.json?limit=${limit}`,
    { headers: { "X-Shopify-Access-Token": token }, cache: "no-store" },
  );
  if (!res.ok) throw new Error(`Shopify products ${res.status}`);
  const json = await res.json();
  return (json.products ?? []).map((p: Record<string, unknown>) => {
    const variants = (p.variants as Record<string, unknown>[]) ?? [];
    const images = (p.images as Record<string, unknown>[]) ?? [];
    return {
      id: p.id as number,
      title: p.title as string,
      image:
        (p.image as { src?: string } | null)?.src ??
        (images[0]?.src as string) ??
        null,
      price: (variants[0]?.price as string) ?? null,
      status: (p.status as string) ?? "active",
      vendor: (p.vendor as string) ?? "",
      productType: (p.product_type as string) ?? "",
      inventory: variants.reduce(
        (s, v) => s + (Number(v.inventory_quantity) || 0),
        0,
      ),
    };
  });
}

export async function fetchShopifyProductCount(
  shop: string,
  token: string,
): Promise<number | null> {
  try {
    const res = await fetch(
      `https://${shop}/admin/api/${API_VERSION}/products/count.json`,
      { headers: { "X-Shopify-Access-Token": token }, cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.count ?? null;
  } catch {
    return null;
  }
}
