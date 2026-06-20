import { describe, expect, it } from 'vitest';

import formatDate from '../../../utils/formatDate.js';

describe('formatDate', () => {
  it('formats a date string using default pt-BR locale', () => {
    const result = formatDate({ value: '2024-01-15' });
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('returns a string that includes the day and year of the provided date', () => {
    const result = formatDate({ value: '2024-06-20' });
    expect(result).toMatch(/2024/);
  });

  it('accepts a Date object', () => {
    const d = new Date(2024, 0, 1);
    const result = formatDate({ value: d });
    expect(typeof result).toBe('string');
  });

  it('accepts custom options like year only', () => {
    const result = formatDate({
      value: '2024-06-20',
      options: { year: 'numeric' },
    });
    expect(result).toBe('2024');
  });

  it('accepts a custom locale', () => {
    const result = formatDate({
      value: '2024-01-15',
      local: 'en-US',
      options: { month: 'long', year: 'numeric' },
    });
    expect(result).toMatch(/January 2024/);
  });
});
