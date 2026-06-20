import { describe, expect, it } from 'vitest';

import {
  DOCUMENTS_CONFIG,
  ERROR_CODES,
  ERROR_NAMES,
  PICTURES_CONFIG,
  VIDEOS_CONFIG,
} from '../../../utils/constants.js';

describe('ERROR_CODES', () => {
  it('has correct HTTP status codes', () => {
    expect(ERROR_CODES.BAD_REQUEST).toBe(400);
    expect(ERROR_CODES.UNAUTHORIZED).toBe(401);
    expect(ERROR_CODES.FORBIDDEN).toBe(403);
    expect(ERROR_CODES.NOT_FOUND).toBe(404);
    expect(ERROR_CODES.CONFLICT).toBe(409);
    expect(ERROR_CODES.INTERNAL_SERVER).toBe(500);
  });
});

describe('ERROR_NAMES', () => {
  it('has expected error name strings', () => {
    expect(ERROR_NAMES.UNAUTHORIZED).toBe('Unauthorized');
    expect(ERROR_NAMES.FORBIDDEN).toBe('Forbidden');
    expect(ERROR_NAMES.NOT_FOUND).toBe('NotFound');
  });
});

describe('DOCUMENTS_CONFIG', () => {
  it('includes PDF in allowed types', () => {
    expect(DOCUMENTS_CONFIG.allowedMimeTypes).toContain('application/pdf');
  });

  it('has a positive size limit', () => {
    expect(DOCUMENTS_CONFIG.sizeLimitInMB).toBeGreaterThan(0);
  });
});

describe('PICTURES_CONFIG', () => {
  it('includes common image types', () => {
    expect(PICTURES_CONFIG.allowedMimeTypes).toContain('image/jpeg');
    expect(PICTURES_CONFIG.allowedMimeTypes).toContain('image/png');
  });
});

describe('VIDEOS_CONFIG', () => {
  it('includes mp4', () => {
    expect(VIDEOS_CONFIG.allowedMimeTypes).toContain('video/mp4');
  });
});
