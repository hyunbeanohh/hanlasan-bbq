import { getCloudflareContext } from '@opennextjs/cloudflare';

export function getEnv(): CloudflareEnv {
  return getCloudflareContext().env;
}

export function getDB(): D1Database {
  return getEnv().DB;
}
