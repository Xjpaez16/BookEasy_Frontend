import { z } from 'zod';

/** The authenticated user as returned by the backend auth endpoints. */
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().min(1),
  emailVerified: z.boolean(),
});
export type User = z.infer<typeof userSchema>;

/**
 * Backend auth response shapes (verified against be-Backend auth-router).
 * The login/refresh body carries ONLY the access token + a userId — the user
 * profile is hydrated separately via `GET /auth/me`. The refresh token lives in
 * an HttpOnly cookie — never in the JSON body, never in localStorage.
 */
export const loginResponseSchema = z.object({
  accessToken: z.string().min(1),
  userId: z.string().uuid(),
});
export type LoginResponse = z.infer<typeof loginResponseSchema>;

export const registerResponseSchema = z.object({
  userId: z.string().uuid(),
});
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

/* ---- Form input schemas (shared by RHF resolvers and the API layer) ---- */

const email = z.string().min(1, 'El correo es obligatorio').email('Correo inválido');
const password = z
  .string()
  .min(8, 'Mínimo 8 caracteres')
  .max(128, 'Máximo 128 caracteres');

export const loginInputSchema = z.object({
  email,
  password: z.string().min(1, 'La contraseña es obligatoria'),
});
export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z
  .object({
    fullName: z.string().min(1, 'El nombre es obligatorio').max(200),
    email,
    password,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const forgotPasswordInputSchema = z.object({ email });
export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;

export const resetPasswordInputSchema = z
  .object({
    token: z.string().min(1),
    password,
    confirmPassword: z.string().min(1, 'Confirma tu contraseña'),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });
export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
