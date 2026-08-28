"use client";

import dynamic from "next/dynamic";

const AdminApp = dynamic(() => import("@/components/admin/AdminApp"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-navy-900">
      <div className="text-gold animate-pulse font-display text-lg">
        Carregando painel...
      </div>
    </div>
  ),
});

export default function AdminPage() {
  return <AdminApp />;
}
