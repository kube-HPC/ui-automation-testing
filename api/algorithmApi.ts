import axios from "axios";
import { getApiAuthHeaders } from "./authHeaders";
import { algorithmPayload } from "./mocks/Algorithms/algorithmPayload";
const API_URL = `${process.env.BACKEND_URL}store/algorithms`;

export async function createAlgorithm(name: string) {
  const payload = algorithmPayload(name);
  const headers = await getApiAuthHeaders();
  const response = await axios.post(API_URL, payload, { headers });
  return response.data;
}
