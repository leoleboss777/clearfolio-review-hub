import { Check, Clock, X, AlertCircle } from "lucide-react";
import type { DocStatus } from "@/lib/kyc/types";
import type { FileStatus, CategoryState } from "@/lib/kyc/compute";
import { STATUS_LABEL } from "@/lib/kyc/catalog";
import { FILE_STATUS_LABEL } from "@/lib/kyc/compute";
import { cn } from "@/lib/utils";

const TONE = {
  pending: "bg-warning/12 text-warning ring-warning/30",
  approved: "bg-success/12 text-success ring-success/30",
  rejected: "bg-danger/12 text-danger ring-danger/30",
  incomplete: "bg-muted text-muted-foreground ring-border",
  missing: "bg-muted text-muted-foreground ring-border",
} as const;

const ICON = { pending: Clock, approved: Check, rejected: X, incomplete: AlertCircle, missing: AlertCircle };

export function StatusBadge({ status, className }: { status: DocStatus; className?: string }) {
  const Icon = ICON[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE[status],
        className,
      )}
    >
      <Icon className="size-3" strokeWidth={2.5} />
      {STATUS_LABEL[status]}
    </span>
  );
}

export function FileStatusBadge({ status, className }: { status: FileStatus; className?: string }) {
  const Icon = ICON[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE[status],
        className,
      )}
    >
      <Icon className="size-3" strokeWidth={2.5} />
      {FILE_STATUS_LABEL[status]}
    </span>
  );
}

const CAT_LABEL: Record<CategoryState, string> = {
  approved: "Validé",
  pending: "En attente",
  rejected: "Refusé",
  missing: "Manquant",
};

export function CategoryStateBadge({ state }: { state: CategoryState }) {
  const Icon = ICON[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONE[state],
      )}
    >
      <Icon className="size-3" strokeWidth={2.5} />
      {CAT_LABEL[state]}
    </span>
  );
}
