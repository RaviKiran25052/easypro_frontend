import { useState, useEffect } from 'react';
import axios from 'axios';
import {
	X,
	File,
	FileText,
	FileArchive,
	FileImage,
	FileVideo,
	FileCode,
	BookOpen,
	Book,
	FileSearch,
	FileEdit,
	Plus,
	Tag,
	Upload
} from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const ResourceFormModal = ({ isOpen, onClose, resourceToEdit, onSuccess }) => {
	const [formData, setFormData] = useState({
		title: '',
		subject: '',
		description: '',
		type: 'thesis',
		tags: [],
		file: null
	});
	const [newTag, setNewTag] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState('');

	const resourceTypes = [
		{ value: 'thesis', label: 'Thesis', icon: <FileText className="w-4 h-4" /> },
		{ value: 'essay', label: 'Essay', icon: <FileEdit className="w-4 h-4" /> },
		{ value: 'study notes', label: 'Study Notes', icon: <BookOpen className="w-4 h-4" /> },
		{ value: 'research papers', label: 'Research Papers', icon: <FileSearch className="w-4 h-4" /> },
		{ value: 'exam papers', label: 'Exam Papers', icon: <File className="w-4 h-4" /> },
		{ value: 'guide', label: 'Guide', icon: <Book className="w-4 h-4" /> },
		{ value: 'journals', label: 'Journals', icon: <FileArchive className="w-4 h-4" /> }
	];

	useEffect(() => {
		if (resourceToEdit) {
			setFormData({
				title: resourceToEdit.title,
				subject: resourceToEdit.subject,
				description: resourceToEdit.description,
				type: resourceToEdit.type,
				tags: resourceToEdit.tags || [],
				file: null
			});
		} else {
			setFormData({
				title: '',
				subject: '',
				description: '',
				type: 'thesis',
				tags: [],
				file: null
			});
		}
	}, [resourceToEdit]);

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleFileChange = (e) => {
		setFormData(prev => ({ ...prev, file: e.target.files[0] }));
	};

	const handleAddTag = () => {
		if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
			setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
			setNewTag('');
		}
	};

	const handleRemoveTag = (tagToRemove) => {
		setFormData(prev => ({
			...prev,
			tags: prev.tags.filter(tag => tag !== tagToRemove)
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError('');

		try {
			const formPayload = new FormData();
			formPayload.append('title', formData.title);
			formPayload.append('subject', formData.subject);
			formPayload.append('description', formData.description);
			formPayload.append('type', formData.type);
			formPayload.append('tags', formData.tags.join(','));

			if (formData.file) {
				formPayload.append('file', formData.file);
			}

			if (resourceToEdit) {
				// Update existing resource
				const response = await axios.put(
					`${API_URL}/resource/${resourceToEdit._id}`,
					formPayload,
					{
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'multipart/form-data'
						}
					}
				);
				onSuccess(response.data.resource, 'updated');
			} else {
				// Create new resource
				formPayload.append('author', '686a682effea93f198a2c058'); // Replace with actual author ID
				const response = await axios.post(
					`${API_URL}/resource`,
					formPayload,
					{
						headers: {
							'Authorization': `Bearer ${localStorage.getItem('token')}`,
							'Content-Type': 'multipart/form-data'
						}
					}
				);
				onSuccess(response.data.resource, 'created');
			}

			onClose();
		} catch (err) {
			console.error('Error submitting resource:', err);
			setError(err.response?.data?.message || 'Failed to save resource. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
				<div className="flex justify-between items-center border-b p-4">
					<h2 className="text-xl font-semibold">
						{resourceToEdit ? 'Edit Resource' : 'Add New Resource'}
					</h2>
					<button onClick={onClose} className="text-gray-500 hover:text-gray-700">
						<X className="w-6 h-6" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-4 space-y-4">
					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
							{error}
						</div>
					)}

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">Title *</label>
							<input
								type="text"
								name="title"
								value={formData.title}
								onChange={handleInputChange}
								required
								className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">Subject *</label>
							<input
								type="text"
								name="subject"
								value={formData.subject}
								onChange={handleInputChange}
								required
								className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">Description *</label>
						<textarea
							name="description"
							value={formData.description}
							onChange={handleInputChange}
							required
							rows={3}
							className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">Type *</label>
							<select
								name="type"
								value={formData.type}
								onChange={handleInputChange}
								className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
							>
								{resourceTypes.map((type) => (
									<option key={type.value} value={type.value}>
										{type.label}
									</option>
								))}
							</select>
						</div>

						<div className="space-y-2">
							<label className="block text-sm font-medium text-gray-700">File *</label>
							<div className="flex items-center gap-2">
								<label className="flex-1 cursor-pointer">
									<div className="flex items-center gap-2 px-3 py-2 border rounded-md hover:bg-gray-50">
										<Upload className="w-5 h-5 text-gray-500" />
										<span className="truncate">
											{formData.file
												? formData.file.name
												: resourceToEdit?.url
													? 'Current file: ' + resourceToEdit.url.split('/').pop()
													: 'Choose file...'}
										</span>
									</div>
									<input
										type="file"
										onChange={handleFileChange}
										className="hidden"
										required={!resourceToEdit}
									/>
								</label>
								{resourceToEdit?.url && (
									<a
										href={resourceToEdit.url}
										target="_blank"
										rel="noopener noreferrer"
										className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center gap-1"
									>
										<File className="w-4 h-4" />
										<span>View</span>
									</a>
								)}
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<label className="block text-sm font-medium text-gray-700">Tags</label>
						<div className="flex flex-wrap gap-2 mb-2">
							{formData.tags.map((tag) => (
								<span
									key={tag}
									className="inline-flex items-center px-2 py-1 bg-gray-100 rounded-full text-sm"
								>
									{tag}
									<button
										type="button"
										onClick={() => handleRemoveTag(tag)}
										className="ml-1 text-gray-500 hover:text-gray-700"
									>
										<X className="w-3 h-3" />
									</button>
								</span>
							))}
						</div>
						<div className="flex gap-2">
							<input
								type="text"
								value={newTag}
								onChange={(e) => setNewTag(e.target.value)}
								placeholder="Add tag"
								className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="button"
								onClick={handleAddTag}
								disabled={!newTag.trim()}
								className="px-3 py-2 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 flex items-center gap-1"
							>
								<Plus className="w-4 h-4" />
								<span>Add</span>
							</button>
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t">
						<button
							type="button"
							onClick={onClose}
							disabled={isSubmitting}
							className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
						>
							{isSubmitting ? (
								<>
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									{resourceToEdit ? 'Updating...' : 'Creating...'}
								</>
							) : (
								<>
									{resourceToEdit ? (
										<>
											<FileEdit className="w-4 h-4" />
											<span>Update Resource</span>
										</>
									) : (
										<>
											<Plus className="w-4 h-4" />
											<span>Create Resource</span>
										</>
									)}
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ResourceFormModal;