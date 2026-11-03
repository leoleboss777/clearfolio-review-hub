import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/", label: "Accueil" },
  { to: "/fonctionnalites", label: "Fonctionnalités" },
  { to: "/solutions", label: "Solutions entreprises" },
  { to: "/a-propos", label: "À propos" },
] as const;

export function MarketingShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link to="/" aria-label="KYC62 — accueil">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: true }}
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:block">
            <Button asChild variant="electric" size="sm">
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
          <button
            className="rounded-md p-2 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
        {open && (
          <div className="border-t border-border/60 px-5 py-3 md:hidden">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="block rounded-md px-2 py-2.5 text-sm text-muted-foreground"
              >
                {n.label}
              </Link>
            ))}
            <Button asChild variant="electric" className="mt-2 w-full">
              <Link to="/login">Se connecter</Link>
            </Button>
          </div>
        )}
      </header>
      <main>{children}</main>
      <footer className="border-t border-border/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Plateforme B2B de centralisation et de validation des documents KYC.
            </p>
            <p className="mt-4 max-w-sm text-xs text-muted-foreground/70">
              Prototype de démonstration : aucun fichier n'est envoyé vers un serveur, aucune
              vérification d'identité réelle n'est effectuée.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-medium">Produit</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li><Link to="/fonctionnalites" className="hover:text-foreground">Fonctionnalités</Link></li>
              <li><Link to="/solutions" className="hover:text-foreground">Solutions entreprises</Link></li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="font-medium">Société</p>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li><Link to="/a-propos" className="hover:text-foreground">À propos</Link></li>
              <li><Link to="/login" className="hover:text-foreground">Se connecter</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
          © 2026 KYC62 — Pas-de-Calais, France
        </div>
      </footer>
    </div>
  );
}

export function SectionHeading({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-electric">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {text && <p className="mt-4 text-muted-foreground">{text}</p>}
    </div>
  );
}
