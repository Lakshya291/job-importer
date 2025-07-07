import app from "./app";
import { connectMongo } from "./config";
import { startWorker } from "./queue/";
import { startCron } from "./cron"; 

const PORT = Number(process.env.PORT) || 5000;

(async () => {
	try {
		await connectMongo();
		startWorker(); // initialise BullMQ worker (queue step)
		startCron(); // hourly import if cron.ts already returns a fn

		app.listen(PORT, () =>
			console.log(`[server] API listening on http://localhost:${PORT}`)
		);
	} catch (err) {
		console.error("[startup] Fatal:", err);
		process.exit(1);
	}
})();
