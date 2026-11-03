import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useKycState } from "@/lib/kyc/store";
import { AdminPageTitle, Panel, adminSelect } from "@/components/kyc/admin/AdminShell";
import { ActivityTable } from "@/components/kyc/admin/ActivityTable";

export const Route = createFileRoute("/admin/activity")({
  head: () => ({
    meta: [
      { title: "Activity Log — Administration KYC62" },
      { name: "description", content: "Journal d'activité : dépôts, validations, refus." },
      { property: "og:title", content: "Activity Log — KYC62" },
      { property: "og:description", content: "Journal d'activité des dossiers KYC." },
    ],
  }),
  component: ActivityLog,
});

function ActivityLog() {
  const { activity } = useKycState();
  const [type, setType] = useState("all");
  const items = activity.filter((a) => type === "all" || a.type === type);
  return (
    <>
      <AdminPageTitle title="Activity Log" subtitle="Traçabilité complète des actions clients et administrateurs." />
      <Panel
        title={`${items.length} événement(s)`}
        action={
          <select className={adminSelect} value={type} onChange={(e) => setType(e.target.value)} aria-label="Type">
            <option value="all">Tous les événements</option>
            <option value="upload">Dépôts</option>
            <option value="approve">Validations</option>
            <option value="reject">Refus</option>
            <option value="delete">Suppressions</option>
            <option value="comment">Commentaires</option>
          </select>
        }
      >
        <ActivityTable items={items} />
      </Panel>
    </>
  );
}
