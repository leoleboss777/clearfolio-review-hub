import { REQUIRED_CATEGORIES } from "./catalog";
import type { CategoryId, KycDocument } from "./types";

export type CategoryState = "approved" | "pending" | "rejected" | "missing";
export type FileStatus = "approved" | "pending" | "rejected" | "incomplete";

/** State of one category: approved wins, then pending, then rejected, else missing. */
export function categoryState(docs: KycDocument[], category: CategoryId): CategoryState {
  const inCat = docs.filter((d) => d.category === category);
  if (inCat.some((d) => d.status === "approved")) return "approved";
  if (inCat.some((d) => d.status === "pending")) return "pending";
  if (inCat.some((d) => d.status === "rejected")) return "rejected";
  return "missing";
}

/**
 * Global KYC file status:
 * - approved: every required category has an approved document
 * - pending: something still waits for review
 * - rejected: a required category only holds rejected documents
 * - incomplete: required categories missing, nothing to review
 */
export function clientFileStatus(docs: KycDocument[]): FileStatus {
  const states = REQUIRED_CATEGORIES.map((c) => categoryState(docs, c));
  if (states.every((s) => s === "approved")) return "approved";
  if (docs.some((d) => d.status === "pending")) return "pending";
  if (states.some((s) => s === "rejected")) return "rejected";
  return "incomplete";
}

export function clientProgress(docs: KycDocument[]) {
  const total = REQUIRED_CATEGORIES.length;
  const done = REQUIRED_CATEGORIES.filter((c) => categoryState(docs, c) === "approved").length;
  return { done, total, pct: Math.round((done / total) * 100) };
}

export function countStatus(docs: KycDocument[]) {
  return {
    total: docs.length,
    pending: docs.filter((d) => d.status === "pending").length,
    approved: docs.filter((d) => d.status === "approved").length,
    rejected: docs.filter((d) => d.status === "rejected").length,
  };
}

export const FILE_STATUS_LABEL: Record<FileStatus, string> = {
  approved: "Validé",
  pending: "En attente",
  rejected: "Refusé",
  incomplete: "Incomplet",
};
