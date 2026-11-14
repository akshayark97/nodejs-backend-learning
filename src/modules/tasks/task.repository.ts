
import type { QueryResultRow } from "pg";
import { pool } from "../../config/database.js";

export type TaskStatus =
  | "pending"
  | "in_progress"
  | "completed";

export interface TaskRow extends QueryResultRow {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  created_at: Date;
  updated_at: Date;
}

// Get all tasks
export async function findAllTasks(status?: TaskStatus) {
  const result = status
    ? await pool.query<TaskRow>(
        `SELECT * FROM tasks
         WHERE status = $1
         ORDER BY created_at DESC`,
        [status]
      )
    : await pool.query<TaskRow>(
        `SELECT * FROM tasks
         ORDER BY created_at DESC`
      );

  return result.rows;
}

// Get one task
export async function findTaskById(id: string) {
  const result = await pool.query<TaskRow>(
    `SELECT * FROM tasks WHERE id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

// Create task
export async function createTask(
  title: string,
  description: string
) {
  const result = await pool.query<TaskRow>(
    `INSERT INTO tasks (title, description)
     VALUES ($1, $2)
     RETURNING *`,
    [title, description]
  );

  return result.rows[0];
}

// Update task
export async function updateTask(
  id: string,
  title: string | undefined,
  description: string | undefined,
  status: TaskStatus | undefined
) {
  const result = await pool.query<TaskRow>(
    `UPDATE tasks
     SET
       title = COALESCE($2, title),
       description = COALESCE($3, description),
       status = COALESCE($4, status),
       updated_at = NOW()
     WHERE id = $1
     RETURNING *`,
    [id, title ?? null, description ?? null, status ?? null]
  );

  return result.rows[0] ?? null;
}

// Delete task
export async function deleteTask(id: string) {
  const result = await pool.query(
    `DELETE FROM tasks WHERE id = $1 RETURNING id`,
    [id]
  );

  return result.rowCount !== null && result.rowCount > 0;
}
