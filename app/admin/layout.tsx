import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Painel | Adriana Barbosa",
  robots: { index: false, follow: false },
  manifest: "/admin-manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Pilotando Tudo",
  },
  icons: {
    icon: "/Assets/icon-192.png",
    apple: "/Assets/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#3d5a80",
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
    // O painel tem sua própria identidade visual (azul jeans, fundo claro),
    // independente do tema escolhido para o site público.
    <div className="min-h-screen bg-panel-bg text-panel-ink admin-safe-area">
      {children}
    </div>
  );
}
