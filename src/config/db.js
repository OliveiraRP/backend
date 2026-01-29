import { Pool, neonConfig } from "@neondatabase/serverless";

export function getDb(c) {
  neonConfig.webSocketConstructor = WebSocket;

  neonConfig.wsProxy = undefined;

  const pool = new Pool({ connectionString: c.env.DATABASE_URL });

  return pool;
}
