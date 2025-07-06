import { useState, useEffect } from 'react';
import axios from 'axios';
import {
	Search,
	Filter,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	FileText,
	FileVideo,
	FileAudio,
	FileImage,
	FileCode,
	FileArchive,
	File,
	User
} from 'lucide-react';
import NavBar from '../components/NavBar';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ResourceList = () => {
	const [resources, setResources] = useState([]);
	const [loading, setLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState('');
	const [filters, setFilters] = useState({
		type: '',
		subject: ''
	});
	const [sortConfig, setSortConfig] = useState({
		key: 'createdAt',
		direction: 'desc'
	});
	const [pagination, setPagination] = useState({
		currentPage: 1,
		itemsPerPage: 12,
		totalItems: 0
	});

	useEffect(() => {
		const fetchResources = async () => {
			try {
				setLoading(true);
				const response = await axios.get(`${API_URL}/resource`, {
					params: {
						search: searchTerm,
						type: filters.type,
						subject: filters.subject,
						sort: sortConfig.key,
						order: sortConfig.direction,
						page: pagination.currentPage,
						limit: pagination.itemsPerPage
					}
				});
				setResources(response.data.resources);
				setPagination(prev => ({
					...prev,
					totalItems: response.data.totalCount
				}));
			} catch (error) {
				console.error('Error fetching resources:', error);
			} finally {
				setLoading(false);
			}
		};

		const debounceTimer = setTimeout(() => {
			fetchResources();
		}, 300);

		return () => clearTimeout(debounceTimer);
	}, [searchTerm, filters, sortConfig, pagination.currentPage]);

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
		setPagination(prev => ({ ...prev, currentPage: 1 }));
	};

	const handleFilterChange = (key, value) => {
		setFilters(prev => ({ ...prev, [key]: value }));
		setPagination(prev => ({ ...prev, currentPage: 1 }));
	};

	const handleSort = (key) => {
		let direction = 'asc';
		if (sortConfig.key === key && sortConfig.direction === 'asc') {
			direction = 'desc';
		}
		setSortConfig({ key, direction });
	};

	const getFileIcon = (type) => {
		if (type.includes('pdf')) return <FileText className="text-red-500" />;
		if (type.includes('video')) return <FileVideo className="text-blue-500" />;
		if (type.includes('audio')) return <FileAudio className="text-purple-500" />;
		if (type.includes('image')) return <FileImage className="text-green-500" />;
		if (type.includes('zip') || type.includes('rar')) return <FileArchive className="text-yellow-500" />;
		if (type.includes('code') || type.includes('programming')) return <FileCode className="text-indigo-500" />;
		return <File className="text-gray-500" />;
	};

	const getThumbnailUrl = (url) => {
		// Replace file extension with .png for thumbnail
		return url.replace(/\.[^/.]+$/, '.png');
	};

	const renderSortIcon = (key) => {
		if (sortConfig.key !== key) return <ArrowUpDown className="w-4 h-4 ml-1" />;
		return sortConfig.direction === 'asc' ? (
			<ArrowUpDown className="w-4 h-4 ml-1 transform rotate-180" />
		) : (
			<ArrowUpDown className="w-4 h-4 ml-1" />
		);
	};

	const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);

	if (loading && resources.length === 0) {
		return (
			<div className="flex items-center justify-center h-64">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	if (!loading && resources.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-64 text-gray-500">
				<File className="w-12 h-12 mb-4" />
				<p className="text-xl">No resources found</p>
				<p className="text-sm">Try adjusting your search or filters</p>
			</div>
		);
	}

	return (
		<>
			<NavBar />
			<div className="container mx-auto px-6 md:px-20 py-8">
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-6">Resources</h1>

					{/* Search and Filter Bar */}
					<div className="flex flex-col md:flex-row gap-4 mb-6">
						<div className="relative flex-grow">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<Search className="text-gray-400" />
							</div>
							<input
								type="text"
								placeholder="Search by title, subject, tags, or author..."
								className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								value={searchTerm}
								onChange={handleSearch}
							/>
						</div>

						<div className="flex gap-4">
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Filter className="text-gray-400" />
								</div>
								<select
									className="pl-10 pr-8 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									value={filters.type}
									onChange={(e) => handleFilterChange('type', e.target.value)}
								>
									<option value="">All Types</option>
									<option value="pdf">PDF</option>
									<option value="video">Video</option>
									<option value="audio">Audio</option>
									<option value="image">Image</option>
									<option value="code">Code</option>
									<option value="document">Document</option>
								</select>
							</div>

							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Filter className="text-gray-400" />
								</div>
								<select
									className="pl-10 pr-8 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									value={filters.subject}
									onChange={(e) => handleFilterChange('subject', e.target.value)}
								>
									<option value="">All Subjects</option>
									<option value="math">Math</option>
									<option value="science">Science</option>
									<option value="history">History</option>
									<option value="literature">Literature</option>
									<option value="programming">Programming</option>
									<option value="art">Art</option>
								</select>
							</div>
						</div>
					</div>

					{/* Sorting Controls */}
					<div className="flex flex-wrap gap-4 mb-6">
						<button
							className="flex items-center px-3 py-1 border rounded-lg hover:bg-gray-50"
							onClick={() => handleSort('title')}
						>
							Title {renderSortIcon('title')}
						</button>
						<button
							className="flex items-center px-3 py-1 border rounded-lg hover:bg-gray-50"
							onClick={() => handleSort('createdAt')}
						>
							Date Added {renderSortIcon('createdAt')}
						</button>
						<button
							className="flex items-center px-3 py-1 border rounded-lg hover:bg-gray-50"
							onClick={() => handleSort('views')}
						>
							Views {renderSortIcon('views')}
						</button>
					</div>
				</div>

				{/* Resource Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{resources.map((resource) => (
						<div key={resource._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
							<div className="relative h-48 bg-gray-100">
								<img
									src={getThumbnailUrl(resource.url)}
									alt={resource.title}
									className="w-full h-full object-cover"
									onError={(e) => {
										e.target.src = 'https://via.placeholder.com/300x200?text=No+Preview';
									}}
								/>
								<div className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-1">
									{getFileIcon(resource.type)}
								</div>
								<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
									<h3 className="text-white font-semibold truncate">{resource.title}</h3>
								</div>
							</div>

							<div className="p-4">
								<div className="flex justify-between items-start mb-2">
									<span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
										{resource.subject}
									</span>
									<span className="text-gray-500 text-sm flex items-center">
										<User className="w-4 h-4 mr-1" />
										{resource.author?.fullName || 'Unknown'}
									</span>
								</div>

								<p className="text-gray-600 text-sm mb-3 line-clamp-2">{resource.description}</p>

								<div className="flex flex-wrap gap-1 mb-3">
									{resource.tags?.slice(0, 3).map((tag, index) => (
										<span key={index} className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
											{tag}
										</span>
									))}
									{resource.tags?.length > 3 && (
										<span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
											+{resource.tags.length - 3}
										</span>
									)}
								</div>

								<div className="flex justify-between items-center text-sm text-gray-500">
									<span>{new Date(resource.createdAt).toLocaleDateString()}</span>
									<span>{resource.views} views</span>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className="flex justify-center mt-8">
						<nav className="flex items-center gap-1">
							<button
								onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.max(1, prev.currentPage - 1) }))}
								disabled={pagination.currentPage === 1}
								className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>

							{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
								let pageNum;
								if (totalPages <= 5) {
									pageNum = i + 1;
								} else if (pagination.currentPage <= 3) {
									pageNum = i + 1;
								} else if (pagination.currentPage >= totalPages - 2) {
									pageNum = totalPages - 4 + i;
								} else {
									pageNum = pagination.currentPage - 2 + i;
								}

								return (
									<button
										key={pageNum}
										onClick={() => setPagination(prev => ({ ...prev, currentPage: pageNum }))}
										className={`w-10 h-10 rounded-lg border ${pagination.currentPage === pageNum ? 'bg-blue-500 text-white' : 'hover:bg-gray-50'}`}
									>
										{pageNum}
									</button>
								);
							})}

							<button
								onClick={() => setPagination(prev => ({ ...prev, currentPage: Math.min(totalPages, prev.currentPage + 1) }))}
								disabled={pagination.currentPage === totalPages}
								className="p-2 rounded-lg border disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
							>
								<ChevronRight className="w-5 h-5" />
							</button>
						</nav>
					</div>
				)}
			</div>
		</>
	);
};

export default ResourceList;