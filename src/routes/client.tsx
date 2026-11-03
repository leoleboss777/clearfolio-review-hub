import { createFileRoute, Navigate, Outlet, ClientOnly } from "@tanstack/react-router";
import { ClientShell } from "@/components/kyc/client/ClientShell";
import { useKycState, useSession } from "@/lib/kyc/store";

export const Route = createFileRoute("/client")({
  head: () => ({
    meta: [
      { title: "Espace client — KYC62" },
      { name: "description", content: "Déposez vos justificatifs et suivez la validation de votre dossier KYC." },
      { property: "og:title", content: "Espace client — KYC62" },
      { property: "og:description", content: "Votre espace de dépôt et de suivi des documents KYC." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ClientLayout,
});

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="size-6 animate-spin rounded-full border-2 border-electric border-t-transparent" />
    </div>
  );
}

function ClientLayout() {
  return (
    <ClientOnly fallback={<Loading />}>
      <Guarded />
    </ClientOnly>
  );
}

function Guarded() {
  const session = useSession();
  const { clients } = useKycState();
  const client = clients.find((c) => c.id === session?.clientId);
  if (!session || session.role !== "client" || !client) return <Navigate to="/login" />;
  return (
    <ClientShell client={client}>
      <Outlet />
    </ClientShell>
  );
}
