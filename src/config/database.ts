import "dotenv/config"
import { Pool } from "pg"

const connectionString = process.env.DATABASE_URL;

if(!connectionString) {
    throw new Error("DATABASE_URL is not configured");
}

export const pool = new Pool({
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
})

// Log unexpected errors on idle clients
pool.on("error", (err) => {
    console.error("Unexpected PostgreSQL pool error:", err)
})