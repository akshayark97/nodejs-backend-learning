
import { Router } from "express";
import {
  createTask,
  deleteTask,
  findAllTasks,
  findTaskById,
  updateTask,
  type TaskStatus,
} from "./task.repository.js";

const router = Router();

const validStatuses: TaskStatus[] = [
  "pending",
  "in_progress",
  "completed",
];

function isValidUUID(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

// GET /api/tasks
router.get("/", async (req, res, next) => {
  try {
    const status = req.query.status;

    if (
      status !== undefined &&
      (typeof status !== "string" ||
        !validStatuses.includes(status as TaskStatus))
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
      return;
    }

    const tasks = await findAllTasks(status as TaskStatus | undefined);

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/tasks/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    const task = await findTaskById(id);

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/tasks
router.post("/", async (req, res, next) => {
  try {
    const { title, description = "" } = req.body ?? {};

    if (
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 200
    ) {
      res.status(400).json({
        success: false,
        message: "Title must be a non-empty string of at most 200 characters",
      });
      return;
    }

    if (typeof description !== "string") {
      res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
      return;
    }

    const task = await createTask(title.trim(), description);

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/tasks/:id
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    const { title, description, status } = req.body ?? {};

    if (
      title === undefined &&
      description === undefined &&
      status === undefined
    ) {
      res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
      return;
    }

    if (
      title !== undefined &&
      (typeof title !== "string" ||
        !title.trim() ||
        title.length > 200)
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid title",
      });
      return;
    }

    if (
      description !== undefined &&
      typeof description !== "string"
    ) {
      res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
      return;
    }

    if (
      status !== undefined &&
      (typeof status !== "string" ||
        !validStatuses.includes(status as TaskStatus))
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
      return;
    }

    const task = await updateTask(
      id,
      title === undefined ? undefined : title.trim(),
      description,
      status as TaskStatus | undefined
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
      return;
    }

    const deleted = await deleteTask(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
