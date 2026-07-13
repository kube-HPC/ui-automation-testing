import axios from "axios";
import { getApiAuthHeaders } from "./authHeaders";
import { algorithmPayload } from "./mocks/Algorithms/algorithmPayload";

const API_URL = `${process.env.BACKEND_URL}store/algorithms`;
const PREFIX = process.env.PREFIX;

/**
 * Deletes an algorithm from the HKube backend.
 *
 * @param name - The base name of the algorithm to delete.
 */
export async function deleteAlgorithm(name: string) {
  const headers = await getApiAuthHeaders();
  const url = `${API_URL}/${PREFIX}${name}?force=true`;
  await axios.delete(url, { headers });
}

/**
 * Extracts useful error details from an Axios error.
 *
 * This helper converts Axios errors into a simplified object containing
 * HTTP status, response data, and error message.
 *
 * @param error - The error object to inspect.
 * @returns Error details if the error is an Axios error, otherwise null.
 */
function getAxiosErrorDetails(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const status = error.response?.status;
  const data = error.response?.data;
  const message = error.message;
  return { status, data, message };
}

/**
 * Creates an algorithm in the HKube backend.
 *
 * Before creating the algorithm, this function attempts to remove an existing
 * algorithm with the same name to avoid conflicts between test executions.
 *
 * If creation fails because the algorithm already exists (HTTP 400 or 409),
 * the function deletes the existing algorithm and retries the creation once.
 *
 * @param name - The base name of the algorithm to create.
 * @returns The created algorithm response data.
 */
export async function createAlgorithm(name: string) {
  // cleanup any existing algorithm with the same name to avoid conflicts
  await deleteAlgorithm(name).catch((e) => {
    if (e?.response?.status !== 404) {
      console.warn(`deleteAlgorithm cleanup failed for ${name}:`, e?.message);
    }
  });

  const payload = algorithmPayload(name);
  const headers = await getApiAuthHeaders();

  try {
    const response = await axios.post(API_URL, payload, { headers });
    return response.data;
  } catch (error) {
    const details = getAxiosErrorDetails(error);

    // Common flaky case: name already exists due to stale resource from a prior run.
    if (details?.status === 400 || details?.status === 409) {
      await deleteAlgorithm(name).catch(() => undefined);
      const retryResponse = await axios.post(API_URL, payload, { headers });
      return retryResponse.data;
    }

    if (details) {
      throw new Error(
        `createAlgorithm failed for ${PREFIX}${name} (status ${details.status ?? "unknown"}): ${details.message}. response=${JSON.stringify(details.data)}`,
      );
    }

    throw error;
  }
}
