import { Router } from "express";
import { Task, TaskStatus, TaskPriority } from "./task.types.js";
import { randomUUID } from "node:crypto";

const router = Router();

const tasks: Task[] = [];

router.get("/", (req, res) => {
  const status = req.query.status;

  let result = tasks;

  if (typeof status === "string") {
    result = result.filter((task) => task.status === status);
  }

  const page = Math.max(
    1,
    Number.parseInt(String(req.query.page ?? "1"), 10) || 1,
  );

  const requestedLimit = Number.parseInt(String(req.query.limit ?? "10"), 10);

  const limit = Math.min(
    100,
    Math.max(1, Number.isNaN(requestedLimit) ? 10 : requestedLimit),
  );

  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;

  const paginatedTasks = result.slice(offset, offset + limit);

  res.status(200).json({
    success: true,
    data: paginatedTasks,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1 && total > 0,
    },
  });
});

// GET /api/tasks
router.get("/allTasks", (req, res) => {
  const status = req.query.status;

  let result = tasks;

  if (typeof status === "string") {
    result = result.filter((task) => task.status === status);
  }

  res.status(200).json({
    success: true,
    data: result,
  });
});

// GET /api/tasks/:id
router.get("/:id", (req, res) => {
  const task = tasks.find((task) => task.id === req.params.id);

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
});

// POST /api/tasks
router.post("/", (req, res) => {
  const body = req.body as {
    title?: unknown;
    description?: unknown;
  };


  if (typeof body.title !== "string" || !body.title.trim()) {
    res.status(400).json({
      success: false,
      message: "A valid title is required",
    });
    return;
  }

  if (body.description !== undefined && typeof body.description !== "string") {
    res.status(400).json({
      success: false,
      message: "Description must be a string",
    });
    return;
  }

  const task: Task = {
    id: randomUUID(),
    title: body.title.trim(),
    description: typeof body.description === "string" ? body.description : "",
    status: "pending",
    priority: "low",
    createdAt: new Date().toISOString(),
  };

  tasks.push(task);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

// PATCH /api/tasks/:id
router.patch("/:id", (req, res) => {
  const task = tasks.find((task) => task.id === req.params.id);

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
    return;
  }

  const body = req.body as {
    title?: unknown;
    description?: unknown;
    status?: unknown;
    priority?: unknown;
  };

  if (
    body.title === undefined &&
    body.description === undefined &&
    body.status === undefined &&
    body.priority === undefined
  ) {
    res.status(400).json({
      success: false,
      message: "Provide at least one field to update",
    });
    return;
  }

  if (
    body.title !== undefined &&
    (typeof body.title !== "string" || !body.title.trim())
  ) {
    res.status(400).json({
      success: false,
      message: "Title must be a non-empty string",
    });
    return;
  }

  if (body.description !== undefined && typeof body.description !== "string") {
    res.status(400).json({
      success: false,
      message: "Description must be a string",
    });
    return;
  }

  const validStatuses: TaskStatus[] = ["pending", "in_progress", "completed"];

  if (
    body.status !== undefined &&
    !validStatuses.includes(body.status as TaskStatus)
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid task status",
    });
    return;
  }

  const validPriorities = ["low", "medium", "high"];

  if (
    body.priority !== undefined &&
    (typeof body.priority !== "string" ||
      !validPriorities.includes(body.priority))
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid task priority",
    });
    return;
  }

  if (typeof body.title === "string") {
    task.title = body.title.trim();
  }

  if (typeof body.description === "string") {
    task.description = body.description;
  }

  if (typeof body.status === "string") {
    task.status = body.status as TaskStatus;
  }

  if (typeof body.priority === "string") {
    task.priority = body.priority as TaskPriority;
  }

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task,
  });
});

router.put("/:id", (req, res) => {
  const task = tasks.find((task) => task.id === req.params.id);

  if (!task) {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
    return;
  }

  const { title, description, status, priority } = req.body;

  const validStatuses = ["pending", "in_progress", "completed"];

  const validPriorities = ["low", "medium", "high"];

  if (
    typeof title !== "string" ||
    !title.trim() ||
    typeof description !== "string" ||
    !validStatuses.includes(status) ||
    !validPriorities.includes(priority)
  ) {
    res.status(400).json({
      success: false,
      message: "Invalid task data",
    });
    return;
  }

  task.title = title.trim();
  task.description = description;
  task.status = status;
  task.priority = priority;

  res.status(200).json({
    success: true,
    message: "Task replaced successfully",
    data: task,
  });
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res) => {
  const taskIndex = tasks.findIndex((task) => task.id === req.params.id);

  if (taskIndex === -1) {
    res.status(404).json({
      success: false,
      message: "Task not found",
    });
    return;
  }

  tasks.splice(taskIndex, 1);

  res.status(204).send();
});

export default router;
