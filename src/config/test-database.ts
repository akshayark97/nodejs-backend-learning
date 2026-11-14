import { pool } from "./database.js";

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");

    console.log("Database connected successfully!");
    console.log("PostgreSQL time:", result.rows[0].now);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testConnection();