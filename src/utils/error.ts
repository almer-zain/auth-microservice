/**
 * Safely extracts the stack trace from an untyped error object.
 * Fixes: @typescript-eslint/no-unsafe-member-access
 */
export function getErrorStack(error: unknown): string {
  if (error instanceof Error && error.stack) {
    return error.stack;
  }

  if (typeof error === 'string') {
    return `String error: ${error}`;
  }

  return `Unknown error structure: ${String(error)}`;
}

/**
 * Safely extracts the error message string from an untyped error object.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return String(error);
}
