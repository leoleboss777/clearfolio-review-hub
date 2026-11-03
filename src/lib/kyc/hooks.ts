import { useKycState, useSession } from "./store";

/** Current signed-in client and their documents (only used under the guarded /client layout). */
export function useCurrentClient() {
  const session = useSession();
  const state = useKycState();
  const client = state.clients.find((c) => c.id === session?.clientId)!;
  const documents = state.documents
    .filter((d) => d.clientId === client?.id)
    .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  const activity = state.activity.filter((a) => a.clientId === client?.id);
  return { client, documents, activity };
}
