import { describe, expect, it } from 'vitest';

import { resolveMediaUrl } from '../../../utils/media.js';

describe('resolveMediaUrl', () => {
  it('returns null for null input', () => {
    expect(resolveMediaUrl(null)).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(resolveMediaUrl('')).toBeNull();
  });

  it('returns absolute https URL as-is', () => {
    expect(resolveMediaUrl('https://cdn.example.com/img.png')).toBe(
      'https://cdn.example.com/img.png',
    );
  });

  it('returns absolute http URL as-is', () => {
    expect(resolveMediaUrl('http://localhost/img.png')).toBe(
      'http://localhost/img.png',
    );
  });

  it('returns blob URL as-is', () => {
    expect(resolveMediaUrl('blob:http://localhost/abc')).toBe(
      'blob:http://localhost/abc',
    );
  });

  it('returns data URI as-is', () => {
    const dataUri = 'data:image/png;base64,abc123';
    expect(resolveMediaUrl(dataUri)).toBe(dataUri);
  });

  it('prepends VITE_BACKEND_URL for relative paths starting with /', () => {
    const result = resolveMediaUrl('/uploads/photo.jpg');
    expect(result).toBe('http://localhost:3333/uploads/photo.jpg');
  });

  it('returns plain relative path without leading slash as-is', () => {
    expect(resolveMediaUrl('uploads/photo.jpg')).toBe('uploads/photo.jpg');
  });
});
