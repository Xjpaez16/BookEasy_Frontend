import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../shared/api/client';
import {
  customerListSchema,
  customerSchema,
  type Customer,
} from './model';

/** Payload the backend accepts on POST/PATCH /customers. */
export interface CustomerWritePayload {
  fullName: string;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}

/** The only place that knows the customers URL shapes (be-Backend /api/v1/customers). */
const customersApi = {
  list: async (search?: string): Promise<Customer[]> => {
    const path = search
      ? `/customers?search=${encodeURIComponent(search)}`
      : '/customers';
    const raw = await apiClient.get<unknown>(path);
    return customerListSchema.parse(raw);
  },
  create: async (payload: CustomerWritePayload): Promise<Customer> => {
    const raw = await apiClient.post<unknown>('/customers', payload);
    return customerSchema.parse(raw);
  },
  update: async (args: {
    customerId: string;
    payload: Partial<CustomerWritePayload>;
  }): Promise<Customer> => {
    const raw = await apiClient.patch<unknown>(
      `/customers/${args.customerId}`,
      args.payload,
    );
    return customerSchema.parse(raw);
  },
  remove: async (customerId: string): Promise<void> => {
    await apiClient.delete<unknown>(`/customers/${customerId}`);
  },
};

export const customerKeys = {
  all: ['customers'] as const,
  list: (search: string) => ['customers', 'list', search] as const,
};

/**
 * Lists customers of the caller's business, optionally filtered by a search
 * term (name/phone/email, matched server-side). Tenant-scoped by X-Business-Id.
 */
export function useCustomerList(search: string) {
  return useQuery({
    queryKey: customerKeys.list(search),
    queryFn: () => customersApi.list(search || undefined),
    staleTime: 30_000,
  });
}

export function useCreateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customersApi.update,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}

/** Soft-deletes a customer (history is preserved; it drops out of the list). */
export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customersApi.remove,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: customerKeys.all });
    },
  });
}
