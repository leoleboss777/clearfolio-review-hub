import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/kyc/client/ClientShell";
import { useCurrentClient } from "@/lib/kyc/hooks";
import { updateClient } from "@/lib/kyc/store";
import { fmtDate } from "@/lib/kyc/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/client/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Espace client SESAME62" },
      { name: "description", content: "Vos informations personnelles SESAME62." },
      { property: "og:title", content: "Settings — SESAME62" },
      { property: "og:description", content: "Paramètres de votre compte client." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { client } = useCurrentClient();
  const [form, setForm] = useState({
    firstName: client.firstName,
    lastName: client.lastName,
    phone: client.phone,
    company: client.company,
    city: client.city,
  });

  const save = (e: FormEvent) => {
    e.preventDefault();
    updateClient(client.id, form);
    toast.success("Informations mises à jour");
  };

  const field = (k: keyof typeof form, label: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} className="h-10" value={form[k]} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
    </div>
  );

  return (
    <>
      <PageHeader eyebrow="Settings" title="Paramètres" text="Gérez les informations associées à votre dossier." />
      <form onSubmit={save} className="glass max-w-2xl space-y-5 rounded-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {field("firstName", "Prénom")}
          {field("lastName", "Nom")}
          {field("phone", "Téléphone")}
          {field("city", "Ville")}
        </div>
        {field("company", "Entreprise")}
        <div className="grid gap-4 border-t border-border pt-5 text-sm sm:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">E-mail</p>
            <p className="mt-1 truncate">{client.email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Identifiant client</p>
            <p className="mt-1 font-mono">{client.ref}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Inscrit le</p>
            <p className="mt-1">{fmtDate(client.createdAt)}</p>
          </div>
        </div>
        <Button type="submit" variant="electric">Enregistrer</Button>
      </form>
    </>
  );
}
