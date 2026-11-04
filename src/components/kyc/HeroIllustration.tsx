import { Check, Clock, X, ShieldCheck, FileText, FileImage, LayoutDashboard, Folder } from "lucide-react";

/** Coded illustration of the platform: dashboard preview, documents and statuses. */
export function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-5xl">
      <div className="absolute -inset-x-10 -top-10 bottom-0 bg-hero blur-2xl" aria-hidden />
      <div className="glass relative overflow-hidden rounded-2xl">
        <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
          <span className="size-2.5 rounded-full bg-danger/70" />
          <span className="size-2.5 rounded-full bg-warning/70" />
          <span className="size-2.5 rounded-full bg-success/70" />
          <span className="ml-3 rounded-md bg-muted px-3 py-0.5 font-mono text-[11px] text-muted-foreground">
            app.sesame62.com/overview
          </span>
        </div>
        <div className="grid grid-cols-12">
          <aside className="col-span-3 hidden border-r border-border p-4 sm:block">
            {[
              [LayoutDashboard, "Overview", true],
              [Folder, "My Documents", false],
              [ShieldCheck, "Identity", false],
              [FileText, "Financial", false],
            ].map(([Icon, label, active], i) => {
              const I = Icon as typeof Folder;
              return (
                <div
                  key={i}
                  className={
                    "mb-1 flex items-center gap-2 rounded-md px-2.5 py-2 text-xs " +
                    (active ? "bg-accent text-foreground" : "text-muted-foreground")
                  }
                >
                  <I className="size-3.5" /> {label as string}
                </div>
              );
            })}
          </aside>
          <div className="col-span-12 space-y-4 p-5 sm:col-span-9">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Validés", "6", "text-success"],
                ["En attente", "3", "text-warning"],
                ["Refusés", "1", "text-danger"],
              ].map(([l, v, c]) => (
                <div key={l} className="rounded-xl border border-border bg-surface-2/60 p-3">
                  <p className="text-[11px] text-muted-foreground">{l}</p>
                  <p className={`mt-1 text-2xl font-semibold ${c}`}>{v}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border bg-surface-2/60 p-3">
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Progression du dossier KYC</span>
                <span className="font-mono text-foreground">75%</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-3/4 rounded-full bg-electric-gradient" />
              </div>
            </div>
            <div className="divide-y divide-border rounded-xl border border-border">
              {[
                [FileText, "passeport_martin.pdf", "Passport", "approved"],
                [FileImage, "bulletin_septembre.jpg", "Payslip", "rejected"],
                [FileText, "releve_bancaire_t3.pdf", "Bank Statement", "pending"],
              ].map(([Icon, f, t, s]) => {
                const I = Icon as typeof FileText;
                return (
                  <div key={f as string} className="flex items-center gap-3 px-3 py-2.5">
                    <I className="size-4 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs">{f as string}</p>
                      <p className="text-[10px] text-muted-foreground">{t as string}</p>
                    </div>
                    <Chip s={s as string} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="animate-float absolute -left-4 bottom-6 border border-border bg-card shadow-lg hidden w-56 rounded-xl p-3 md:block">
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-success/15 text-success">
            <Check className="size-4" strokeWidth={3} />
          </span>
          <div>
            <p className="text-xs font-medium">Passport approuvé</p>
            <p className="text-[10px] text-muted-foreground">il y a 2 minutes</p>
          </div>
        </div>
      </div>
      <div
        className="animate-float absolute -right-4 -bottom-6 border border-border bg-card shadow-lg hidden w-60 rounded-xl p-3 md:block"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-danger/15 text-danger">
            <X className="size-4" strokeWidth={3} />
          </span>
          <div>
            <p className="text-xs font-medium">Payslip refusé</p>
            <p className="text-[10px] text-muted-foreground">Motif : document illisible</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Chip({ s }: { s: string }) {
  if (s === "approved")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/12 px-2 py-0.5 text-[10px] text-success">
        <Check className="size-3" /> Approved
      </span>
    );
  if (s === "rejected")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-danger/12 px-2 py-0.5 text-[10px] text-danger">
        <X className="size-3" /> Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-warning/12 px-2 py-0.5 text-[10px] text-warning">
      <Clock className="size-3" /> Pending
    </span>
  );
}
