import { useState } from 'react';
import {
	Plus,
	User,
	Mail,
	Star,
	Calendar,
	Award,
	Users,
	Edit,
	Trash2,
	UserPlus,
	Code
} from 'lucide-react';
import AddWriter from './AddWriter';

const WritersHome = () => {
	const [writers, setWriters] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		fullName: '',
		email: '',
		profilePic: '',
		skills: [{ skill: '', experience: 0 }],
		familiarWith: [''],
		education: [{
			qualification: '',
			place: '',
			startYear: '',
			endYear: '',
			grade: ''
		}],
		bio: ''
	});

	const resetForm = () => {
		setFormData({
			fullName: '',
			email: '',
			profilePic: '',
			skills: [{ skill: '', experience: 0 }],
			familiarWith: [''],
			education: [{
				qualification: '',
				place: '',
				startYear: '',
				endYear: '',
				grade: ''
			}],
			bio: '',
		});
	};

	const handleSubmit = async () => {
		setLoading(true);

		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 2000));

		// Clean up empty strings from arrays
		const cleanedData = {
			...formData,
			familiarWith: formData.familiarWith.filter(item => item.trim() !== '')
		};

		const newWriter = {
			...cleanedData,
			id: Date.now(),
			createdAt: new Date().toISOString()
		};

		setWriters(prev => [...prev, newWriter]);
		setLoading(false);
		setShowModal(false);
		resetForm();
	};

	const deleteWriter = (id) => {
		setWriters(prev => prev.filter(writer => writer.id !== id));
	};

	const openModal = () => {
		setShowModal(true);
		resetForm();
	};

	const closeModal = () => {
		setShowModal(false);
		resetForm();
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-6">
					<div className="px-6 py-8 border-b border-gray-100">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
							<div className="flex items-center gap-4">
								<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
									<Users className="w-8 h-8 text-white" />
								</div>
								<div>
									<h1 className="text-3xl font-bold text-gray-900">Writer Management</h1>
									<p className="text-gray-600 mt-1">Manage your content writers and their profiles</p>
								</div>
							</div>
							<button
								onClick={openModal}
								className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
							>
								<UserPlus className="w-5 h-5" />
								Add Writer
							</button>
						</div>
					</div>

					{/* Writers Grid */}
					<div className="p-6">
						{writers.length === 0 ? (
							<div className="text-center py-16">
								<div className="bg-gray-100 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-6">
									<User className="w-16 h-16 text-gray-400" />
								</div>
								<h3 className="text-xl font-semibold text-gray-900 mb-2">No writers yet</h3>
								<p className="text-gray-600 mb-6 max-w-md mx-auto">
									Start building your writing team by adding your first writer. You can manage their profiles, skills, and assignments all in one place.
								</p>
								<button
									onClick={openModal}
									className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
								>
									<Plus className="w-5 h-5" />
									Add Your First Writer
								</button>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{writers.map((writer) => (
									<div key={writer.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
										<div className="flex items-start justify-between mb-4">
											<div className="flex items-center gap-4">
												<div className="relative">
													{writer.profilePic ? (
														<img
															src={writer.profilePic}
															alt={writer.fullName}
															className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
														/>
													) : (
														<div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
															<User className="w-8 h-8 text-white" />
														</div>
													)}
													<div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
												</div>
												<div>
													<h3 className="font-bold text-gray-900 text-lg">{writer.fullName}</h3>
													<p className="text-sm text-gray-600 flex items-center gap-1">
														<Mail className="w-3 h-3" />
														{writer.email}
													</p>
												</div>
											</div>
											<button
												onClick={() => deleteWriter(writer.id)}
												className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
											>
												<Trash2 className="w-4 h-4" />
											</button>
										</div>

										{writer.bio && (
											<div className="mb-4">
												<p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg line-clamp-3">{writer.bio}</p>
											</div>
										)}

										<div className="space-y-3 mb-4">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Star className="w-4 h-4 text-yellow-500" />
													<span className="text-sm font-medium">Rating</span>
												</div>
												<div className="flex items-center gap-1">
													{[...Array(5)].map((_, i) => (
														<Star
															key={i}
															className={`w-3 h-3 ${i < writer.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
														/>
													))}
													<span className="text-sm text-gray-600 ml-1">({writer.rating})</span>
												</div>
											</div>

											<div className="flex items-center justify-between">
												<div className="flex items-center gap-2">
													<Award className="w-4 h-4 text-green-500" />
													<span className="text-sm font-medium">Max Orders</span>
												</div>
												<span className="text-sm text-gray-600">{writer.maxOrders}</span>
											</div>

											{writer.availableOn && (
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<Calendar className="w-4 h-4 text-blue-500" />
														<span className="text-sm font-medium">Available</span>
													</div>
													<span className="text-sm text-gray-600">{new Date(writer.availableOn).toLocaleDateString()}</span>
												</div>
											)}
										</div>

										{writer.skills.length > 0 && (
											<div className="mb-4">
												<div className="flex items-center gap-2 mb-2">
													<Code className="w-4 h-4 text-purple-500" />
													<span className="text-sm font-medium text-gray-700">Skills</span>
												</div>
												<div className="flex flex-wrap gap-2">
													{writer.skills.slice(0, 3).map((skill, index) => (
														<span
															key={index}
															className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-xs px-3 py-1 rounded-full border border-blue-200"
														>
															{skill.skill} ({skill.experience}y)
														</span>
													))}
													{writer.skills.length > 3 && (
														<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
															+{writer.skills.length - 3} more
														</span>
													)}
												</div>
											</div>
										)}

										<div className="flex gap-2 pt-4 border-t border-gray-100">
											<button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
												View Profile
											</button>
											<button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium transition-colors">
												<Edit className="w-4 h-4" />
											</button>
										</div>
									</div>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Modal */}
			<AddWriter
				isOpen={showModal}
				onClose={() => setShowModal(false) || closeModal()}
				onSubmit={handleSubmit}
				writer={formData}
				setWriter={setFormData}
			/>
		</div>
	);
}

export default WritersHome;