import { defineConfig } from "drizzle-kit";

// Drizzle migrations MUST use DATABASE_URL_MIGRATIONS (port 5432 Session pooler)
// Our Next.js app uses DATABASE_URL (port 6543 Transaction pooler)
const databaseUrl = process.env.DATABASE_URL_MIGRATIONS ?? process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL_MIGRATIONS or DATABASE_URL");
}

export default defineConfig({
  schema: "./src/db/schema/index.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
  verbose: true,
  strict: true,
});
