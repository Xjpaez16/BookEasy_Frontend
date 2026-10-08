import { z } from 'zod';

/** Membership role — mirrors the backend MembershipRole enum. */
export const membershipRoleSchema = z.enum(['OWNER', 'STAFF']);
export type MembershipRole = z.infer<typeof membershipRoleSchema>;

/**
 * A staff member as returned by GET /staff. The backend returns only the
 * membership identity + role + active flag — it does NOT include email/name
 * (those live on the user record and are not exposed by this endpoint). The UI
 * shows the userId as a stable fallback label.
 */
export const staffMemberSchema = z.object({
  membershipId: z.string().uuid(),
  userId: z.string().uuid(),
  role: membershipRoleSchema,
  active: z.boolean(),
});
export type StaffMember = z.infer<typeof staffMemberSchema>;

export const staffListSchema = z.array(staffMemberSchema);

/** POST /staff response. `created` = a provisional user account was created. */
export const inviteStaffResultSchema = z.object({
  membershipId: z.string().uuid(),
  userId: z.string().uuid(),
  created: z.boolean(),
});
export type InviteStaffResult = z.infer<typeof inviteStaffResultSchema>;

/* ---- Form inputs (shared by RHF resolvers and the API layer) ---- */

export const inviteStaffInputSchema = z.object({
  fullName: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .max(200, 'Máximo 200 caracteres'),
  email: z
    .string()
    .min(1, 'El correo es obligatorio')
    .email('Correo inválido')
    .max(320),
  role: membershipRoleSchema,
});
export type InviteStaffInput = z.infer<typeof inviteStaffInputSchema>;

export const changeRoleInputSchema = z.object({
  role: membershipRoleSchema,
});
export type ChangeRoleInput = z.infer<typeof changeRoleInputSchema>;
