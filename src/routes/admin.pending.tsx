import { createFileRoute } from "@tanstack/react-router";
import { AdminPageTitle } from "@/components/kyc/admin/AdminShell";
import { DocumentsTable } from "@/components/kyc/admin/DocumentsTable";

export const Route = createFileRoute("/admin/pending")({
  head: () => ({
    meta: [
      { title: "Pending Reviews — Administration KYC62" },
      { name: "description", content: "File des documents en attente de vérification." },
      { property: "og:title", content: "Pending Reviews — KYC62" },
      { property: "og:description", content: "Documents en attente de vérification." },
    ],
  }),
  component: () => (
    <>
      <AdminPageTitle title="Pending Reviews" subtitle="Documents en attente de vérification — les plus anciens en premier." />
      <DocumentsTable presetStatus="pending" />
    </>
  ),
});
