import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import QueryBar from "../components/QueryBar";

export default function Home() {
	const PAGE_SIZE = 50;

	const [jobs, setJobs] = useState([]);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [skip, setSkip] = useState(0);
	const [hasMore, setHasMore] = useState(true);
	const [error, setError] = useState("");

	const fetchJobs = async (reset = false) => {
		setLoading(true);
		setError("");
		try {
			const res = await fetch(
				`/jobs?limit=${PAGE_SIZE}&skip=${
					reset ? 0 : skip
				}&q=${encodeURIComponent(query)}`
			);
			if (!res.ok) throw new Error(res.statusText);
			const data = await res.json();

			/* update state */
			if (reset) {
				setJobs(data);
				setSkip(PAGE_SIZE);
			} else {
				setJobs((prev) => [...prev, ...data]);
				setSkip((prev) => prev + PAGE_SIZE);
			}
			setHasMore(data.length === PAGE_SIZE);
		} catch (e) {
			setError("Could not fetch jobs. Is the backend running?");
		} finally {
			setLoading(false);
		}
	};

	/* first load */
	useEffect(() => {
		fetchJobs(true);
	}, []); // eslint-disable-line react-hooks/exhaustive-deps
	const handleSearch = () => fetchJobs(true);

	return (
		<div className="mx-auto max-w-6xl p-6">
			<h1 className="text-2xl font-semibold mb-4">Latest Jobs</h1>

			<QueryBar query={query} setQuery={setQuery} onSearch={handleSearch} />

			<div className="overflow-x-auto bg-white shadow rounded-lg">
				<table className="min-w-full text-sm">
					<thead>
						<tr className="bg-indigo-600 text-white uppercase tracking-wider text-xs">
							<th className="px-4 py-3 text-left">Title</th>
							<th className="px-4 py-3">Company</th>
							<th className="px-4 py-3">Published</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-200">
						{loading && (
							<tr>
								<td colSpan={3} className="p-6 text-center text-gray-500">
									Loading…
								</td>
							</tr>
						)}

						{error && (
							<tr>
								<td colSpan={3} className="p-6 text-center text-red-600">
									{error}
								</td>
							</tr>
						)}

						{!loading && !error && jobs.length === 0 && (
							<tr>
								<td colSpan={3} className="p-6 text-center text-gray-500">
									No jobs found.
								</td>
							</tr>
						)}

						{jobs.map((job) => (
							<tr key={job.guid} className="hover:bg-gray-50">
								<td className="px-4 py-2">
									<Link
										to={`/jobs/${encodeURIComponent(job.guid)}`}
										className="text-indigo-600 hover:underline"
									>
										{job.title}
									</Link>
								</td>
								<td className="px-4 py-2 text-center">{job.company}</td>
								<td className="px-4 py-2 text-center">
									{new Date(job.publishedAt).toLocaleDateString()}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			{!loading && hasMore && !error && (
				<div className="flex justify-center mt-4">
					<button
						onClick={() => fetchJobs(false)}
						className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
					>
						Load more
					</button>
				</div>
			)}

			{!hasMore && !loading && !error && (
				<p className="text-center mt-4 text-gray-400">No more jobs.</p>
			)}
		</div>
	);
}
