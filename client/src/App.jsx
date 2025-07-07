import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import JobDetails from "./pages/JobDetails";
import ImportLogs from "./pages/ImportLogs";

export default function App() {
	return (
		<div className="min-h-screen bg-gray-100 text-gray-900">
			<header className="p-2 bg-indigo-600 text-white flex justify-between items-center">
				<Link
					to="/"
					className="font-semibold text-md p-2 hover:bg-indigo-700 rounded-lg"
				>
					Job Importer Admin
				</Link>
				<nav className="space-x-4 mr-2">
					<Link to="/logs" className="hover:bg-indigo-700 p-2 rounded-lg">
						Import Logs
					</Link>
				</nav>
			</header>

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/jobs/:guid" element={<JobDetails />} />
				<Route path="/logs" element={<ImportLogs />} />
			</Routes>
		</div>
	);
}
