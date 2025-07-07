import { useEffect, useState } from "react";

export default function ImportLogs() {
	const [logs, setLogs] = useState([]);
	const [loading, setLoading] = useState(true);
	const [running, setRunning] = useState(false);

	const fetchLogs = () => {
		setLoading(true);
		fetch("/imports/logs")
			.then((res) => res.json())
			.then((data) => {
				setLogs(data);
				setLoading(false);
			})
			.catch(console.error);
	};

	useEffect(() => {
		fetchLogs();
	}, []);

	const runImport = async () => {
		setRunning(true);
		try {
			const res = await fetch("/imports/run", { method: "POST" });
			const data = await res.json();
			console.log("Import Result:", data);
			fetchLogs(); // refresh after import
		} catch (err) {
			console.error("Import failed", err);
		} finally {
			setRunning(false);
		}
	};

	return (
		<div className="max-w-5xl mx-auto p-6">
			<div className="flex justify-between items-center mb-4">
				<h1 className="text-2xl font-semibold">Import Logs</h1>
				<button
					onClick={runImport}
					className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
					disabled={running}
				>
					{running ? "Running..." : "Run Import"}
				</button>
			</div>

			{loading ? (
				<p className="text-center text-gray-500">Loading logs…</p>
			) : (
				<div className="overflow-x-auto bg-white shadow rounded-lg">
					<table className="min-w-full text-sm">
						<thead className="bg-indigo-600 text-white uppercase tracking-wider text-xs">
							<tr>
								<th className="px-4 py-3 text-left">Started</th>
								<th className="px-4 py-3">New Jobs</th>
								<th className="px-4 py-3">Total Fetched</th>
								<th className="px-4 py-3">Source Feeds</th>
								<th className="px-4 py-3">Failed</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{logs.map((log) => (
								<tr key={log._id}>
									<td className="px-4 py-2">
										{new Date(log.startedAt).toLocaleString()}
									</td>
									<td className="px-4 py-2 text-center">{log.newJobs}</td>
									<td className="px-4 py-2 text-center">{log.totalFetched}</td>
									<td className="px-4 py-2 text-center">
										{log.sourceUrls.length}
									</td>
									<td className="px-4 py-2 text-center">
										{log.failedFeeds.length}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
