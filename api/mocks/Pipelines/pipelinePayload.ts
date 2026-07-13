const PREFIX = process.env.PREFIX;

/**
 * Creates a pipeline payload object for API requests.
 *
 * Use this function to generate a valid pipeline configuration payload
 * for creating pipelines in tests.
 *
 * The pipeline name is prefixed with the configured PREFIX environment variable
 * to identify test-created pipelines.
 *
 * The payload includes pipeline nodes, triggers, execution options,
 * retry policy, resource settings, and default pipeline behavior.
 *
 * @param name - The base name of the pipeline.
 * @param algorithmName - The name of the algorithm used by the pipeline node.
 * @returns A pipeline payload object ready to be sent to the API.
 */
export function pipelinePayload(name: string, algorithmName: string) {
  return {
    name: `${PREFIX}${name}`,
    kind: "batch",
    nodes: [
      {
        nodeName: name,
        algorithmName: algorithmName,
        retry: { policy: "OnCrash", limit: 3 },
        ttl: 0,
        includeInResult: false,
        metrics: { tensorboard: true },
        input: [],
      },
    ],
    triggers: {
      cron: { enabled: false, pattern: "0 * * * *" },
      pipelines: [],
    },
    options: {
      batchTolerance: 80,
      concurrentPipelines: { amount: 10, rejectOnFailure: true },
      ttl: 3600,
      progressVerbosityLevel: "info",
    },
    priority: 3,
  };
}
