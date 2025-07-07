import { Router, Request, Response, NextFunction } from "express";
import { runImport } from "../services/fetchFeeds";
import ImportLog from "../models/ImportLog";

const router = Router();

router.get("/ping", (_req: Request, res: Response) => {
	return res.json({ ok: true });
});

router.post("/test-queue", (_req: Request, res: Response) => {
	console.log("[test-queue] Simulating a job");
	// dummy example: push test data to queue
	res.json({ ok: true, message: "Test queue route hit" });
});
// in src/routes/imports.ts
router.post("/debug-run", async (_req, res) => {
	const stats = await runImport();
	res.json({ ok: true, stats });
});

router.post("/run", async (_req: Request, res: Response) => {
	const stats = await runImport();
	res.json({ ok: true, stats });
});

// GET /imports/logs?limit=50&skip=0
router.get("/logs", async (req, res, next) => {
	try {
		const limit = Number(req.query.limit) || 50;
		const skip = Number(req.query.skip) || 0;

		const logs = await ImportLog.find()
			.sort({ createdAt: -1 }) // newest first
			.skip(skip)
			.limit(limit);

		res.json(logs);
	} catch (err) {
		next(err);
	}
});

export default router;
