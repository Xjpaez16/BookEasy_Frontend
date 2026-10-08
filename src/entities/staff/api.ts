import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import {
  staffListSchema,
  inviteStaffResultSchema,
  type StaffMember,
  type InviteStaffInput,
  type InviteStaffResult,
  type MembershipRole,
} from './model';

/** The only place that knows the staff URL shapes (be-Backend /api/v1/staff). */
const staffApi = {
  list: async (): Promise<StaffMember[]> => {
    const raw = await apiClient.get<unknown>('/staff');
    return staffListSchema.parse(raw);
  },
  invite: async (input: InviteStaffInput): Promise<InviteStaffResult> => {
    const raw = await apiClient.post<unknown>('/staff', input);
    return inviteStaffResultSchema.parse(raw);
  },
  changeRole: async (args: {
    membershipId: string;
    role: MembershipRole;
  }): Promise<void> => {
    await apiClient.patch<unknown>(`/staff/${args.membershipId}/role`, {
      role: args.role,
    });
  },
  deactivate: async (membershipId: string): Promise<void> => {
    await apiClient.delete<unknown>(`/staff/${membershipId}`);
  },
};

export const staffKeys = {
  all: ['staff'] as const,
  list: ['staff', 'list'] as const,
};

/** Lists staff of the caller's business (tenant-scoped by X-Business-Id). */
export function useStaffList() {
  return useQuery({
    queryKey: staffKeys.list,
    queryFn: staffApi.list,
    staleTime: 60_000,
  });
}

export function useInviteStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: staffApi.invite,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: staffKeys.list });
    },
  });
}

export function useChangeStaffRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: staffApi.changeRole,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: staffKeys.list });
    },
  });
}

export function useDeactivateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: staffApi.deactivate,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: staffKeys.list });
    },
  });
}
