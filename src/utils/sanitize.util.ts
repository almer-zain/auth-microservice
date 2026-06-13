import { TransformFnParams } from 'class-transformer';
import sanitizeHtml from 'sanitize-html';

/**
 * Strips all HTML tags and trims white spaces safely.
 * Solves: @typescript-eslint/no-unsafe-member-access boundaries
 */
export function stripHtml(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }

  const clean = sanitizeHtml(value, {
    allowedTags: [],
    allowedAttributes: {},
  });

  return clean.trim();
}

/**
 * Normalizes email strings safely by trimming and converting to lowercase.
 */
export function normalizeEmail(value: unknown): string {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toLowerCase();
}

// =========================================================================
// CLASS-TRANSFORMER WRAPPERS
// These map cleanly inside @Transform(() => ...) to keep your DTOs readable.
// =========================================================================

/**
 * Class-transformer pipeline wrapper for stripping HTML.
 */
export function transformSanitizeHtml({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') {
    return value as unknown;
  }
  return stripHtml(value);
}

export function transformSanitizeHtmlClean({
  value,
}: TransformFnParams): unknown {
  if (typeof value !== 'string') {
    return value as unknown;
  }
  return stripHtml(value.trim().toLowerCase());
}

/**
 * Class-transformer pipeline wrapper for standard string trimming.
 */
export function transformTrim({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') {
    return value as unknown;
  }
  return value.trim();
}

/**
 * Class-transformer pipeline wrapper for standard string trimming and turn to lowercase.
 */
export function transformTrimAndLowercase({
  value,
}: TransformFnParams): unknown {
  if (typeof value !== 'string') {
    return value as unknown;
  }
  return value.trim().toLowerCase();
}

/**
 * Class-transformer pipeline wrapper for email normalization.
 */
export function transformEmail({ value }: TransformFnParams): unknown {
  if (typeof value !== 'string') {
    return value as unknown;
  }
  return normalizeEmail(value);
}
