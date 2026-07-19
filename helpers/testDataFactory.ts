/**
 * Build a deterministic unique name for test-created resources.
 *
 * Use this helper to avoid collisions between parallel and repeated runs.
 * The final name is composed from:
 * 1) optional prefix,
 * 2) a semantic base name,
 * 3) a short uniqueness suffix based on timestamp and random seed.
 *
 * @param baseName - Semantic name such as "edit-algorithm".
 * @param prefix - Optional string to prepend to the generated name.
 * @returns A unique, prefixed resource name safe for test data creation.
 *
 * @example
 * const algorithmName = buildUniqueTestName("edit-algorithm");
 */
export function buildUniqueTestName(baseName: string, prefix = ""): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 7);
  return `${prefix}${baseName}-${timestamp}-${random}`;
}
