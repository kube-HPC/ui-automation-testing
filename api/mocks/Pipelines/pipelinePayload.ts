const PRFIX = process.env.PREFIX;

export function pipelinePayload(name: string, algorithmName: string) {
  return {
    name: `${PRFIX}${name}`,
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
