import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { getSiteContent } from "@/lib/get-content";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-theme={getSiteContent().tema}
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
