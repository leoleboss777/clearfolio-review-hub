export type DocStatus = "pending" | "approved" | "rejected";
export type CategoryId = "identity" | "professional" | "financial" | "personal" | "other";
export type Role = "client" | "admin";

export interface Client {
  id: string;
  ref: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  createdAt: string;
}

export interface KycDocument {
  id: string;
  clientId: string;
  category: CategoryId;
  docType: string;
  fileName: string;
  mime: string;
  size: number;
  uploadedAt: string;
  status: DocStatus;
  reviewedAt?: string | undefined;
  reviewer?: string | undefined;
  rejectionReason?: string | undefined;
  rejectionComment?: string | undefined;
  /** true when the actual file bytes are stored locally in IndexedDB */
  hasFile: boolean;
}

export type ActivityType = "upload" | "approve" | "reject" | "delete" | "comment";

export interface Activity {
  id: string;
  at: string;
  type: ActivityType;
  actor: string;
  clientId: string;
  docId?: string | undefined;
  message: string;
}

export interface AdminComment {
  id: string;
  clientId: string;
  author: string;
  at: string;
  text: string;
}

export interface KycState {
  version: number;
  clients: Client[];
  documents: KycDocument[];
  activity: Activity[];
  comments: AdminComment[];
}

export interface Session {
  role: Role;
  clientId?: string | undefined;
  name: string;
  email: string;
}
