import { describe, it, expect } from 'vitest';
import {
  staffMemberSchema,
  staffListSchema,
  inviteStaffResultSchema,
  inviteStaffInputSchema,
  changeRoleInputSchema,
} from './model';

const uuidA = '11111111-1111-1111-1111-111111111111';
const uuidB = '22222222-2222-2222-2222-222222222222';

describe('staff member schema', () => {
  it('parses a valid staff member', () => {
    const r = staffMemberSchema.safeParse({
      membershipId: uuidA,
      userId: uuidB,
      role: 'STAFF',
      active: true,
    });
    expect(r.success).toBe(true);
  });

  it('rejects an unknown role', () => {
    const r = staffMemberSchema.safeParse({
      membershipId: uuidA,
      userId: uuidB,
      role: 'ADMIN',
      active: true,
    });
    expect(r.success).toBe(false);
  });

  it('parses a list of members', () => {
    const r = staffListSchema.safeParse([
      { membershipId: uuidA, userId: uuidB, role: 'OWNER', active: true },
    ]);
    expect(r.success).toBe(true);
  });
});

describe('invite staff result schema', () => {
  it('parses the invite result with created flag', () => {
    const r = inviteStaffResultSchema.safeParse({
      membershipId: uuidA,
      userId: uuidB,
      created: true,
    });
    expect(r.success).toBe(true);
  });
});

describe('invite staff input', () => {
  it('accepts a valid invite', () => {
    const r = inviteStaffInputSchema.safeParse({
      fullName: 'Ana López',
      email: 'ana@example.com',
      role: 'STAFF',
    });
    expect(r.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const r = inviteStaffInputSchema.safeParse({
      fullName: 'Ana López',
      email: 'not-an-email',
      role: 'STAFF',
    });
    expect(r.success).toBe(false);
  });

  it('rejects an empty full name', () => {
    const r = inviteStaffInputSchema.safeParse({
      fullName: '',
      email: 'ana@example.com',
      role: 'OWNER',
    });
    expect(r.success).toBe(false);
  });

  it('rejects an unknown role', () => {
    const r = inviteStaffInputSchema.safeParse({
      fullName: 'Ana López',
      email: 'ana@example.com',
      role: 'MANAGER',
    });
    expect(r.success).toBe(false);
  });
});

describe('change role input', () => {
  it('accepts OWNER and STAFF', () => {
    expect(changeRoleInputSchema.safeParse({ role: 'OWNER' }).success).toBe(true);
    expect(changeRoleInputSchema.safeParse({ role: 'STAFF' }).success).toBe(true);
  });

  it('rejects any other role', () => {
    expect(changeRoleInputSchema.safeParse({ role: 'GUEST' }).success).toBe(false);
  });
});
