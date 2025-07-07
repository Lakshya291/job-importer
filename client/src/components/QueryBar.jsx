export default function QueryBar({ query, setQuery, onSearch }) {
	return (
		<div className="flex gap-2 mb-6">
			<input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && onSearch()}
				placeholder="Search jobs…"
				className="flex-1 px-3 py-2 border rounded shadow-sm"
			/>
			<button
				onClick={onSearch}
				className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
			>
				Search
			</button>
		</div>
	);
}
