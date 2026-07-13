import axios from "axios";
import { getApiAuthHeaders } from "./authHeaders";
import { createAlgorithm } from "./algorithmApi";
import { pipelinePayload } from "./mocks/Pipelines/pipelinePayload";

const API_URL = `${process.env.BACKEND_URL}store/pipelines`;
const PREFIX = process.env.PREFIX;

/**
 * Deletes a pipeline from the HKube backend.
 *
 * The pipeline name is combined with the configured PREFIX environment variable
 * before sending the delete request.
 *
 * @param name - The base name of the pipeline to delete.
 */
export async function deletePipeline(name: string) {
  const headers = await getApiAuthHeaders();
  const url = `${API_URL}/${PREFIX}${name}`;
  await axios.delete(url, { headers });
}

/**
 * Creates a pipeline in the HKube backend.
 *
 * Before creating the pipeline, this function attempts to remove an existing
 * pipeline with the same name to avoid conflicts between test executions.
 *
 * The algorithm name is prefixed before being added to the pipeline payload,
 * because algorithms created through createAlgorithm are stored with the test prefix.
 *
 * @param pipelineName - The base name of the pipeline to create.
 * @param algorithmName - The base name of the algorithm used by the pipeline.
 * @returns The created pipeline response data.
 */
export async function createPipeline(
  pipelineName: string,
  algorithmName: string,
) {
  // cleanup any existing pipeline with the same name to avoid conflicts
  await deletePipeline(pipelineName).catch((e) => {
    if (e?.response?.status !== 404) throw e;
  });

  // algorithmName is already prefixed by createAlgorithm
  const prefixedAlgorithmName = `${PREFIX}${algorithmName}`;
  const payload = pipelinePayload(pipelineName, prefixedAlgorithmName);
  const headers = await getApiAuthHeaders();
  const response = await axios.post(API_URL, payload, { headers });
  return response.data;
}

/**
 * Creates an algorithm and then creates a pipeline that uses it.
 *
 * Use this helper when a test requires a complete pipeline setup,
 * including the required algorithm dependency.
 *
 * @param pipelineName - The base name of the pipeline to create.
 * @param algorithmName - The base name of the algorithm to create and attach to the pipeline.
 * @returns The created pipeline response data.
 */
export async function createPipelineWithAlgorithm(
  pipelineName: string,
  algorithmName: string,
) {
  await createAlgorithm(algorithmName);
  return createPipeline(pipelineName, algorithmName);
}
