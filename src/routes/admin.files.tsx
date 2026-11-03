import { createFileRoute } from "@tanstack/react-router";
import { AdminPageTitle } from "@/components/kyc/admin/AdminShell";
import { DocumentsTable } from "@/components/kyc/admin/DocumentsTable";

export const Route = createFileRoute("/admin/files")({
  head: () => ({
    meta: [
      { title: "All KYC Files — Administration KYC62" },
      { name: "description", content: "Tous les documents KYC transmis par les clients." },
      { property: "og:title", content: "All KYC Files — KYC62" },
      { property: "og:description", content: "Tous les documents KYC transmis." },
    ],
  }),
  component: () => (
    <>
      <AdminPageTitle title="Documents à vérifier" subtitle="Ensemble des justificatifs transmis, filtrables par catégorie et statut." />
      <DocumentsTable />
    </>
  ),
});
