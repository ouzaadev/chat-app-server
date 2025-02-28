import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import dotenv from "dotenv";
import { Pool } from "pg";
import { log } from "../logger";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER!,
  host: process.env.DB_HOST!,
  database: process.env.DB_NAME!,
  password: process.env.DB_PASSWORD!,
  port: parseInt(process.env.DB_PORT!),
});

pool.on("error", (err) => {
  log.error("Database connection failed:", err.message);
  process.exit(1);
});

export async function connect() {
  try {
    const client = await pool.connect();
    log.info("Database connected successfully!");
    client.release();
  } catch (err: unknown) {
    if (err instanceof Error) {
      log.error("Database connection failed:", err.message);
    } else {
      log.error("Unknown error during database connection");
    }
    process.exit(1);
  }
}

export const db = drizzle(pool, { schema });
