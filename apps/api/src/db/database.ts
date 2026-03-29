import { config } from "dotenv";
import { Kysely, PostgresDialect } from "kysely";
import pkg from "pg";
import type { Database } from "./schema.js";

config();
const { Pool } = pkg;

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString:
        process.env.DATABASE_URL ||
        "postgres://linksta:linksta_password@localhost:5432/linksta_api",
    }),
  }),
});
