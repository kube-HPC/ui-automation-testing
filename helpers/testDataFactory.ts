/**
 * Normalizes a resource name segment to HKube-safe characters.
 *
 * The result is lower-case and contains only: letters, digits, dot, and dash.
 * Any invalid sequence is replaced with a single dash, and edge dashes are trimmed.
 *
 * @param value - Raw name segment to normalize.
 * @returns A sanitized name segment suitable for resource names.
 */
function normalizeResourceNamePart(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Generates a short unique suffix for test resources.
 *
 * Combines a base-36 timestamp with a base-36 random chunk,
 * then truncates to 8 characters.
 *
 * @returns A lower-case 8-character id.
 */
export function generateId() {
  const timestampPart = Date.now().toString(36);
  const randomPart = Math.floor(Math.random() * 1_000_000)
    .toString(36)
    .padStart(4, "0");
  return `${timestampPart}${randomPart}`.slice(-8);
}

/**
 * Builds a unique, normalized name for test-created resources.
 *
 * Use this helper to avoid collisions between parallel and repeated runs,
 * while keeping names compatible with backend validation rules.
 * The final name is composed from:
 * 1) normalized semantic base name,
 * 2) a short uniqueness suffix.
 *
 * @param baseName - Semantic name such as "edit-algorithm".
 * @returns A unique backend-safe resource name.
 *
 * @example
 * const algorithmName = generateTestName("edit-algorithm");
 */
export function generateTestName(baseName: string): string {
  const normalizedBaseName = normalizeResourceNamePart(baseName) || "test";
  return `${normalizedBaseName}-${generateId()}`;
}
