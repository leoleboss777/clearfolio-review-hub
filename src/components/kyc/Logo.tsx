import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden>
      <defs>
        <linearGradient id="sesame62-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--electric)" />
          <stop offset="1" stopColor="var(--violet)" />
        </linearGradient>
      </defs>
      <path
        d="M16 2.5 27 6.6v8.2c0 7-4.6 12.4-11 14.7C9.6 27.2 5 21.8 5 14.8V6.6L16 2.5Z"
        fill="url(#sesame62-g)"
      />
      <path
        d="m11 15.8 3.4 3.4L21.5 12"
        fill="none"
        stroke="var(--primary-foreground)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Logo({ className, tone = "default" }: { className?: string; tone?: "default" | "admin" }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-tight">
        SESAME<span className={tone === "admin" ? "text-sidebar-primary" : "text-electric"}>62</span>
      </span>
    </span>
  );
}
