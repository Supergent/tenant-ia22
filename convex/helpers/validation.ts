/**
 * Validation Helpers
 *
 * Pure functions for input validation.
 * NO database access, NO ctx parameter.
 */

/**
 * Validate todo text
 */
export function isValidTodoText(text: string): boolean {
  return text.trim().length > 0 && text.length <= 500;
}

/**
 * Validate thread title
 */
export function isValidThreadTitle(title: string): boolean {
  return title.trim().length > 0 && title.length <= 200;
}

/**
 * Validate message content
 */
export function isValidMessageContent(content: string): boolean {
  return content.trim().length > 0 && content.length <= 10000;
}

/**
 * Sanitize text input
 */
export function sanitizeText(text: string): string {
  return text.trim();
}
