import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar'
import { Send, Globe, FileText, CheckCircle, AlertCircle, Shield, Search, Clock, Database, Activity } from 'lucide-react';

const Plagiarism = () => {
	const [input, setInput] = useState('');
	const [response, setResponse] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [healthStatus, setHealthStatus] = useState(null);

	// Update this to match your backend URL
	const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

	const isUrl = (str) => {
		try {
			new URL(str);
			return true;
		} catch {
			return false;
		}
	};

	const checkHealth = async () => {
		try {
			const response = await axios.get(`${API_BASE_URL}/plagiarism/health`);
			setHealthStatus(response.data);
		} catch (err) {
			setHealthStatus({
				success: false,
				status: 'unhealthy',
				message: 'Cannot connect to server'
			});
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!input.trim()) return;

		setLoading(true);
		setError('');
		setResponse(null);

		try {
			const response = await axios.post(`${API_BASE_URL}/plagiarism/check`, {
				input: input.trim(),
				type: isUrl(input.trim()) ? 'url' : 'text'
			}, {
				headers: {
					'Content-Type': 'application/json',
				},
				timeout: 120000 // 2 minutes timeout
			});

			const data = response.data;

			if (!data.success) {
				throw new Error(data.message || 'Request failed');
			}

			setResponse(data);
		} catch (err) {
			console.error('Error:', err);

			let errorMessage = 'An error occurred';

			if (err.code === 'ECONNABORTED') {
				errorMessage = 'Request timed out. Please try again.';
			} else if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
				errorMessage = `Cannot connect to server at ${API_BASE_URL}. Make sure your EasyPro backend is running.`;
			} else if (err.response) {
				// Server responded with error status
				errorMessage = err.response.data?.message || `Server error: ${err.response.status}`;
			} else if (err.request) {
				// Request was made but no response received
				errorMessage = 'No response from server. Please check your connection.';
			} else {
				// Something else happened
				errorMessage = err.message;
			}

			setError(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	const inputType = input.trim() ? (isUrl(input.trim()) ? 'url' : 'text') : '';

	const renderPlagiarismResult = (plagiarismResult) => {
		if (!plagiarismResult) return null;

		// Handle different response formats from GoWinston API
		const score = plagiarismResult.score || plagiarismResult.plagiarism_score || 0;
		const isAI = plagiarismResult.isAI || plagiarismResult.ai_generated || false;
		const sources = plagiarismResult.sources || plagiarismResult.matches || [];

		return (
			<div className="space-y-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
						<div className="flex items-center gap-2 mb-2">
							<Shield className="h-5 w-5 text-blue-600" />
							<span className="font-semibold text-blue-800">Plagiarism Score</span>
						</div>
						<div className="text-2xl font-bold text-blue-900">{score}%</div>
						<div className="text-sm text-blue-700 mt-1">
							{score < 10 ? 'Excellent' : score < 25 ? 'Good' : score < 50 ? 'Moderate' : 'High'}
						</div>
					</div>

					<div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
						<div className="flex items-center gap-2 mb-2">
							<Search className="h-5 w-5 text-purple-600" />
							<span className="font-semibold text-purple-800">AI Generated</span>
						</div>
						<div className="text-2xl font-bold text-purple-900">{isAI ? 'Yes' : 'No'}</div>
						<div className="text-sm text-purple-700 mt-1">
							{isAI ? 'AI content detected' : 'Human-written content'}
						</div>
					</div>
				</div>

				{sources && sources.length > 0 && (
					<div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
						<h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
							<Database className="h-4 w-4" />
							Sources Found ({sources.length})
						</h4>
						<div className="space-y-2 max-h-48 overflow-y-auto">
							{sources.slice(0, 10).map((source, index) => (
								<div key={index} className="text-sm text-yellow-700 bg-yellow-100 p-3 rounded border border-yellow-200">
									<div className="font-medium">
										{source.title || `Source ${index + 1}`}
									</div>
									{source.url && (
										<div className="text-xs text-yellow-600 mt-1 truncate">
											{source.url}
										</div>
									)}
									{source.similarity && (
										<div className="text-xs text-yellow-600 mt-1">
											Similarity: {source.similarity}%
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
			<NavBar />
			<div className="max-w-4xl mx-auto">

				{/* Health Status */}
				<div className="mb-6">
					<button
						onClick={checkHealth}
						className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
					>
						<Activity className="h-4 w-4" />
						Check Service Health
					</button>

					{healthStatus && (
						<div className={`mt-3 p-3 rounded-lg border ${healthStatus.success
							? 'bg-green-50 border-green-200 text-green-800'
							: 'bg-red-50 border-red-200 text-red-800'
							}`}>
							<div className="flex items-center gap-2 text-sm">
								<div className={`w-2 h-2 rounded-full ${healthStatus.success ? 'bg-green-500' : 'bg-red-500'
									}`}></div>
								Status: {healthStatus.status}
								{healthStatus.cache_size !== undefined && (
									<span className="ml-2">• Cache: {healthStatus.cache_size} items</span>
								)}
							</div>
						</div>
					)}
				</div>

				{/* Main Card */}
				<div className="bg-white rounded-xl shadow-lg p-8 mb-8">
					<div className="space-y-4">
						<div className="relative">
							<div className="absolute left-3 top-3 z-10">
								{inputType === 'url' ? (
									<Globe className="h-5 w-5 text-blue-500" />
								) : inputType === 'text' ? (
									<FileText className="h-5 w-5 text-green-500" />
								) : (
									<div className="h-5 w-5" />
								)}
							</div>
							<textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && e.ctrlKey) {
										handleSubmit(e);
									}
								}}
								placeholder="Enter a URL (https://example.com/document.pdf) or paste text to check for plagiarism... (Ctrl+Enter to submit)"
								className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
								rows="6"
							/>
						</div>

						{inputType && (
							<div className="flex items-center gap-2 text-sm">
								<div className={`px-3 py-1 rounded-full text-xs font-medium ${inputType === 'url'
									? 'bg-blue-100 text-blue-800'
									: 'bg-green-100 text-green-800'
									}`}>
									{inputType === 'url' ? 'URL/File detected' : 'Text content detected'}
								</div>
								<div className="text-gray-500">
									{input.length} characters
								</div>
							</div>
						)}

						<button
							onClick={handleSubmit}
							disabled={!input.trim() || loading}
							className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white py-4 px-6 rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
						>
							{loading ? (
								<>
									<div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
									Analyzing content...
								</>
							) : (
								<>
									<Send className="h-5 w-5" />
									Check for Plagiarism
								</>
							)}
						</button>
					</div>

					{error && (
						<div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
							<div className="flex items-center gap-2">
								<AlertCircle className="h-5 w-5 text-red-500" />
								<span className="text-red-700 font-medium">Error</span>
							</div>
							<p className="text-red-600 mt-1">{error}</p>
						</div>
					)}

					{response && (
						<div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
							<div className="flex items-center gap-2 mb-4">
								<CheckCircle className="h-5 w-5 text-green-500" />
								<span className="text-green-700 font-medium">Analysis Complete</span>
								{response.cached && (
									<span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex items-center gap-1">
										<Clock className="h-3 w-3" />
										Cached
									</span>
								)}
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-sm">
								<div>
									<span className="font-medium text-gray-700">Content Type:</span>
									<span className="ml-2 text-gray-600 capitalize">{response.type}</span>
								</div>
								<div>
									<span className="font-medium text-gray-700">Processed:</span>
									<span className="ml-2 text-gray-600">
										{new Date(response.timestamp).toLocaleString()}
									</span>
								</div>
								{response.data?.textStats && (
									<>
										<div>
											<span className="font-medium text-gray-700">Word Count:</span>
											<span className="ml-2 text-gray-600">{response.data.textStats.wordCount}</span>
										</div>
										<div>
											<span className="font-medium text-gray-700">Character Count:</span>
											<span className="ml-2 text-gray-600">{response.data.textStats.length}</span>
										</div>
									</>
								)}
								{response.data?.domain && (
									<div className="md:col-span-2">
										<span className="font-medium text-gray-700">Source Domain:</span>
										<span className="ml-2 text-gray-600">{response.data.domain}</span>
									</div>
								)}
							</div>

							{response.data?.plagiarismResult && (
								<div>
									<h3 className="font-medium text-gray-700 mb-4 text-lg">Plagiarism Analysis Results</h3>
									{renderPlagiarismResult(response.data.plagiarismResult)}
								</div>
							)}
						</div>
					)}
				</div>

				{/* Footer */}
				<div className="text-center text-sm text-gray-500 space-y-2">
					<p>Powered by GoWinston AI • EasyPro Platform</p>
					<div className="text-xs text-gray-400">
						Rate limited to 20 requests per 15 minutes • Results cached for 10 minutes
					</div>
				</div>
			</div>
		</div>
	);
}

export default Plagiarism;