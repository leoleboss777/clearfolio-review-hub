import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, startOfDay, subDays } from "date-fns";
import { fr } from "date-fns/locale";
import { useKycState } from "@/lib/kyc/store";
import { clientFileStatus, countStatus } from "@/lib/kyc/compute";
import { AdminPageTitle, Panel } from "@/components/kyc/admin/AdminShell";
import { ActivityTable } from "@/components/kyc/admin/ActivityTable";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Administration KYC62" },
      { name: "description", content: "Indicateurs de traitement des dossiers KYC." },
      { property: "og:title", content: "Dashboard — KYC62" },
      { property: "og:description", content: "Indicateurs de traitement des dossiers KYC." },
    ],
  }),
  component: Dashboard,
});

const axis = { fontSize: 11, fill: "var(--muted-foreground)" };

function Dashboard() {
  const { clients, documents, activity } = useKycState();

  const kpi = useMemo(() => {
    const statuses = clients.map((c) => clientFileStatus(documents.filter((d) => d.clientId === c.id)));
    const ds = countStatus(documents);
    const decided = ds.approved + ds.rejected;
    return {
      total: clients.length,
      pending: statuses.filter((s) => s === "pending").length,
      approved: statuses.filter((s) => s === "approved").length,
      rejected: statuses.filter((s) => s === "rejected").length,
      incomplete: statuses.filter((s) => s === "incomplete").length,
      toReview: ds.pending,
      rate: decided ? Math.round((ds.approved / decided) * 100) : 0,
      ds,
    };
  }, [clients, documents]);

  const series = useMemo(() => {
    const today = startOfDay(new Date());
    return Array.from({ length: 14 }).map((_, i) => {
      const dayStart = subDays(today, 13 - i);
      const dayEnd = new Date(dayStart.getTime() + 86_400_000);
      const inDay = (iso?: string) => !!iso && new Date(iso) >= dayStart && new Date(iso) < dayEnd;
      const approvals = documents.filter((d) => d.status === "approved" && inDay(d.reviewedAt)).length;
      const rejections = documents.filter((d) => d.status === "rejected" && inDay(d.reviewedAt)).length;
      const received = documents.filter((d) => inDay(d.uploadedAt)).length;
      const pending = documents.filter(
        (d) => new Date(d.uploadedAt) < dayEnd && (!d.reviewedAt || new Date(d.reviewedAt) >= dayEnd),
      ).length;
      return { day: format(dayStart, "dd MMM", { locale: fr }), approvals, rejections, received, pending };
    });
  }, [documents]);

  const cards = [
    { label: "Total dossiers clients", value: kpi.total, tone: "border-l-primary" },
    { label: "Dossiers en attente", value: kpi.pending, tone: "border-l-warning" },
    { label: "Dossiers validés", value: kpi.approved, tone: "border-l-success" },
    { label: "Dossiers refusés", value: kpi.rejected, tone: "border-l-danger" },
    { label: "Documents à examiner", value: kpi.toReview, tone: "border-l-warning", link: true },
    { label: "Taux de validation", value: `${kpi.rate}%`, tone: "border-l-primary" },
  ];

  return (
    <>
      <AdminPageTitle
        title="Tableau de bord"
        subtitle="Synthèse de l'activité de vérification KYC."
        action={
          <Button asChild size="sm">
            <Link to="/admin/pending">Traiter les documents en attente ({kpi.toReview})</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <div key={c.label} className={cn("rounded-md border border-l-4 bg-card px-4 py-3", c.tone)}>
            <p className="text-xs text-muted-foreground">{c.label}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Volume de documents traités — 14 jours" className="xl:col-span-2">
          <div className="h-64 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={series} barCategoryGap="25%">
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tick={axis} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tick={axis} tickLine={false} axisLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 4, border: "1px solid var(--border)", fontSize: 12 }} cursor={{ fill: "var(--muted)" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="approvals" name="Validations" stackId="a" fill="var(--chart-2)" />
                <Bar dataKey="rejections" name="Refus" stackId="a" fill="var(--chart-3)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="received" name="Reçus" fill="var(--chart-1)" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Documents en attente">
          <div className="h-64 p-3">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="day" tick={axis} tickLine={false} axisLine={false} interval={3} />
                <YAxis allowDecimals={false} tick={axis} tickLine={false} axisLine={false} width={28} />
                <Tooltip contentStyle={{ borderRadius: 4, border: "1px solid var(--border)", fontSize: 12 }} />
                <Line type="monotone" dataKey="pending" name="En attente" stroke="var(--chart-4)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Répartition des documents">
          <div className="space-y-4 p-4">
            {(
              [
                ["Approved", kpi.ds.approved, "bg-success"],
                ["Pending", kpi.ds.pending, "bg-warning"],
                ["Rejected", kpi.ds.rejected, "bg-danger"],
              ] as const
            ).map(([l, v, c]) => (
              <div key={l}>
                <div className="flex justify-between text-sm">
                  <span>{l}</span>
                  <span className="tabular-nums text-muted-foreground">
                    {v} / {kpi.ds.total}
                  </span>
                </div>
                <div className="mt-1.5 h-2 rounded-sm bg-muted">
                  <div className={cn("h-full rounded-sm", c)} style={{ width: `${kpi.ds.total ? (v / kpi.ds.total) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
            <div className="border-t pt-3 text-sm text-muted-foreground">
              Dossiers incomplets : <span className="font-semibold text-foreground">{kpi.incomplete}</span>
            </div>
          </div>
        </Panel>
        <Panel
          title="Dernières activités"
          className="xl:col-span-2"
          action={<Link to="/admin/activity" className="text-xs font-medium text-primary hover:underline">Journal complet</Link>}
        >
          <ActivityTable items={activity.slice(0, 8)} compact />
        </Panel>
      </div>
    </>
  );
}
