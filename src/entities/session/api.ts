import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import { tokenStore } from '../../shared/api/token-store';
import {
  authSessionSchema,
  userSchema,
  type AuthSession,
  type ForgotPasswordInput,
  type LoginInput,
  type RegisterInput,
  type ResetPasswordInput,
  type User,
} from './model';

/** The only place that knows the auth URL shapes. */
const sessionApi = {
  me: async (): Promise<User> => {
    const raw = await apiClient.get<unknown>('/auth/me');
    return userSchema.parse(raw);
  },
  login: async (input: LoginInput): Promise<AuthSession> => {
    const raw = await apiClient.post<unknown>('/auth/login', input);
    return authSessionSchema.parse(raw);
  },
  register: async (input: RegisterInput): Promise<AuthSession> => {
    const { confirmPassword: _c, ...body } = input;
    void _c;
    const raw = await apiClient.post<unknown>('/auth/register', body);
    return authSessionSchema.parse(raw);
  },
  logout: async (): Promise<void> => {
    await apiClient.post<unknown>('/auth/logout');
  },
  forgotPassword: async (input: ForgotPasswordInput): Promise<void> => {
    await apiClient.post<unknown>('/auth/forgot-password', input);
  },
  resetPassword: async (input: ResetPasswordInput): Promise<void> => {
    const { confirmPassword: _c, ...body } = input;
    void _c;
    await apiClient.post<unknown>('/auth/reset-password', body);
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
    mutationFn: sessionApi.login,
    onSuccess: (data) => {
      tokenStore.set(data.accessToken);
      qc.setQueryData(sessionKeys.me, data.user);
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sessionApi.register,
    onSuccess: (data) => {
      tokenStore.set(data.accessToken);
      qc.setQueryData(sessionKeys.me, data.user);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sessionApi.logout,
    onSettled: () => {
      tokenStore.clear();
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
