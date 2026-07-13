const PREFIX = process.env.PREFIX;

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
 * @returns An algorithm payload object ready to be sent to the API.
 */
export function algorithmPayload(name: string) {
  const timestamp = Date.now();
  const version = generateVersion();

  return {
    name: `${PREFIX}${name}`,
    algorithmImage: "hkube/algorithm-example-python",
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
