/*
 * In-memory selected-business store. For users who belong to more than one
 * business, the backend auth plugin picks the tenant from the `X-Business-Id`
 * header — validated server-side against the user's ACTIVE memberships, so this
 * is only a SELECTOR, never trusted on its own. Single-membership users don't
 * need it (the server resolves the one membership). Kept in memory only, like
 * the access token; survives SPA navigation, resets on reload.
 */
let selectedBusinessId: string | null = null;

export const businessStore = {
  get: (): string | null => selectedBusinessId,
  set: (id: string | null): void => {
    selectedBusinessId = id;
  },
  clear: (): void => {
    selectedBusinessId = null;
  },
};
