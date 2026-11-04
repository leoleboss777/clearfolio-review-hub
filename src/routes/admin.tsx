import { createFileRoute, Navigate, Outlet, ClientOnly } from "@tanstack/react-router";
import { AdminShell } from "@/components/kyc/admin/AdminShell";
import { useSession } from "@/lib/kyc/store";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — SESAME62" },
      { name: "description", content: "Back-office de vérification des documents KYC." },
      { property: "og:title", content: "Administration — SESAME62" },
      { property: "og:description", content: "Back-office de vérification des documents KYC." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <ClientOnly
      fallback={
        <div className="theme-admin flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Chargement…
        </div>
      }
    >
      <Guarded />
    </ClientOnly>
  );
}

function Guarded() {
  const session = useSession();
  if (!session || session.role !== "admin") return <Navigate to="/login" />;
  return (
    <AdminShell session={session}>
      <Outlet />
    </AdminShell>
  );
}
