import type { CategoryId, DocStatus, KycDocument } from "./types";

export interface DocTypeDef {
  id: string;
  label: string;
}

export interface CategoryDef {
  id: CategoryId;
  label: string;
  labelFr: string;
  description: string;
  required: boolean;
  types: DocTypeDef[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: "identity",
    label: "Identity",
    labelFr: "Identité",
    description: "Pièce d'identité officielle en cours de validité.",
    required: true,
    types: [
      { id: "passport", label: "Passport" },
      { id: "national_id", label: "National ID" },
      { id: "driving_license", label: "Driving License" },
      { id: "residence_permit", label: "Residence Permit" },
    ],
  },
  {
    id: "professional",
    label: "Professional",
    labelFr: "Professionnel",
    description: "Justificatifs de situation professionnelle.",
    required: true,
    types: [
      { id: "payslip", label: "Payslip" },
      { id: "employment_contract", label: "Employment Contract" },
      { id: "employer_certificate", label: "Employer Certificate" },
      { id: "cv", label: "CV" },
    ],
  },
  {
    id: "financial",
    label: "Financial",
    labelFr: "Financier",
    description: "Relevés et justificatifs de revenus.",
    required: true,
    types: [
      { id: "bank_statement", label: "Bank Statement" },
      { id: "tax_notice", label: "Tax Notice" },
      { id: "proof_of_income", label: "Proof of Income" },
    ],
  },
  {
    id: "personal",
    label: "Personal",
    labelFr: "Personnel",
    description: "Justificatifs de domicile et documents personnels.",
    required: true,
    types: [
      { id: "proof_of_address", label: "Proof of Address" },
      { id: "utility_bill", label: "Utility Bill" },
      { id: "insurance", label: "Insurance" },
      { id: "medical", label: "Medical Documents" },
    ],
  },
  {
    id: "other",
    label: "Other Documents",
    labelFr: "Autres",
    description: "Tout autre document utile à votre dossier.",
    required: false,
    types: [{ id: "misc", label: "Miscellaneous Documents" }],
  },
];

export const REQUIRED_CATEGORIES = CATEGORIES.filter((c) => c.required).map((c) => c.id);

export function getCategory(id: string): CategoryDef | undefined {
  return CATEGORIES.find((c) => c.id === id);
}

export function docTypeLabel(typeId: string): string {
  for (const c of CATEGORIES) {
    const t = c.types.find((t) => t.id === typeId);
    if (t) return t.label;
  }
  return typeId;
}

export const STATUS_LABEL: Record<DocStatus, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
};

export const REJECTION_REASONS = [
  "Document illisible",
  "Document expiré",
  "Document incomplet",
  "Informations incohérentes",
  "Mauvais document transmis",
  "Autre motif",
] as const;

export const ACCEPTED_EXT = ["pdf", "jpg", "jpeg", "png"];
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function fileExt(name: string): string {
  const i = name.lastIndexOf(".");
  return i >= 0 ? name.slice(i + 1).toLowerCase() : "";
}

export function isAcceptedFile(name: string): boolean {
  return ACCEPTED_EXT.includes(fileExt(name));
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

/** Documents can be deleted by the client unless they have been approved. */
export function canClientDelete(doc: KycDocument): boolean {
  return doc.status !== "approved";
}
