import axios from "axios";
import { getApiAuthHeaders } from "./authHeaders";
import { algorithmPayload } from "./mocks/Algorithms/algorithmPayload";

const API_URL = `${process.env.BACKEND_URL}store/algorithms`;
const PRFIX = process.env.PREFIX;

export async function deleteAlgorithm(name: string) {
  const headers = await getApiAuthHeaders();
  const url = `${API_URL}/${PRFIX}${name}?force=true`;
  await axios.delete(url, { headers });
}

function getAxiosErrorDetails(error: unknown) {
  if (!axios.isAxiosError(error)) {
    return null;
  }

  const status = error.response?.status;
  const data = error.response?.data;
  const message = error.message;
  return { status, data, message };
}

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
        `createAlgorithm failed for ${PRFIX}${name} (status ${details.status ?? "unknown"}): ${details.message}. response=${JSON.stringify(details.data)}`,
      );
    }

    throw error;
  }
}
