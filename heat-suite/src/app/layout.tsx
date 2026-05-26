import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Heat Suite — Reclutamiento de Influencers",
  description:
    "La plataforma de Heat Suite para conectar marcas con creadores de contenido. Crea campañas, recluta influencers y gestiona colaboraciones.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${jakarta.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
