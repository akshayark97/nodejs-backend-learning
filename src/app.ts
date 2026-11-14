import express from "express"
import { requestLogger } from "./middleware/request-logger.js"
import { requestTimer } from "./middleware/request-timer.js"
import { responseHeader } from "./middleware/response-header.js"
import taskRoutes from './modules/tasks/task.routes.js'
import { errorHandler } from "./middleware/error-handler.js"

const app = express()

// Middleware 1: Request logging
app.use(requestLogger)

// Middleware 2: Request timing
app.use(requestTimer)

// Middleware 3: Custom response header
app.use(responseHeader)

// Middleware 4: Parse JSON request bodies
app.use(express.json())

app.get("/health", (req, res) => { // Runs Third
    return res.status(200).json({
        success: true,
        message: "Task processing platform is running"
    })
})

app.use("/api/tasks", taskRoutes)

// Error handler must come after routes
app.use(errorHandler)

export default app