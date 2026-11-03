import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  IdCard,
  Briefcase,
  Landmark,
  Home,
  Files,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "../Logo";
import { signOut } from "@/lib/kyc/store";
import type { Client } from "@/lib/kyc/types";
import { cn } from "@/lib/utils";

type NavItem =
  | { to: "/client" | "/client/documents" | "/client/settings"; label: string; icon: typeof Home }
  | { to: "/client/category/$category"; category: string; label: string; icon: typeof Home };

const NAV: NavItem[] = [
  { to: "/client", label: "Overview", icon: LayoutDashboard },
  { to: "/client/documents", label: "My Documents", icon: FolderOpen },
  { to: "/client/category/$category", category: "identity", label: "Identity", icon: IdCard },
  { to: "/client/category/$category", category: "professional", label: "Professional", icon: Briefcase },
  { to: "/client/category/$category", category: "financial", label: "Financial", icon: Landmark },
  { to: "/client/category/$category", category: "personal", label: "Personal", icon: Home },
  { to: "/client/category/$category", category: "other", label: "Other Documents", icon: Files },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const navigate = useNavigate();
  const cls =
    "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/75 transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground";
  const active = { className: "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_var(--electric)]" };
  return (
    <nav className="flex flex-1 flex-col gap-0.5">
      <p className="px-3 pb-2 pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Espace</p>
      {NAV.slice(0, 2).map((n) => (
        <Link key={n.label} to={n.to as "/client"} className={cls} activeProps={active} activeOptions={{ exact: true }} onClick={onNavigate}>
          <n.icon className="size-4" /> {n.label}
        </Link>
      ))}
      <p className="px-3 pb-2 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">Catégories</p>
      {NAV.slice(2).map((n) => (
        <Link
          key={n.label}
          to="/client/category/$category"
          params={{ category: "category" in n ? n.category : "" }}
          className={cls}
          activeProps={active}
          onClick={onNavigate}
        >
          <n.icon className="size-4" /> {n.label}
        </Link>
      ))}
      <div className="mt-auto space-y-0.5 pt-6">
        <Link to="/client/settings" className={cls} activeProps={active} onClick={onNavigate}>
          <Settings className="size-4" /> Settings
        </Link>
        <button
          className={cn(cls, "w-full")}
          onClick={() => {
            signOut();
            navigate({ to: "/login" });
          }}
        >
          <LogOut className="size-4" /> Logout
        </button>
      </div>
    </nav>
  );
}

export function ClientShell({ client, children }: { client: Client; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const initials = `${client.firstName[0]}${client.lastName[0]}`;
  const user = (
    <div className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/50 p-2.5">
      <span className="flex size-9 items-center justify-center rounded-lg bg-electric-gradient text-sm font-semibold text-primary-foreground">
        {initials}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{client.firstName} {client.lastName}</p>
        <p className="truncate font-mono text-[11px] text-muted-foreground">{client.ref}</p>
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar p-4 lg:flex">
        <Link to="/" className="mb-6 px-2 pt-1">
          <Logo />
        </Link>
        <NavLinks />
        <div className="mt-4">{user}</div>
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl lg:hidden">
        <Logo />
        <button onClick={() => setOpen(true)} aria-label="Ouvrir le menu" className="rounded-md p-2">
          <Menu className="size-5" />
        </button>
      </header>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="animate-rise absolute inset-y-0 left-0 flex w-72 flex-col border-r border-sidebar-border bg-sidebar p-4">
            <div className="mb-6 flex items-center justify-between px-2">
              <Logo />
              <button onClick={() => setOpen(false)} aria-label="Fermer" className="rounded-md p-1.5">
                <X className="size-5" />
              </button>
            </div>
            <NavLinks onNavigate={() => setOpen(false)} />
            <div className="mt-4">{user}</div>
          </aside>
        </div>
      )}

      <main className="relative lg:pl-64">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-hero opacity-60" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10">{children}</div>
      </main>
    </div>
  );
}

export function PageHeader({ eyebrow, title, text, action }: { eyebrow?: string; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="animate-rise mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        {eyebrow && <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-electric">{eyebrow}</p>}
        <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {text && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{text}</p>}
      </div>
      {action}
    </div>
  );
}
