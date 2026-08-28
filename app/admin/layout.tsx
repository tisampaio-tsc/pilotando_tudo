import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Painel | Adriana Barbosa",
  robots: { index: false, follow: false },
  manifest: "/admin-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Painel Adriana",
  },
  icons: {
    apple: "/Assets/logo.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1628",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // O painel mantém sempre as cores padrão, independentemente do tema do site.
    <div
      data-theme="classico"
      className="min-h-screen bg-navy-900 text-white admin-safe-area"
    >
      {children}
    </div>
  );
}
