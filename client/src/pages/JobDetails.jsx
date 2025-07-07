import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function JobDetails() {
	const { guid } = useParams();
	const [job, setJob] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetch(`/jobs/${encodeURIComponent(guid)}`)
			.then((res) => res.json())
			.then((data) => {
				setJob(data);
				setLoading(false);
			})
			.catch((err) => {
				console.error("Error fetching job details:", err);
				setLoading(false);
			});
	}, [guid]);

	if (loading) return <p className="p-6 text-center text-gray-500">Loading…</p>;

	if (!job)
		return (
			<p className="p-6 text-center text-red-500">
				Job not found or an error occurred.
			</p>
		);

	return (
		<div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
			<h1 className="text-3xl font-bold mb-2">{job.title}</h1>
			<p className="text-gray-600 mb-4">
				{job.company || "Company not specified"} •{" "}
				{new Date(job.publishedAt).toLocaleDateString(undefined, {
					year: "numeric",
					month: "short",
					day: "numeric",
				})}
			</p>

			{job.location && (
				<p className="mb-4 text-sm text-gray-500">📍 {job.location}</p>
			)}

			<div
				className="prose max-w-none mb-6"
				dangerouslySetInnerHTML={{ __html: job.description }}
			/>

			{job.link && (
				<a
					href={job.link}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
				>
					View Original Post
				</a>
			)}

			<div className="mt-4">
				<Link to="/" className="text-indigo-500 hover:underline">
					← Back to listings
				</Link>
			</div>
		</div>
	);
}
