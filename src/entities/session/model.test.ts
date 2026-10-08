import { describe, it, expect } from 'vitest';
import {
  loginInputSchema,
  registerInputSchema,
  forgotPasswordInputSchema,
  resetPasswordInputSchema,
  userSchema,
  authSessionSchema,
} from './model';

describe('login schema', () => {
  it('accepts a valid login', () => {
    const r = loginInputSchema.safeParse({ email: 'a@b.com', password: 'x' });
    expect(r.success).toBe(true);
  });

  it('rejects an invalid email', () => {
    const r = loginInputSchema.safeParse({ email: 'nope', password: 'x' });
    expect(r.success).toBe(false);
  });

  it('rejects an empty password', () => {
    const r = loginInputSchema.safeParse({ email: 'a@b.com', password: '' });
    expect(r.success).toBe(false);
  });
});

describe('register schema', () => {
  const base = {
    fullName: 'María Pérez',
    email: 'maria@shop.com',
    password: 'supersecret',
    confirmPassword: 'supersecret',
  };

  it('accepts a matching registration', () => {
    expect(registerInputSchema.safeParse(base).success).toBe(true);
  });

  it('rejects a short password', () => {
    const r = registerInputSchema.safeParse({
      ...base,
      password: 'short',
      confirmPassword: 'short',
    });
    expect(r.success).toBe(false);
  });

  it('rejects mismatched passwords and points at confirmPassword', () => {
    const r = registerInputSchema.safeParse({ ...base, confirmPassword: 'other' });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(r.error.issues[0]?.path).toContain('confirmPassword');
    }
  });
});

describe('forgot/reset schemas', () => {
  it('forgot accepts a valid email', () => {
    expect(forgotPasswordInputSchema.safeParse({ email: 'a@b.com' }).success).toBe(
      true,
    );
  });

  it('reset rejects mismatched passwords', () => {
    const r = resetPasswordInputSchema.safeParse({
      token: 'tok',
      password: 'supersecret',
      confirmPassword: 'nope-nope',
    });
    expect(r.success).toBe(false);
  });

  it('reset requires a token', () => {
    const r = resetPasswordInputSchema.safeParse({
      token: '',
      password: 'supersecret',
      confirmPassword: 'supersecret',
    });
    expect(r.success).toBe(false);
  });
});

describe('server response schemas', () => {
  it('parses a user', () => {
    const r = userSchema.safeParse({
      id: '11111111-1111-1111-1111-111111111111',
      email: 'a@b.com',
      fullName: 'A B',
      emailVerified: false,
    });
    expect(r.success).toBe(true);
  });

  it('parses an auth session', () => {
    const r = authSessionSchema.safeParse({
      accessToken: 'jwt.token.here',
      user: {
        id: '11111111-1111-1111-1111-111111111111',
        email: 'a@b.com',
        fullName: 'A B',
        emailVerified: true,
      },
    });
    expect(r.success).toBe(true);
  });
});
