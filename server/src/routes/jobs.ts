import { Router } from "express";
import Job from "../models/Job";

const router = Router();

/**
 * GET /jobs
 * Query params:
 *   q         – text search in title / company
 *   company   – exact company match
 *   limit     – page size  (default 20)
 *   skip      – offset     (default 0)
 *   from, to  – ISO dates to filter publishedAt
 */
router.get("/", async (req, res, next) => {
  try {
    const {
      q,
      company,
      limit = "20",
      skip = "0",
      from,
      to
    } = req.query as Record<string, string>;

    /* build dynamic filter */
    const filter: any = {};
    if (q)
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } }
      ];
    if (company) filter.company = company;
    if (from || to)
      filter.publishedAt = {
        ...(from && { $gte: new Date(from) }),
        ...(to && { $lte: new Date(to) })
      };

    const jobs = await Job.find(filter)
      .sort({ publishedAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    res.json(jobs);
  } catch (e) {
    next(e);
  }
});

/* optional: show a single job by guid */
router.get("/:guid", async (req, res, next) => {
  try {
    const job = await Job.findOne({ guid: req.params.guid });
    if (!job) return res.status(404).json({ error: "Not found" });
    res.json(job);
  } catch (e) {
    next(e);
  }
});

export default router;
