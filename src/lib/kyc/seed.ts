import type { Activity, AdminComment, CategoryId, Client, DocStatus, KycDocument, KycState } from "./types";
import { docTypeLabel } from "./catalog";

export const ADMIN_NAME = "Sophie Laurent";
export const ADMIN_EMAIL = "admin@kyc62.com";
export const DEMO_CLIENT_EMAIL = "camille.martin@exemple.fr";
export const STATE_VERSION = 1;

type SeedDoc = [
  clientIdx: number,
  category: CategoryId,
  docType: string,
  fileName: string,
  uploadedDaysAgo: number,
  status: DocStatus,
  reviewedDaysAgo?: number,
  reason?: string,
  comment?: string,
];

const CLIENTS: Omit<Client, "id" | "ref" | "createdAt">[] = [
  { firstName: "Camille", lastName: "Martin", email: DEMO_CLIENT_EMAIL, phone: "+33 6 12 34 56 78", company: "Atelier Martin SARL", city: "Lille" },
  { firstName: "Thomas", lastName: "Durand", email: "thomas.durand@exemple.fr", phone: "+33 6 22 41 18 90", company: "Durand Conseil", city: "Arras" },
  { firstName: "Léa", lastName: "Bernard", email: "lea.bernard@exemple.fr", phone: "+33 7 81 22 63 14", company: "Indépendante", city: "Lens" },
  { firstName: "Hugo", lastName: "Petit", email: "hugo.petit@exemple.fr", phone: "+33 6 45 77 02 31", company: "Petit Logistique", city: "Béthune" },
  { firstName: "Inès", lastName: "Moreau", email: "ines.moreau@exemple.fr", phone: "+33 6 90 12 44 05", company: "Moreau & Associés", city: "Boulogne-sur-Mer" },
  { firstName: "Lucas", lastName: "Robert", email: "lucas.robert@exemple.fr", phone: "+33 7 66 09 81 27", company: "—", city: "Calais" },
  { firstName: "Chloé", lastName: "Richard", email: "chloe.richard@exemple.fr", phone: "+33 6 31 58 72 46", company: "Studio Richard", city: "Lille" },
  { firstName: "Nathan", lastName: "Simon", email: "nathan.simon@exemple.fr", phone: "+33 6 03 47 91 60", company: "Simon Immobilier", city: "Saint-Omer" },
  { firstName: "Manon", lastName: "Lefèvre", email: "manon.lefevre@exemple.fr", phone: "+33 7 52 13 88 39", company: "Lefèvre Design", city: "Liévin" },
  { firstName: "Antoine", lastName: "Garcia", email: "antoine.garcia@exemple.fr", phone: "+33 6 74 26 35 11", company: "Garcia BTP", city: "Douai" },
];

const JOINED_DAYS_AGO = [42, 60, 21, 35, 28, 3, 18, 75, 12, 30];

const DOCS: SeedDoc[] = [
  // Camille Martin — demo client: mixed statuses
  [0, "identity", "passport", "passeport_camille_martin.pdf", 9, "approved", 8],
  [0, "personal", "proof_of_address", "justificatif_domicile_oct.pdf", 6, "pending"],
  [0, "professional", "payslip", "bulletin_salaire_septembre.jpg", 6, "rejected", 5, "Document illisible", "La photo est floue, les montants ne sont pas lisibles. Merci de transmettre un scan net."],
  [0, "financial", "bank_statement", "releve_bancaire_t3.pdf", 2, "pending"],
  // Thomas Durand — fully approved
  [1, "identity", "national_id", "cni_recto_verso.pdf", 40, "approved", 39],
  [1, "professional", "employment_contract", "contrat_cdi_durand.pdf", 40, "approved", 38],
  [1, "financial", "tax_notice", "avis_imposition_2025.pdf", 39, "approved", 38],
  [1, "personal", "utility_bill", "facture_edf_septembre.pdf", 39, "approved", 37],
  // Léa Bernard — pending review
  [2, "identity", "passport", "passport_lea_bernard.png", 4, "pending"],
  [2, "professional", "cv", "cv_lea_bernard_2026.pdf", 4, "pending"],
  [2, "financial", "proof_of_income", "attestation_revenus.pdf", 3, "pending"],
  // Hugo Petit — rejected
  [3, "identity", "driving_license", "permis_hugo_petit.jpg", 20, "rejected", 18, "Document expiré", "Le permis présenté a expiré en 2024."],
  [3, "personal", "proof_of_address", "quittance_loyer.pdf", 20, "approved", 18],
  [3, "financial", "bank_statement", "releve_compte_aout.pdf", 19, "rejected", 17, "Document incomplet", "Seule la première page du relevé a été transmise."],
  [3, "professional", "payslip", "fiche_paie_aout.pdf", 19, "approved", 17],
  // Inès Moreau — incomplete
  [4, "identity", "national_id", "carte_identite_moreau.pdf", 25, "approved", 24],
  [4, "personal", "insurance", "attestation_assurance_hab.pdf", 25, "approved", 23],
  // Lucas Robert — nothing yet
  // Chloé Richard — pending
  [6, "identity", "residence_permit", "titre_sejour_richard.pdf", 1, "pending"],
  [6, "personal", "proof_of_address", "facture_internet_oct.pdf", 1, "pending"],
  [6, "professional", "employer_certificate", "attestation_employeur.pdf", 2, "approved", 1],
  [6, "financial", "bank_statement", "rib_releve_chloe.pdf", 2, "approved", 1],
  // Nathan Simon — approved
  [7, "identity", "passport", "passeport_simon.pdf", 70, "approved", 68],
  [7, "professional", "payslip", "bulletins_3_derniers_mois.pdf", 70, "approved", 68],
  [7, "financial", "tax_notice", "avis_impot_simon.pdf", 69, "approved", 67],
  [7, "personal", "proof_of_address", "taxe_fonciere_2025.pdf", 69, "approved", 67],
  [7, "other", "misc", "kbis_simon_immobilier.pdf", 30, "approved", 29],
  // Manon Lefèvre — pending
  [8, "identity", "national_id", "cni_manon_lefevre.jpg", 0, "pending"],
  [8, "financial", "proof_of_income", "bilan_2025_lefevre_design.pdf", 5, "rejected", 4, "Informations incohérentes", "Le nom de l'entreprise ne correspond pas au Kbis transmis."],
  [8, "financial", "bank_statement", "releve_pro_septembre.pdf", 0, "pending"],
  [8, "professional", "cv", "cv_manon.pdf", 10, "approved", 9],
  // Antoine Garcia — rejected
  [9, "identity", "passport", "scan_doc_garcia.pdf", 14, "rejected", 12, "Mauvais document transmis", "Le fichier transmis est un devis et non une pièce d'identité."],
  [9, "personal", "utility_bill", "facture_eau_garcia.pdf", 14, "approved", 12],
  [9, "professional", "employment_contract", "contrat_garcia_btp.pdf", 13, "approved", 11],
  [9, "financial", "bank_statement", "releve_garcia_juillet.pdf", 13, "approved", 11],
];

