import { createFileRoute } from "@tanstack/react-router";
import { AdminPageTitle } from "@/components/kyc/admin/AdminShell";
import { DocumentsTable } from "@/components/kyc/admin/DocumentsTable";

export const Route = createFileRoute("/admin/rejected")({
  head: () => ({
    meta: [
      { title: "Rejected Documents — Administration SESAME62" },
      { name: "description", content: "Documents KYC refusés et leurs motifs." },
      { property: "og:title", content: "Rejected Documents — SESAME62" },
      { property: "og:description", content: "Documents KYC refusés." },
    ],
  }),
  component: () => (
    <>
      <AdminPageTitle title="Rejected Documents" subtitle="Justificatifs refusés — le motif est communiqué au client." />
      <DocumentsTable presetStatus="rejected" />
    </>
  ),
});
