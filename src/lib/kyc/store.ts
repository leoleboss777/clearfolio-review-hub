import { useSyncExternalStore } from "react";
import { buildSeed, ADMIN_NAME, STATE_VERSION } from "./seed";
import { docTypeLabel } from "./catalog";
import { clearFiles, deleteFile, putFile } from "./files";
import type { Activity, CategoryId, Client, KycDocument, KycState, Session } from "./types";

/*
 * Simulated shared backend: a single state persisted to localStorage.
 * Both client and admin spaces read/write the same state, so decisions
 * propagate instantly in the same tab and via the `storage` event in other tabs.
 */
const STATE_KEY = "kyc62.state.v1";
const SESSION_KEY = "kyc62.session.v1";

let state: KycState | null = null;
let session: Session | null | undefined;
const listeners = new Set<() => void>();
let bound = false;

function readState(): KycState {
  if (typeof window === "undefined") return buildSeed();
  try {
    const raw = localStorage.getItem(STATE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as KycState;
      if (parsed.version === STATE_VERSION) return parsed;
    }
  } catch {
    /* fall through to seed */
  }
  const seed = buildSeed();
  localStorage.setItem(STATE_KEY, JSON.stringify(seed));
  return seed;
}

function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function getState(): KycState {
  if (!state) state = readState();
  return state;
}

export function getSession(): Session | null {
  if (session === undefined) session = readSession();
  return session;
}

function emit() {
  listeners.forEach((l) => l());
}

function commit(next: KycState) {
  state = next;
  try {
    localStorage.setItem(STATE_KEY, JSON.stringify(next));
  } catch (e) {
    console.warn("KYC62: unable to persist state", e);
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!bound && typeof window !== "undefined") {
    bound = true;
    window.addEventListener("storage", (e) => {
      if (e.key === STATE_KEY) {
        state = readState();
        emit();
      }
      if (e.key === SESSION_KEY) {
        session = readSession();
        emit();
      }
    });
  }
  return () => {
    listeners.delete(listener);
  };
}

export function useKycState(): KycState {
  return useSyncExternalStore(subscribe, getState, getState);
}

export function useSession(): Session | null {
  return useSyncExternalStore(subscribe, getSession, () => null);
}

function uid(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function clientName(s: KycState, clientId: string) {
  const c = s.clients.find((c) => c.id === clientId);
  return c ? `${c.firstName} ${c.lastName}` : "Client";
}

function withActivity(s: KycState, a: Omit<Activity, "id" | "at">): Activity[] {
  return [{ ...a, id: uid("act"), at: nowIso() }, ...s.activity];
}

/* ---------- session ---------- */

export function signIn(next: Session) {
  session = next;
  localStorage.setItem(SESSION_KEY, JSON.stringify(next));
  emit();
}

export function signOut() {
  session = null;
  localStorage.removeItem(SESSION_KEY);
  emit();
}

/* ---------- client actions ---------- */

export async function uploadDocuments(
  clientId: string,
  category: CategoryId,
  docType: string,
  files: File[],
): Promise<KycDocument[]> {
  const created: KycDocument[] = [];
  for (const file of files) {
    const id = uid("doc");
    let hasFile = true;
    try {
      await putFile(id, file);
    } catch {
      hasFile = false;
    }
    created.push({
      id,
      clientId,
      category,
      docType,
      fileName: file.name,
      mime: file.type || "application/octet-stream",
      size: file.size,
      uploadedAt: nowIso(),
      status: "pending",
      hasFile,
    });
  }
  const s = getState();
  let activity = s.activity;
  for (const d of created) {
    activity = [
      {
        id: uid("act"),
        at: d.uploadedAt,
        type: "upload",
        actor: clientName(s, clientId),
        clientId,
        docId: d.id,
        message: `${docTypeLabel(docType)} transmis (${d.fileName})`,
      },
      ...activity,
    ];
  }
  commit({ ...s, documents: [...created, ...s.documents], activity });
  return created;
}

export function deleteDocument(docId: string) {
  const s = getState();
  const doc = s.documents.find((d) => d.id === docId);
  if (!doc || doc.status === "approved") return;
  void deleteFile(docId);
  commit({
    ...s,
    documents: s.documents.filter((d) => d.id !== docId),
    activity: withActivity(s, {
      type: "delete",
      actor: clientName(s, doc.clientId),
      clientId: doc.clientId,
      message: `${docTypeLabel(doc.docType)} supprimé (${doc.fileName})`,
    }),
  });
}

export function updateClient(clientId: string, patch: Partial<Client>) {
  const s = getState();
  commit({ ...s, clients: s.clients.map((c) => (c.id === clientId ? { ...c, ...patch } : c)) });
}

/* ---------- admin actions ---------- */

export function approveDocument(docId: string, reviewer = ADMIN_NAME) {
  const s = getState();
  const doc = s.documents.find((d) => d.id === docId);
  if (!doc) return;
  commit({
    ...s,
    documents: s.documents.map((d) =>
      d.id === docId
        ? {
            ...d,
            status: "approved",
            reviewedAt: nowIso(),
            reviewer,
            rejectionReason: undefined,
            rejectionComment: undefined,
          }
        : d,
    ),
    activity: withActivity(s, {
      type: "approve",
      actor: reviewer,
      clientId: doc.clientId,
      docId,
      message: `${docTypeLabel(doc.docType)} approuvé`,
    }),
  });
}

export function rejectDocument(
  docId: string,
  reason: string,
  comment: string,
  reviewer = ADMIN_NAME,
) {
  const s = getState();
  const doc = s.documents.find((d) => d.id === docId);
  if (!doc) return;
  commit({
    ...s,
    documents: s.documents.map((d) =>
      d.id === docId
        ? {
            ...d,
            status: "rejected",
            reviewedAt: nowIso(),
            reviewer,
            rejectionReason: reason,
            rejectionComment: comment.trim() || undefined,
          }
        : d,
    ),
    activity: withActivity(s, {
      type: "reject",
      actor: reviewer,
      clientId: doc.clientId,
      docId,
      message: `${docTypeLabel(doc.docType)} refusé — ${reason}`,
    }),
  });
}

export function addComment(clientId: string, text: string, author = ADMIN_NAME) {
  const s = getState();
  commit({
    ...s,
    comments: [{ id: uid("com"), clientId, author, at: nowIso(), text }, ...s.comments],
    activity: withActivity(s, {
      type: "comment",
      actor: author,
      clientId,
      message: `Commentaire ajouté au dossier`,
    }),
  });
}

export async function resetDemo() {
  await clearFiles();
  commit(buildSeed());
}
