/**
 * Shared className merge helper.
 */

/**
 * Join truthy class name fragments into a single string.
 *
 * @param parts - Class name candidates.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
