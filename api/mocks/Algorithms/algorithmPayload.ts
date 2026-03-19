const PRFIX = process.env.PREFIX;

function generateVersion() {
  return Math.random().toString(36).substring(2, 12);
}

export function algorithmPayload(name: string) {
  const timestamp = Date.now();
  const version = generateVersion();

  return {
    name: `${PRFIX}${name}`,
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
