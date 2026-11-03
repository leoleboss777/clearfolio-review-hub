import { FileImage, FileText, File as FileGeneric } from "lucide-react";
import { fileExt } from "@/lib/kyc/catalog";
import { cn } from "@/lib/utils";

export function FileIcon({ name, className }: { name: string; className?: string }) {
  const ext = fileExt(name);
  const Icon = ext === "pdf" ? FileText : ["jpg", "jpeg", "png"].includes(ext) ? FileImage : FileGeneric;
  return <Icon className={cn("size-5", className)} aria-hidden />;
}

export function FileBadge({ name, className }: { name: string; className?: string }) {
  const ext = fileExt(name).toUpperCase() || "FILE";
  const tone =
    ext === "PDF"
      ? "bg-danger/12 text-danger"
      : ext === "PNG"
        ? "bg-primary/12 text-primary"
        : "bg-violet/15 text-violet";
  return (
    <span
      className={cn(
        "relative inline-flex size-10 shrink-0 items-center justify-center rounded-lg",
        tone,
        className,
      )}
    >
      <FileIcon name={name} className="size-[18px]" />
      <span className="absolute -bottom-1.5 rounded bg-card px-1 font-mono text-[9px] font-semibold leading-tight ring-1 ring-border">
        {ext}
      </span>
    </span>
  );
}
