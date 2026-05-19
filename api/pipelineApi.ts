import axios from "axios";
import { getApiAuthHeaders } from "./authHeaders";
import { createAlgorithm } from "./algorithmApi";
import { pipelinePayload } from "./mocks/Pipelines/pipelinePayload";

const API_URL = `${process.env.BACKEND_URL}store/pipelines`;
const PRFIX = process.env.PREFIX;

export async function deletePipeline(name: string) {
  const headers = await getApiAuthHeaders();
  const url = `${API_URL}/${PRFIX}${name}`;
  await axios.delete(url, { headers });
}

export async function createPipeline(
  pipelineName: string,
  algorithmName: string,
) {
  // cleanup any existing pipeline with the same name to avoid conflicts
  await deletePipeline(pipelineName).catch((e) => {
    if (e?.response?.status !== 404) throw e;
  });

  // algorithmName is already prefixed by createAlgorithm
  const prefixedAlgorithmName = `${PRFIX}${algorithmName}`;
  const payload = pipelinePayload(pipelineName, prefixedAlgorithmName);
  const headers = await getApiAuthHeaders();
  const response = await axios.post(API_URL, payload, { headers });
  return response.data;
}

export async function createPipelineWithAlgorithm(
  pipelineName: string,
  algorithmName: string,
) {
  await createAlgorithm(algorithmName);
  return createPipeline(pipelineName, algorithmName);
}
