"use client";

import { AdminProvider, useAdmin } from "./_components/AdminProviders";
import AdminShell from "./_components/AdminShell";
import LoginCard from "./_components/LoginCard";

function Gate({ children }: { children: React.ReactNode }) {
  const { session, authLoading } = useAdmin();

  if (authLoading) {
    return (
      <div className="grid min-h-screen place-items-center bg-cream text-sm text-taupe">
        Chargement…
      </div>
    );
  }

  if (!session) return <LoginCard />;

  return <AdminShell>{children}</AdminShell>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminProvider>
      <Gate>{children}</Gate>
    </AdminProvider>
  );
}
