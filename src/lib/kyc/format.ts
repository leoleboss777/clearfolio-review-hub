import { format, formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export const fmtDate = (iso: string) => format(new Date(iso), "d MMM yyyy", { locale: fr });
export const fmtDateTime = (iso: string) =>
  format(new Date(iso), "d MMM yyyy 'à' HH:mm", { locale: fr });
export const fmtShort = (iso: string) => format(new Date(iso), "dd/MM/yyyy HH:mm", { locale: fr });
export const fmtAgo = (iso: string) =>
  formatDistanceToNow(new Date(iso), { addSuffix: true, locale: fr });
