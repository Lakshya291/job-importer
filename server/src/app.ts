import express from "express";
import morgan from "morgan"; // optional tiny logger
import importsRouter from "./routes/imports";
import jobsRouter from "./routes/jobs"

const app = express();

// middle‑wares
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/imports", importsRouter);
app.use("/jobs", jobsRouter);

// basic health check
app.get("/", (_req, res) => res.send("Job Importer API is running"));

export default app;
// This is the main application file for the Job Importer server.
