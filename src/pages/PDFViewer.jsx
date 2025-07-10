import React, { useState, useEffect } from 'react';
import {
	Download,
	Eye,
	Calendar,
	Mail,
	Star,
	Tag,
	FileText,
	BookOpen,
	AlertCircle,
	ExternalLink,
	RefreshCw
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/NavBar';

// Skeleton Components
const SkeletonLine = ({ width = "100%" }) => (
	<div className={`h-4 bg-gray-200 rounded animate-pulse`} style={{ width }}></div>
);

const SkeletonAvatar = () => (
	<div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
);

const SkeletonCard = () => (
	<div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
		<div className="flex items-center justify-between mb-4">
			<div className="space-y-2 flex-1">
				<SkeletonLine width="80%" />
				<SkeletonLine width="60%" />
			</div>
			<div className="w-24 h-10 bg-gray-200 rounded-lg"></div>
		</div>
		<div className="space-y-3">
			<SkeletonLine width="90%" />
			<SkeletonLine width="70%" />
			<SkeletonLine width="85%" />
			<SkeletonLine width="60%" />
		</div>
	</div>
);

const SkeletonAuthor = () => (
	<div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
		<SkeletonLine width="50%" />
		<div className="flex items-center gap-4 mt-4 mb-4">
			<SkeletonAvatar />
			<div className="space-y-2 flex-1">
				<SkeletonLine width="60%" />
				<SkeletonLine width="80%" />
			</div>
		</div>
		<div className="space-y-3">
			<SkeletonLine width="40%" />
			<SkeletonLine width="100%" />
			<SkeletonLine width="90%" />
		</div>
	</div>
);

const SkeletonPDF = () => (
	<div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
		<div className="flex items-center justify-between mb-4">
			<SkeletonLine width="40%" />
			<div className="w-32 h-8 bg-gray-200 rounded-lg"></div>
		</div>
		<div className="w-full h-96 lg:h-[600px] bg-gray-200 rounded-lg"></div>
	</div>
);

const API_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const PDFViewer = () => {
	const { id } = useParams();
	const [resource, setResource] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [downloadLoading, setDownloadLoading] = useState(false);
	const [pdfError, setPdfError] = useState(false);
	const [showFullBio, setShowFullBio] = useState(false);
	const [expanded, setExpanded] = useState(false);

	const fetchResource = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await axios.get(`${API_URL}/resource/${id}`);

			if (response.data.success) {
				setResource(response.data.data);
			} else {
				throw new Error(response.data.message || 'Failed to fetch resource');
			}
		} catch (err) {
			const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch resource';
			setError(errorMessage);
			toast.error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchResource();
	}, [id]);

	const handleDownload = async () => {
		if (!resource?.url) return;

		try {
			setDownloadLoading(true);

			// Simulate download process
			await new Promise(resolve => setTimeout(resolve, 1000));

			const link = document.createElement('a');
			link.href = resource.url;
			link.download = `${resource.title}.pdf`;
			link.target = '_blank';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);

			toast.success('Download started successfully');
		} catch (err) {
			toast.error('Failed to download file');
		} finally {
			setDownloadLoading(false);
		}
	};

	const handleOpenExternal = () => {
		if (resource?.url) {
			window.open(resource.url, '_blank');
			toast.info('Opening PDF in new tab');
		}
	};

	const formatDate = (dateString) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};

	const renderStars = (rating) => {
		const stars = [];
		const fullStars = Math.floor(rating);
		const hasHalfStar = rating % 1 !== 0;

		for (let i = 0; i < fullStars; i++) {
			stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
		}

		if (hasHalfStar) {
			stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
		}

		const emptyStars = 5 - Math.ceil(rating);
		for (let i = 0; i < emptyStars; i++) {
			stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
		}

		return stars;
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto p-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Left Panel - Details Skeleton */}
						<div className="space-y-6">
							<SkeletonCard />
							<SkeletonAuthor />
						</div>

						{/* Right Panel - PDF Skeleton */}
						<div className="lg:sticky lg:top-4 lg:h-fit">
							<SkeletonPDF />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<>
				<div className="min-h-screen bg-gray-50">
					<div className="max-w-7xl mx-auto p-4">
						<div className="bg-white rounded-lg shadow-sm p-12">
							<div className="text-center">
								<AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
								<h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
								<p className="text-gray-500 mb-4">{error}</p>
								<button
									onClick={fetchResource}
									className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
								>
									<RefreshCw className="w-4 h-4" />
									Try Again
								</button>
							</div>
						</div>
					</div>
				</div>
			</>
		);
	}

	if (!resource) {
		return (
			<div className="min-h-screen bg-gray-50">
				<div className="max-w-7xl mx-auto p-4">
					<div className="bg-white rounded-lg shadow-sm p-12">
						<div className="text-center">
							<FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-medium text-gray-900 mb-2">Resource Not Found</h3>
							<p className="text-gray-500 mb-4">The requested resource could not be found.</p>
							<button
								onClick={fetchResource}
								className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
							>
								Refresh Page
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<NavBar />
			<div className="max-w-7xl mx-auto md:px-20 px-4 py-4">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Left Panel - Resource Details */}
					<div className="space-y-6">
						{/* Resource Info Card */}
						<div className="bg-white rounded-lg shadow-md p-4">
							<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
								<div className="flex-1">
									<h1 className="text-2xl font-bold text-gray-900 mb-2">{resource.title}</h1>
									<div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
										<span className="flex items-center gap-1">
											<BookOpen className="w-4 h-4" />
											{resource.subject}
										</span>
										<span className="flex items-center gap-1">
											<FileText className="w-4 h-4" />
											{resource.type}
										</span>
										<span className="flex items-center gap-1">
											<Eye className="w-4 h-4" />
											{resource.views.toLocaleString()} views
										</span>
									</div>
								</div>

								<div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
									<button
										onClick={handleOpenExternal}
										className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
									>
										<ExternalLink className="w-4 h-4" />
										Open
									</button>
									<button
										onClick={handleDownload}
										disabled={downloadLoading}
										className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
									>
										<Download className="w-4 h-4" />
										{downloadLoading ? 'Downloading...' : 'Download'}
									</button>
								</div>
							</div>

							<div className="pt-6 border-t mb-6">
								<h3 className="font-semibold text-gray-900 mb-3">Description</h3>
								<p
									className={`text-gray-700 leading-relaxed transition-all duration-300 ${expanded ? '' : 'line-clamp-3'
										}`}
								>
									{resource.description}
								</p>
								{resource.description.length > 0 && (
									<button
										onClick={() => setExpanded(!expanded)}
										className="text-blue-600 text-sm mt-1 hover:underline"
									>
										{expanded ? 'See less' : 'See more'}
									</button>
								)}
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Calendar className="w-4 h-4" />
									<span className="font-medium">Created:</span>
									<span>{formatDate(resource.createdAt)}</span>
								</div>

								<div className="flex items-center gap-2 text-sm text-gray-600">
									<Calendar className="w-4 h-4" />
									<span className="font-medium">Updated:</span>
									<span>{formatDate(resource.updatedAt)}</span>
								</div>
							</div>

							{resource.tags && resource.tags.length > 0 && (
								<div>
									<div className="flex items-center gap-2 mb-3">
										<Tag className="w-4 h-4 text-gray-600" />
										<span className="font-medium text-gray-900">Tags</span>
									</div>
									<div className="flex flex-wrap gap-2">
										{resource.tags.map((tag, index) => (
											<span
												key={index}
												className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
											>
												{tag}
											</span>
										))}
									</div>
								</div>
							)}
						</div>

						{/* Author Info Card */}
						{resource.author && (
							<div className="bg-white rounded-lg shadow-md p-4">
								<h3 className="font-semibold text-gray-900 mb-4">Author</h3>

								<div className="flex items-center gap-4 mb-4">
									<img
										src={resource.author.profilePic}
										alt={resource.author.fullName}
										className="w-10 md:w-16 h-10 md:h-16 rounded-full object-cover"
									/>
									<div>
										<h4 className="font-semibold text-gray-900">{resource.author.fullName}</h4>
										<div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
											<Mail className="w-3 h-3" />
											<span className="block max-w-[calc(100vw-180px)] truncate text-xs md:text-sm">{resource.author.email}</span>
										</div>
									</div>
								</div>

								{resource.author.rating && (
									<div className="flex items-center gap-2 mb-4">
										<div className="flex items-center gap-1">
											{renderStars(resource.author.rating.avgRating)}
										</div>
										<span className="text-sm text-gray-600">
											{resource.author.rating.avgRating.toFixed(1)} ({resource.author.rating.count} reviews)
										</span>
									</div>
								)}

								{resource.author.bio && (
									<div className="mb-6">
										<h5 className="font-medium text-gray-900 mb-2">About</h5>
										<p
											className={`text-gray-600 text-sm leading-relaxed transition-all duration-300 ${showFullBio ? '' : 'line-clamp-3'
												}`}
										>
											{resource.author.bio}
										</p>
										{resource.author.bio.length > 0 && (
											<button
												onClick={() => setShowFullBio(!showFullBio)}
												className="text-blue-600 text-sm mt-1 hover:underline"
											>
												{showFullBio ? 'See less' : 'See more'}
											</button>
										)}
									</div>
								)}
							</div>
						)}
					</div>

					{/* Right Panel - PDF Preview */}
					<div className="lg:sticky lg:top-4 lg:h-fit">
						<div className="bg-white rounded-lg shadow-sm">
							<div className="w-full h-96 lg:h-[600px] border border-gray-200 rounded-lg overflow-hidden">
								{!pdfError ? (
									<iframe
										src={`${resource.url}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
										className="w-full h-full"
										title={resource.title}
										onError={() => {
											setPdfError(true);
											toast.error('Unable to load PDF preview');
										}}
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center bg-gray-50">
										<div className="text-center">
											<FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
											<p className="text-gray-600 mb-2">Unable to preview PDF</p>
											<div className="flex gap-2 justify-center">
												<button
													onClick={handleOpenExternal}
													className="flex items-center gap-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
												>
													<ExternalLink className="w-4 h-4" />
													Open in Tab
												</button>
												<button
													onClick={handleDownload}
													disabled={downloadLoading}
													className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 text-sm"
												>
													<Download className="w-4 h-4" />
													Download
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PDFViewer;