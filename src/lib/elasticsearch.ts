import { Client } from "@elastic/elasticsearch";

const cloudId = process.env.ELASTICSEARCH_CLOUD_ID;
const apiKey = process.env.ELASTICSEARCH_API_KEY;

// Only initialize when env vars are set (avoids build errors when unconfigured)
const client =
  cloudId && apiKey
    ? new Client({
        cloud: { id: cloudId },
        auth: { apiKey },
      })
    : (null as unknown as InstanceType<typeof Client>);

export default client;
