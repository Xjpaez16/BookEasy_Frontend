/*
 * In-memory access-token store. The short-lived access token is kept ONLY in a
 * module variable (lost on reload — recovered via the HttpOnly refresh cookie),
 * never in localStorage/sessionStorage, per the security steering. The refresh
 * token itself is an HttpOnly cookie the JS never touches.
 */
let accessToken: string | null = null;

export const tokenStore = {
  get: (): string | null => accessToken,
  set: (token: string | null): void => {
    accessToken = token;
  },
  clear: (): void => {
    accessToken = null;
  },
};
