import axios from "axios";
import { algorithmPayload } from "./mocks/Algorithms/algorithmPayload";
const API_URL = `${process.env.BACKEND_URL}store/algorithms`;

export async function createAlgorithm(name: string) {
  const payload = algorithmPayload(name);
  const response = await axios.post(API_URL, payload);
  return response.data;
}
