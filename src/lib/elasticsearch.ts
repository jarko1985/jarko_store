import { Client } from "@elastic/elasticsearch";

function createClient(): InstanceType<typeof Client> | null {
  const cloudId = process.env.ELASTICSEARCH_CLOUD_ID;
  const apiKey = process.env.ELASTICSEARCH_API_KEY;
  if (!cloudId || !apiKey) return null;
  try {
    return new Client({ cloud: { id: cloudId }, auth: { apiKey } });
  } catch {
    return null;
  }
}

const client = createClient();

export default client;
