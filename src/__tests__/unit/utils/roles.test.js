import { describe, expect, it } from 'vitest';

import { hasAdminRole, hasManagerRole } from '../../../utils/roles.js';

describe('hasManagerRole', () => {
  it('returns true for "admin" key', () => {
    expect(hasManagerRole(['admin'])).toBe(true);
  });

  it('returns true for "manager" key', () => {
    expect(hasManagerRole(['manager'])).toBe(true);
  });

  it('returns true for "president" key', () => {
    expect(hasManagerRole(['president'])).toBe(true);
  });

  it('returns true for "marketing" key', () => {
    expect(hasManagerRole(['marketing'])).toBe(true);
  });

  it('returns false for plain "member" key', () => {
    expect(hasManagerRole(['member'])).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(hasManagerRole([])).toBe(false);
  });

  it('returns false for null', () => {
    expect(hasManagerRole(null)).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(hasManagerRole(['ADMIN'])).toBe(true);
  });

  it('accepts a single string instead of array', () => {
    expect(hasManagerRole('manager')).toBe(true);
  });
});

describe('hasAdminRole', () => {
  it('returns true for "admin"', () => {
    expect(hasAdminRole(['admin'])).toBe(true);
  });

  it('returns false for "manager"', () => {
    expect(hasAdminRole(['manager'])).toBe(false);
  });

  it('returns false for empty array', () => {
    expect(hasAdminRole([])).toBe(false);
  });

  it('returns false for null', () => {
    expect(hasAdminRole(null)).toBe(false);
  });

  it('is case-insensitive', () => {
    expect(hasAdminRole(['ADMIN'])).toBe(true);
  });
});
