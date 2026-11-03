import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  FolderArchive,
  Clock,
  CheckCircle2,
  XCircle,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "../Logo";
import { signOut, useKycState } from "@/lib/kyc/store";
import type { Session } from "@/lib/kyc/types";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/clients", label: "Clients", icon: Users },
  { to: "/admin/files", label: "All KYC Files", icon: FolderArchive },
  { to: "/admin/pending", label: "Pending Reviews", icon: Clock, badge: "pending" },
  { to: "/admin/approved", label: "Approved Documents", icon: CheckCircle2 },
  { to: "/admin/rejected", label: "Rejected Documents", icon: XCircle },
  { to: "/admin/activity", label: "Activity Log", icon: History },
] as const;

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const { documents } = useKycState();
  const pending = documents.filter((d) => d.status === "pending").length;
  const cls =
    "flex items-center gap-2.5 rounded px-3 py-2 text-[13px] font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  const active = { className: "bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sidebar-primary" };
  return (
    <nav className="flex flex-1 flex-col">
      <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">Navigation</p>
      <div className="space-y-0.5">
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className={cls}
            activeProps={active}
            activeOptions={{ exact: "exact" in n }}
            onClick={onNavigate}
          >
            <n.icon className="size-4 opacity-80" />
            <span className="flex-1">{n.label}</span>
            {"badge" in n && pending > 0 && (
              <span className="rounded bg-warning px-1.5 text-[11px] font-semibold text-warning-foreground">{pending}</span>
            )}
          </Link>
        ))}
      </div>
      <div className="mt-auto space-y-0.5 border-t border-sidebar-border pt-3">
        <Link to="/admin/settings" className={cls} activeProps={active} onClick={onNavigate}>
          <Settings className="size-4 opacity-80" /> Settings
        </Link>
        <button
          className={cn(cls, "w-full")}
          onClick={() => {
            signOut();
            navigate({ to: "/login" });
          }}
        >
          <LogOut className="size-4 opacity-80" /> Logout
        </button>
      </div>
    </nav>
  );
}

export function AdminShell({ session, children }: { session: Session; children: ReactNode }) {
  const [open, setOpen] = useState(false);

  // Portals (dialogs, toasts) mount on <body>: scope the admin theme there too.
  useEffect(() => {
    document.body.classList.add("theme-admin");
    return () => document.body.classList.remove("theme-admin");
  }, []);

  const sidebar = (
    <>
      <div className="flex h-14 items-center border-b border-sidebar-border px-4 text-sidebar-accent-foreground">
        <Logo tone="admin" />
        <span className="ml-2 rounded border border-sidebar-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/70">
          Admin
        </span>
      </div>
      <div className="flex flex-1 flex-col p-3">
        <Nav onNavigate={() => setOpen(false)} />
      </div>
      <div className="border-t border-sidebar-border p-3 text-sidebar-foreground">
        <p className="text-[13px] font-medium text-sidebar-accent-foreground">{session.name}</p>
        <p className="text-[11px] opacity-70">Compliance Officer</p>
      </div>
    </>
  );

  return (
    <div className="theme-admin min-h-screen">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col bg-sidebar lg:flex">{sidebar}</aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-64 flex-col bg-sidebar">
            <button onClick={() => setOpen(false)} className="absolute right-2 top-3 rounded p-1.5 text-sidebar-foreground" aria-label="Fermer">
              <X className="size-5" />
            </button>
            {sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b bg-card px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="rounded p-1.5 lg:hidden" aria-label="Menu">
              <Menu className="size-5" />
            </button>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">KYC62</span> · Back-office conformité
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground sm:inline">{session.email}</span>
            <span className="flex size-8 items-center justify-center rounded bg-primary text-xs font-semibold text-primary-foreground">
              {session.name.split(" ").map((p) => p[0]).join("")}
            </span>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

export function AdminPageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 border-b pb-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({ title, action, children, className }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-md border bg-card", className)}>
      {title && (
        <div className="flex items-center justify-between border-b px-4 py-2.5">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export const adminSelect =
  "h-9 rounded border border-input bg-card px-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/30";
