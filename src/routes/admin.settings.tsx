import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import { AdminPageTitle, Panel } from "@/components/kyc/admin/AdminShell";
import { useSession, resetDemo } from "@/lib/kyc/store";
import { REJECTION_REASONS, CATEGORIES } from "@/lib/kyc/catalog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Administration SESAME62" },
      { name: "description", content: "Paramètres de l'espace administrateur SESAME62." },
      { property: "og:title", content: "Settings — SESAME62" },
      { property: "og:description", content: "Paramètres administrateur." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const session = useSession();
  return (
    <>
      <AdminPageTitle title="Settings" subtitle="Organisation, référentiels et données de démonstration." />
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Compte">
          <dl className="grid grid-cols-3 gap-y-3 p-4 text-sm">
            <dt className="text-muted-foreground">Nom</dt>
            <dd className="col-span-2 font-medium">{session?.name}</dd>
            <dt className="text-muted-foreground">E-mail</dt>
            <dd className="col-span-2">{session?.email}</dd>
            <dt className="text-muted-foreground">Rôle</dt>
            <dd className="col-span-2">Administrateur — Compliance Officer</dd>
            <dt className="text-muted-foreground">Organisation</dt>
            <dd className="col-span-2">SESAME62 Démo SAS</dd>
          </dl>
        </Panel>
        <Panel title="Motifs de refus">
          <ul className="divide-y text-sm">
            {REJECTION_REASONS.map((r) => (
              <li key={r} className="px-4 py-2">{r}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="Catégories documentaires">
          <table className="w-full text-sm">
            <tbody>
              {CATEGORIES.map((c) => (
                <tr key={c.id} className="border-b last:border-0">
                  <td className="px-4 py-2 font-medium">{c.label}</td>
                  <td className="px-4 py-2 text-muted-foreground">{c.types.map((t) => t.label).join(", ")}</td>
                  <td className="px-4 py-2 text-right text-xs">{c.required ? "Obligatoire" : "Facultatif"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
        <Panel title="Données de démonstration">
          <div className="space-y-3 p-4 text-sm">
            <p className="text-muted-foreground">
              Toutes les données sont stockées localement dans ce navigateur. Vous pouvez restaurer le
              jeu de données initial (les fichiers déposés seront supprimés).
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RotateCcw /> Réinitialiser la démo
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Réinitialiser les données ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Clients, documents, décisions et historique reviendront à leur état initial.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await resetDemo();
                      toast.success("Données de démonstration restaurées");
                    }}
                  >
                    Réinitialiser
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </Panel>
      </div>
    </>
  );
}
