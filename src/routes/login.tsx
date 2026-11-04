import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowLeft, Building2, UserRound, Lock, Mail, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/kyc/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getState, signIn } from "@/lib/kyc/store";
import { ADMIN_EMAIL, ADMIN_NAME, DEMO_CLIENT_EMAIL } from "@/lib/kyc/seed";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Connexion — SESAME62" },
      { name: "description", content: "Accédez à votre espace client ou administrateur SESAME62." },
      { property: "og:title", content: "Connexion — SESAME62" },
      { property: "og:description", content: "Connexion à l'espace client ou administrateur SESAME62." },
    ],
  }),
  component: LoginPage,
});

const DEMO = {
  client: { email: DEMO_CLIENT_EMAIL, password: "client62" },
  admin: { email: ADMIN_EMAIL, password: "admin62" },
};

function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"client" | "admin">("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [forgot, setForgot] = useState(false);

  const fillDemo = (r: "client" | "admin") => {
    setRole(r);
    setEmail(DEMO[r].email);
    setPassword(DEMO[r].password);
    setError(null);
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const mail = email.trim().toLowerCase();
    if (role === "admin") {
      if (mail !== ADMIN_EMAIL || password !== DEMO.admin.password) {
        setError("Identifiants administrateur incorrects. Utilisez l'accès de démonstration.");
        return;
      }
      signIn({ role: "admin", name: ADMIN_NAME, email: ADMIN_EMAIL });
      navigate({ to: "/admin" });
      return;
    }
    const client = getState().clients.find((c) => c.email.toLowerCase() === mail);
    if (!client || password !== DEMO.client.password) {
      setError("Adresse e-mail ou mot de passe incorrect.");
      return;
    }
    signIn({
      role: "client",
      clientId: client.id,
      name: `${client.firstName} ${client.lastName}`,
      email: client.email,
    });
    navigate({ to: "/client" });
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="absolute inset-0 bg-grid" aria-hidden />
      <div className="absolute inset-0 bg-hero" aria-hidden />
      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Link to="/">
          <Logo />
        </Link>
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Retour à l'accueil
        </Link>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-5 pb-16">
        <div className="animate-rise w-full max-w-md">
          <div className="text-center">
            <h1 className="text-3xl font-semibold tracking-tight">Connexion</h1>
            <p className="mt-2 text-sm text-muted-foreground">Choisissez votre espace pour continuer.</p>
          </div>

          <div className="glass mt-8 rounded-2xl p-6">
            <div className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
              {(
                [
                  ["client", "Espace client", UserRound],
                  ["admin", "Espace administrateur", Building2],
                ] as const
              ).map(([r, label, Icon]) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setError(null);
                  }}
                  className={cn(
                    "flex items-center justify-center gap-2 rounded-md px-3 py-2 text-xs font-medium transition-all sm:text-sm",
                    role === r ? "bg-card text-foreground shadow" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="size-4" /> {label}
                </button>
              ))}
            </div>

            {forgot ? (
              <div className="mt-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  Saisissez votre adresse e-mail. Dans la version réelle, un lien de réinitialisation
                  vous serait envoyé.
                </p>
                <Input type="email" placeholder="vous@entreprise.fr" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Button
                  variant="electric"
                  className="w-full"
                  onClick={() => {
                    toast.success("Lien de réinitialisation simulé", {
                      description: "Aucun e-mail n'est envoyé dans ce prototype.",
                    });
                    setForgot(false);
                  }}
                >
                  Envoyer le lien
                </Button>
                <button className="w-full text-center text-sm text-muted-foreground hover:text-foreground" onClick={() => setForgot(false)}>
                  Retour à la connexion
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Adresse e-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="h-10 pl-9"
                      placeholder={role === "admin" ? "admin@entreprise.com" : "vous@exemple.fr"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Mot de passe</Label>
                    <button type="button" onClick={() => setForgot(true)} className="text-xs text-electric hover:underline">
                      Mot de passe oublié ?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className="h-10 pl-9"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                {error && <p className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">{error}</p>}
                <Button type="submit" variant="electric" className="h-10 w-full">
                  Se connecter <ArrowRight />
                </Button>
              </form>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-dashed border-border p-4">
            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Info className="size-3.5" /> Accès de démonstration (aucune authentification réelle)
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button onClick={() => fillDemo("client")} className="glass rounded-lg p-3 text-left text-xs transition hover:shadow-glow">
                <p className="font-medium text-foreground">Client — Camille Martin</p>
                <p className="mt-1 font-mono text-muted-foreground">{DEMO.client.email}</p>
                <p className="font-mono text-muted-foreground">{DEMO.client.password}</p>
              </button>
              <button onClick={() => fillDemo("admin")} className="glass rounded-lg p-3 text-left text-xs transition hover:shadow-glow">
                <p className="font-medium text-foreground">Admin — {ADMIN_NAME}</p>
                <p className="mt-1 font-mono text-muted-foreground">{DEMO.admin.email}</p>
                <p className="font-mono text-muted-foreground">{DEMO.admin.password}</p>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
