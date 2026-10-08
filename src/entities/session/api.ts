import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import { tokenStore } from '../../shared/api/token-store';
import { businessStore } from '../../shared/api/business-store';
import {
  loginResponseSchema,
  registerResponseSchema,
  userSchema,
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
  type User,
} from './model';

/** The only place that knows the auth URL shapes. Routes and payloads are
 *  aligned to be-Backend (`/api/v1/auth/*`); the base URL already carries the
 *  `/api/v1` prefix, so paths here are relative to `/auth`. */
const sessionApi = {
  me: async (): Promise<User> => {
    const raw = await apiClient.get<unknown>('/auth/me');
    return userSchema.parse(raw);
  },
  /** Login returns only `{ accessToken, userId }`; the caller hydrates the
   *  profile via `me()` after storing the token. */
  login: async (input: LoginInput): Promise<string> => {
    const raw = await apiClient.post<unknown>('/auth/login', input);
    return loginResponseSchema.parse(raw).accessToken;
  },
  /** Register returns only `{ userId }` — no token. The caller logs in
   *  afterwards to obtain a session. */
  register: async (input: RegisterInput): Promise<void> => {
    const { confirmPassword: _c, ...body } = input;
    void _c;
    const raw = await apiClient.post<unknown>('/auth/register', body);
    registerResponseSchema.parse(raw);
  },
  logout: async (): Promise<void> => {
    await apiClient.post<unknown>('/auth/logout');
  },
  forgotPassword: async (input: ForgotPasswordInput): Promise<void> => {
    await apiClient.post<unknown>('/auth/password/forgot', input);
  },
  resetPassword: async (input: ResetPasswordInput): Promise<void> => {
    // Backend expects `{ token, newPassword }`.
    await apiClient.post<unknown>('/auth/password/reset', {
      token: input.token,
      newPassword: input.password,
    });
  },
  verifyEmail: async (token: string): Promise<void> => {
    await apiClient.post<unknown>('/auth/verify-email', { token });
  },
};

export const sessionKeys = {
  me: ['session', 'me'] as const,
};

/** The current session. `enabled` lets callers defer until a token exists. */
export function useSession() {
  return useQuery({
    queryKey: sessionKeys.me,
    queryFn: sessionApi.me,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: LoginInput): Promise<User> => {
      const accessToken = await sessionApi.login(input);
      tokenStore.set(accessToken);
      // The login body has no user; hydrate the profile from /auth/me.
      return sessionApi.me();
    },
    onSuccess: (user) => {
      qc.setQueryData(sessionKeys.me, user);
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: RegisterInput): Promise<User> => {
      // Register creates the account (returns only userId), then we log in with
      // the same credentials to obtain a session and hydrate the profile.
      await sessionApi.register(input);
      const accessToken = await sessionApi.login({
        email: input.email,
        password: input.password,
      });
      tokenStore.set(accessToken);
      return sessionApi.me();
    },
    onSuccess: (user) => {
      qc.setQueryData(sessionKeys.me, user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sessionApi.logout,
    onSettled: () => {
      tokenStore.clear();
      businessStore.clear();
      qc.setQueryData(sessionKeys.me, null);
      void qc.invalidateQueries();
    },
  });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: sessionApi.forgotPassword });
}

export function useResetPassword() {
  return useMutation({ mutationFn: sessionApi.resetPassword });
}

export function useVerifyEmail() {
  return useMutation({ mutationFn: sessionApi.verifyEmail });
}
