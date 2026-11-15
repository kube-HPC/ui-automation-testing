import { PREFIX } from "../../../config/env";

export const DEFAULT_ALGORITHM_IMAGE = "hkube/algorithm-example-python";
// Built from the cluster's "stayup" algorithm; keeps the job active so pause/stop can be exercised.
export const LONG_RUNNING_ALGORITHM_IMAGE =
  "docker.io/hkubedevtest/stayup:v40ur9i25";

export type AlgorithmImageOptions = string | { isStayUp?: boolean };

/**
 * Generates a unique version identifier for an algorithm.
 *
 * The generated version is based on a random alphanumeric string
 * to ensure uniqueness between test executions.
 *
 * @returns A random version string.
 */
function generateVersion() {
  return Math.random().toString(36).substring(2, 12);
}

/**
 * Creates an algorithm payload object for API requests.
 *
 * Use this function to generate a valid algorithm configuration payload
 * for creating algorithms in tests.
 *
 * The algorithm name is prefixed with the configured PREFIX environment variable
 * to identify test-created algorithms.
 *
 * The payload includes generated timestamps, version information,
 * default resource settings, environment configuration, volumes,
 * and audit trail data.
 *
 * @param name - The base name of the algorithm.
 * @param imageOptions - Docker image override or an option to use the long-running image.
 * @returns An algorithm payload object ready to be sent to the API.
 */
export function algorithmPayload(
  name: string,
  imageOptions: AlgorithmImageOptions = {},
) {
  const timestamp = Date.now();
  const version = generateVersion();
  const algorithmImage =
    typeof imageOptions === "string"
      ? imageOptions
      : imageOptions.isStayUp
        ? LONG_RUNNING_ALGORITHM_IMAGE
        : DEFAULT_ALGORITHM_IMAGE;

  // Without env/entryPoint the stayup image fails within seconds instead of staying up.
  const stayUpCode =
    algorithmImage === LONG_RUNNING_ALGORITHM_IMAGE
      ? { env: "python", entryPoint: "stayup.py" }
      : {};

  return {
    name: `${PREFIX}${name}`,
    algorithmImage,
    ...stayUpCode,
    cpu: 0.1,
    mem: "256Mi",
    options: {
      pending: false,
    },
    minHotWorkers: 0,
    version: version,
    auditTrail: [
      {
        timestamp: timestamp,
        version: version,
      },
    ],
    created: timestamp,
    modified: timestamp,
    sideCars: [],
    volumes: [],
    volumeMounts: [],
    workerEnv: {},
    algorithmEnv: {},
  };
}
