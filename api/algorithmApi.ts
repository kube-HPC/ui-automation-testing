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

export async function createAlgorithm(name: string) {
  // cleanup any existing algorithm with the same name to avoid conflicts
  await deleteAlgorithm(name).catch(console.error);

  const payload = algorithmPayload(name);
  const headers = await getApiAuthHeaders();
  const response = await axios.post(API_URL, payload, { headers });
  return response.data;
}
