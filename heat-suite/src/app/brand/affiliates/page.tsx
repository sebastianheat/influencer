import Link from "next/link";
import { Badge, Card, PageHeader } from "@/components/ui";
import { getCurrentBrandShopify } from "@/lib/queries";
import { fetchShopifyProducts, type ShopifyProduct } from "@/lib/shopify";

export const dynamic = "force-dynamic";

export default async function Affiliates() {
  const conn = await getCurrentBrandShopify();

  if (!conn) {
    return (
      <>
        <PageHeader title="Afiliados" subtitle="Conecta tu tienda para sincronizar tu catálogo." />
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-line-strong bg-soft py-20 text-center">
          <div className="heat-gradient-soft flex h-16 w-16 items-center justify-center rounded-full text-3xl">
            🛍️
          </div>
          <p className="mt-4 font-bold text-ink">Conecta tu ecommerce</p>
          <p className="mt-1 max-w-sm text-sm text-soft-ink">
            Vincula Shopify o WooCommerce desde el Dashboard para sincronizar tu
            catálogo y activar afiliados.
          </p>
          <Link
            href="/brand"
            className="heat-gradient-blue mt-5 rounded-[10px] px-5 py-2.5 text-sm font-bold text-white"
          >
            Ir a Integraciones
          </Link>
        </div>
      </>
    );
  }

  let products: ShopifyProduct[] = [];
  let error: string | null = null;
  try {
    products = await fetchShopifyProducts(conn.shop, conn.accessToken);
  } catch {
    error = "No se pudo leer el catálogo de Shopify.";
  }

  return (
    <>
      <PageHeader
        title="Catálogo sincronizado"
        subtitle={`Productos reales de ${conn.shop}`}
        action={<Badge tone="success">● Shopify conectado</Badge>}
      />

      {error ? (
        <Card>
          <p className="text-sm text-danger">{error}</p>
        </Card>
      ) : products.length === 0 ? (
        <Card>
          <p className="text-sm text-soft-ink">No hay productos en la tienda.</p>
        </Card>
      ) : (
        <>
          <p className="mb-4 text-sm text-soft-ink">
            {products.length} productos sincronizados desde tu tienda.
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <Card key={p.id} padded={false} className="overflow-hidden">
                <div className="flex h-40 items-center justify-center bg-card">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-4xl text-dim">🛍️</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 text-sm font-bold text-ink">{p.title}</h3>
                    <Badge tone={p.status === "active" ? "success" : "neutral"}>
                      {p.status === "active" ? "Activo" : p.status}
                    </Badge>
                  </div>
                  {p.vendor && <p className="mt-1 text-xs text-dim">{p.vendor}</p>}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-base font-extrabold text-ink">
                      {p.price ? `$${p.price}` : "—"}
                    </span>
                    <span className="text-xs text-soft-ink">
                      {p.inventory} en stock
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </>
  );
}
