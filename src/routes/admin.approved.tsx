import { createFileRoute } from "@tanstack/react-router";
import { AdminPageTitle } from "@/components/kyc/admin/AdminShell";
import { DocumentsTable } from "@/components/kyc/admin/DocumentsTable";

export const Route = createFileRoute("/admin/approved")({
  head: () => ({
    meta: [
      { title: "Approved Documents — Administration SESAME62" },
      { name: "description", content: "Documents KYC approuvés." },
      { property: "og:title", content: "Approved Documents — SESAME62" },
      { property: "og:description", content: "Documents KYC approuvés." },
    ],
  }),
  component: () => (
    <>
      <AdminPageTitle title="Approved Documents" subtitle="Justificatifs validés par l'équipe conformité." />
      <DocumentsTable presetStatus="approved" />
    </>
  ),
});
