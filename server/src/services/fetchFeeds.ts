import axios from "axios";
import { parseStringPromise } from "xml2js";
import { RawFeedItemModel } from "../models/rawFeedItem";
import ImportLog from "../models/ImportLog";
import { jobQueue } from "../queue";

const FEEDS = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm"
];

/* ── sanitise helper: removes $‑prefix & dots ───────────────────────── */
export function sanitise(obj: any): any {
  if (Array.isArray(obj)) return obj.map(sanitise);
  if (obj && typeof obj === "object") {
    const out: any = {};
    for (const key in obj) {
      const safe = key.replace(/^\$+/g, "_").replace(/\./g, "_");
      out[safe] = sanitise(obj[key]);
    }
    return out;
  }
  return obj;
}

/* ── main importer ──────────────────────────────────────────────────── */
export const runImport = async () => {
  const stats = {
    timestamp: new Date(),
    totalFetched: 0,
    newJobs: 0,
    failedFeeds: [] as string[]
  };

  for (const url of FEEDS) {
    try {
      const { data } = await axios.get(url);
      const parsed = await parseStringPromise(data, { explicitArray: false });
      const items = parsed.rss?.channel?.item ?? [];
      const jobs = Array.isArray(items) ? items : [items];
      stats.totalFetched += jobs.length;

      for (const job of jobs) {
        let guid: any = job.guid?.["#text"] || job.guid || job.link;
        if (typeof guid === "object") guid = guid._ || job.link;
        if (!guid || typeof guid !== "string") continue;

        // store raw feed item
        await RawFeedItemModel.replaceOne(
          { guid },
          { guid, feedUrl: url, raw: sanitise(job), fetchedAt: new Date() },
          { upsert: true }
        );

        // queue for background processing
        await jobQueue.add("importJob", { guid });
        stats.newJobs++;
      }
    } catch (err: any) {
      console.error(`[import-error] ${url} → ${err.message}`);
      stats.failedFeeds.push(url);
    }
  }
  await ImportLog.create({
  sourceUrls: FEEDS,
  startedAt:  stats.timestamp,
  finishedAt: new Date(),
  totalFetched: stats.totalFetched,
  newJobs: stats.newJobs,
  failedFeeds: stats.failedFeeds,
});
  return stats;
};
