import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteContent } from "@/lib/get-content";

const content = getSiteContent();

export const metadata: Metadata = {
  title: content.site.title,
  description: content.site.description,
  icons: {
    icon: content.site.favicon,
    apple: content.site.favicon,
  },
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header header={content.header} />
      <main className="flex-1">{children}</main>
      <Footer footer={content.footer} contatos={content.contatos} />
    </div>
  );
}
