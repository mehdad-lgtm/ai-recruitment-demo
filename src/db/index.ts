import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Connection string from environment
const connectionString = process.env.DATABASE_URL;

// Create a mock client for development when DATABASE_URL is not set
const createClient = () => {
  if (!connectionString) {
    console.warn(
      "⚠️  DATABASE_URL is not set. Database operations will fail. " +
      "Please set DATABASE_URL in your .env file to connect to Supabase."
    );
    // Return a placeholder that will throw meaningful errors
    return null;
  }
  
  return postgres(connectionString, {
    max: 10, // Maximum connections in pool
    idle_timeout: 20,
    connect_timeout: 10,
  });
};

const client = createClient();

// Create drizzle instance with schema (or a placeholder)
export const db = client 
  ? drizzle(client, { schema })
  : (new Proxy({}, {
      get: () => {
        throw new Error(
          "Database not configured. Please set DATABASE_URL in your .env file."
        );
      },
    }) as ReturnType<typeof drizzle>);

// Export types
export type Database = typeof db;
