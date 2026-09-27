/**
 * Type declarations for the shared CommonJS environment module.
 */
export const BASE_URL: string;
export const BASE_URL_ROOT: string;
export const BACKEND_URL_ROOT: string;
export const PREFIX: string;
export function isKeycloakEnabled(): boolean;
export function getKeycloakCredentials(): {
  username: string;
  password: string;
};
