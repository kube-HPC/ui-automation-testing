const path = require("path");
const dotenv = require("dotenv");

/**
 * Centralized environment loading and URL composition.
 *
 * This is the single source of truth for environment-derived configuration.
 * It loads the local `.env` file (kept per-developer and out of git) and
 * exposes composed URLs, the test resource prefix, and Keycloak helpers.
 *
 * Written in CommonJS so it can be consumed both by the TypeScript sources
 * (transpiled by Playwright) and by the plain ESM helper scripts.
 */
dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const DEFAULT_BASE_URL = "http://localhost:9050/";

/**
 * Ensure a base URL ends with exactly one trailing slash so it can be safely
 * concatenated with relative sub-paths without producing double slashes.
 */
function normalizeRoot(url) {
  if (!url) {
    return DEFAULT_BASE_URL;
  }

  return url.endsWith("/") ? url : `${url}/`;
}

/**
 * The root of the HKube deployment, e.g. "https://cicd.hkube.org/".
 */
const BASE_URL = normalizeRoot(process.env.BASE_URL);

/**
 * The dashboard entry URL used for UI navigation.
 */
const BASE_URL_ROOT = `${BASE_URL}hkube/dashboard/#/`;

/**
 * The backend API base URL used for API-first setup and cleanup.
 */
const BACKEND_URL_ROOT = `${BASE_URL}hkube/api-server/api/v1/`;

/**
 * Prefix applied to test-created resource names so they are easy to identify.
 */
const PREFIX = process.env.PREFIX || "pw-";

/**
 * Whether Keycloak authentication is enabled. Defaults to `true`; set
 * VITE_KEYCLOAK_ENABLE=false in a local .env to opt out.
 */
function isKeycloakEnabled() {
  const raw = process.env.VITE_KEYCLOAK_ENABLE;

  if (raw === undefined || raw === "") {
    return true;
  }

  return raw.toLowerCase() === "true";
}

/**
 * Read the Keycloak credentials, throwing when they are missing.
 */
function getKeycloakCredentials() {
  const username = process.env.KEYCLOAK_USERNAME;
  const password = process.env.KEYCLOAK_PASSWORD;

  if (!username || !password) {
    throw new Error(
      "Missing KEYCLOAK_USERNAME/KEYCLOAK_PASSWORD while Keycloak mode is enabled.",
    );
  }

  return { username, password };
}

module.exports = {
  BASE_URL,
  BASE_URL_ROOT,
  BACKEND_URL_ROOT,
  PREFIX,
  isKeycloakEnabled,
  getKeycloakCredentials,
};
