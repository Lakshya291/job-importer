import { Queue, Worker, QueueEvents, Job } from "bullmq";
import IORedis from "ioredis";
import { RawFeedItemModel } from "../models/rawFeedItem";
import JobModel from "../models/Job";
import dotenv from "dotenv";
dotenv.config();

/* ────────────────────────────────────────────────────────── */
/*  1. Redis connection                                       */
const connection = new IORedis({
	host: process.env.REDIS_HOST,
	port: Number(process.env.REDIS_PORT),
	password: process.env.REDIS_PASSWORD || undefined,
	maxRetriesPerRequest: null, // required by BullMQ v5
});

/*  2. Queue + event listener                                 */
export const jobQueue = new Queue("job-import", { connection });

const queueEvents = new QueueEvents("job-import", { connection });
queueEvents.on("failed", ({ jobId, failedReason }) =>
	console.error(`[queue] Job ${jobId} failed → ${failedReason}`)
);

/* ────────────────────────────────────────────────────────── */
/*  3. Small helper to clean invalid Mongo keys               */
function sanitise(obj: any): any {
	if (Array.isArray(obj)) return obj.map(sanitise);
	if (obj && typeof obj === "object") {
		const out: any = {};
		for (const k in obj) {
			const safe = k.replace(/^\$+/g, "_").replace(/\./g, "_");
			out[safe] = sanitise(obj[k]);
		}
		return out;
	}
	return obj;
}

/* ────────────────────────────────────────────────────────── */
/*  4. Worker                                                 */
export const startWorker = () => {
	const concurrency = Number(process.env.QUEUE_CONCURRENCY) || 5;

	new Worker(
		"job-import",
		async (job: Job) => {
			const { guid } = job.data;

			// 4‑a. Fetch the raw feed item stored earlier
			const rawDoc = await RawFeedItemModel.findOne({ guid });
			if (!rawDoc) return "missing‑raw";

			const it: any = rawDoc.raw; // original item

			// 4‑b. Prepare payload for primary jobs collection
			const payload = {
				guid,
				title: it.title ?? "",
				link: it.link ?? "",
				description: it.description ?? "",
				company: it["job:company"] ?? "",
				publishedAt: new Date(it.pubDate),
				raw: JSON.stringify(sanitise(it)), // safe string
			};

			// 4‑c. Upsert using replaceOne (avoids $ key validation)
			await JobModel.replaceOne({ guid }, payload, { upsert: true });
			return "upserted";
		},
		{ connection, concurrency }
	);

	console.log(`[queue] Worker ready → concurrency ${concurrency}`);
};