function mimeFor(name: string) {
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".png")) return "image/png";
  return "image/jpeg";
}

/** Built lazily (never at module scope) since it relies on the current date. */
export function buildSeed(): KycState {
  const now = Date.now();
  const day = 86_400_000;
  const at = (daysAgo: number, hour = 10, minute = 0) => {
    const d = new Date(now - daysAgo * day);
    d.setHours(hour, minute, 0, 0);
    return d.toISOString();
  };

  const clients: Client[] = CLIENTS.map((c, i) => ({
    ...c,
    id: `cli_${i + 1}`,
    ref: `KYC-${String(2401 + i * 7).padStart(5, "0")}`,
    createdAt: at(JOINED_DAYS_AGO[i], 9, 15),
  }));

  const documents: KycDocument[] = [];
  const activity: Activity[] = [];

  DOCS.forEach(([ci, category, docType, fileName, up, status, rev, reason, comment], i) => {
    const client = clients[ci];
    const id = `doc_${String(i + 1).padStart(3, "0")}`;
    const uploadedAt = at(up, 9 + (i % 8), (i * 13) % 60);
    const reviewedAt = rev !== undefined ? at(rev, 11 + (i % 6), (i * 7) % 60) : undefined;
    documents.push({
      id,
      clientId: client.id,
      category,
      docType,
      fileName,
      mime: mimeFor(fileName),
      size: 180_000 + ((i * 97_331) % 2_400_000),
      uploadedAt,
      status,
      reviewedAt,
      reviewer: reviewedAt ? ADMIN_NAME : undefined,
      rejectionReason: reason,
      rejectionComment: comment,
      hasFile: false,
    });
    const name = `${client.firstName} ${client.lastName}`;
    activity.push({
      id: `act_u_${id}`,
      at: uploadedAt,
      type: "upload",
      actor: name,
      clientId: client.id,
      docId: id,
      message: `${docTypeLabel(docType)} transmis (${fileName})`,
    });
    if (reviewedAt) {
      activity.push({
        id: `act_r_${id}`,
        at: reviewedAt,
        type: status === "approved" ? "approve" : "reject",
        actor: ADMIN_NAME,
        clientId: client.id,
        docId: id,
        message:
          status === "approved"
            ? `${docTypeLabel(docType)} approuvé`
            : `${docTypeLabel(docType)} refusé — ${reason}`,
      });
    }
  });

  const comments: AdminComment[] = [
    {
      id: "com_1",
      clientId: "cli_1",
      author: ADMIN_NAME,
      at: at(5, 15, 20),
      text: "Client relancé par e-mail pour le bulletin de salaire illisible.",
    },
    {
      id: "com_2",
      clientId: "cli_4",
      author: ADMIN_NAME,
      at: at(17, 16, 5),
      text: "Demander un permis de conduire ou une CNI en cours de validité.",
    },
  ];

  activity.sort((a, b) => b.at.localeCompare(a.at));
  return { version: STATE_VERSION, clients, documents, activity, comments };
}
