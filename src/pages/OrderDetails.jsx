import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
	Calendar,
	FileText,
	Edit,
	User,
	XCircle,
	Clock,
	Star,
	Mail,
	Eye
} from 'lucide-react';
import ReviewModal from '../components/Orders/ReviewModal';
import ReasonModal from '../components/Orders/ReasonModal';
import EditOrderModal from '../components/Orders/EditOrderModal';
import { toast } from 'react-toastify';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OrderDetails = () => {
	const { id } = useParams();
	const [order, setOrder] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [showReasonModal, setShowReasonModal] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [reviewData, setReviewData] = useState({
		followingInstructions: 0,
		grammar: 0,
		responseSpeed: 0,
		formatting: 0,
		other: 0,
		description: '',
		writer: '',
		order: ''
	});

	const fetchOrder = async () => {
		try {
			const response = await axios.get(`${API_URL}/order/${id}`, {
				headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
			});
			setOrder(response.data.data);
		} catch (err) {
			setError('Failed to fetch order details');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchOrder();
	}, [id]);

	const handleOrderUpdate = (updatedOrder) => {
		setOrder(updatedOrder);
	};

	if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
	if (error) return <div className="text-red-500 text-center mt-10">{error}</div>;
	if (!order) return <div className="text-center mt-10">Order not found</div>;

	const formatDate = (dateString) => {
		const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
		return new Date(dateString).toLocaleDateString(undefined, options);
	};

	const renderStatus = () => {
		switch (order.status.state) {
			case 'assigned':
			case 'pending':
			case 'completed':
				return (
					<div className="mt-6">
						<h3 className="text-lg font-semibold mb-2">Writer Details</h3>
						<div className="flex flex-col md:flex-row justify-between md:items-center items-start gap-3">
							<div className="flex items-center gap-3">
								<div className="relative flex-shrink-0">
									<img
										src={order.writer?.profilePic}
										alt={order.writer?.fullName}
										className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
									/>
									{order.writer?.ordersLeft === 0 ? (
										<div className="absolute -bottom-0.5 right-0 bg-red-500 w-4 h-4 rounded-full border-2 border-white"></div>
									) : !order.writer.availableOn || new Date(order.writer.availableOn) > new Date() ? (
										<div className="absolute -bottom-0.5 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
									) : null}
								</div>
								<div>
									<div className="font-medium text-gray-900">{order.writer?.fullName}</div>
									<div className="text-sm text-gray-600 flex items-center gap-1">
										<Mail className="w-3 h-3" />
										{order.writer?.email}
									</div>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<h4 className="font-semibold">Skills</h4>
								<div className="flex flex-wrap gap-1 text-gray-500">
									{order.writer?.skills &&
										order.writer.skills?.slice(0, 3).map((skill, index) => (
											<span
												key={index}
												className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
											>
												{skill.skill}
											</span>
										))}
									{order.writer.skills.length > 3 && (
										<span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
											+{order.writer.skills.length - 3}
										</span>
									)}
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex items-center gap-1 mt-1">
									{[...Array(5)].map((_, i) => (
										<Star
											key={i}
											className={`w-4 h-4 ${i < order.writer.rating?.avgRating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`}
										/>
									))}
									<span className="text-xs text-gray-500 ml-1">({order.writer?.rating?.count || 0})</span>
								</div>
								{order.review ?
									<button
										onClick={() => {
											setShowReviewModal(true)
											setReviewData(order?.review);
										}}
										className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 hover:border-amber-300 transition-all duration-200 shadow-sm hover:shadow-md"
									>
										<Eye className="w-4 h-4" />
										View Review
									</button>
									:
									<button
										onClick={() => setShowReviewModal(true)}
										className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md"
									>
										<Star className="w-4 h-4" />
										Leave Review
									</button>
								}
							</div>
						</div>
					</div>
				);
			case 'unassigned':
				return (
					<div className="flex items-center text-gray-600">
						<User className="mr-2" size={20} />
						Writer to be assigned
					</div>
				);
			case 'cancelled':
				return (
					<div className="flex items-center text-red-600">
						<XCircle className="mr-2" size={20} />
						Cancelled
						<button
							onClick={() => setShowReasonModal(true)}
							className="ml-4 px-3 py-1 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
						>
							View Reason
						</button>
					</div>
				);
			case 'expired':
				return (
					<div className="flex items-center text-orange-600">
						<Clock className="mr-2" size={20} />
						Expired on {formatDate(order.deadline)}
					</div>
				);
			default:
				return null;
		}
	};

	const renderOrderTypeSpecificDetails = () => {

		switch (order.type) {
			case 'writing':
				return (
					<div className="mt-6">
						<h3 className="text-lg font-semibold mb-2">Writing Details</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="bg-gray-50 p-4 rounded-md">
								<p className="text-gray-600">Paper Type</p>
								<p className="font-medium">{order.paperType || 'Not specified'}</p>
							</div>
							<div className="bg-gray-50 p-4 rounded-md">
								<p className="text-gray-600">Page Count</p>
								<p className="font-medium">{order.pageCount}</p>
							</div>
							{order.slides && (
								<div className="bg-gray-50 p-4 rounded-md">
									<p className="text-gray-600">Slides Count</p>
									<p className="font-medium">{order.slides}</p>
								</div>
							)}
						</div>
					</div>
				);
			case 'editing':
				return (
					<div className="mt-6">
						<h3 className="text-lg font-semibold mb-2">Editing Details</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="bg-gray-50 p-4 rounded-md">
								<p className="text-gray-600">Page Count</p>
								<p className="font-medium">{order.pageCount}</p>
							</div>
						</div>
					</div>
				);
			case 'technical':
				return (
					<div className="mt-6">
						<h3 className="text-lg font-semibold mb-2">Technical Details</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{order.software && (
								<div className="bg-gray-50 p-4 rounded-md">
									<p className="text-gray-600">Software</p>
									<p className="font-medium">{order.software}</p>
								</div>
							)}
						</div>
					</div>
				);
			default:
				return null;
		}
	};

	const handleSubmitReview = async () => {
		try {
			const reviewPayload = {
				...reviewData,
				writer: order.writer?._id,
				order: order._id
			};

			const response = await axios.post(
				`${API_URL}/review`,
				reviewPayload,
				{
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				}
			);

			if (response.data.success) {
				toast.success("Review Submitted")
				setShowReviewModal(false)
				setReviewData({
					followingInstructions: 0,
					grammar: 0,
					responseSpeed: 0,
					formatting: 0,
					other: 0,
					description: '',
					writer: '',
					order: ''
				});
			}
		} catch (err) {
			toast.error(err.response?.data?.message || 'Failed to submit review')
			console.error('Error submitting review:', err);
		}
	};

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex justify-between items-start mb-6">
					<div>
						<h1 className="text-2xl font-bold text-gray-800">
							{order.type.charAt(0).toUpperCase() + order.type.slice(1)} Order
						</h1>
						<p className="text-gray-600">Order ID: {order._id}</p>
					</div>
					<div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
						{order.status.state.charAt(0).toUpperCase() + order.status.state.slice(1)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-gray-50 p-4 rounded-md">
						<p className="text-gray-600">Subject</p>
						<p className="font-medium text-lg">{order.subject}</p>
					</div>
					<div className="bg-gray-50 p-4 rounded-md">
						<p className="text-gray-600">Deadline</p>
						<div className="flex items-center">
							<Calendar className="mr-2" size={18} />
							<p className="font-medium">{formatDate(order.deadline)}</p>
						</div>
					</div>
				</div>

				{order.instruction && (
					<div className="mt-6 bg-gray-50 p-4 rounded-md">
						<p className="text-gray-600">Instructions</p>
						<p className="font-medium mt-1 whitespace-pre-line">{order.instruction}</p>
					</div>
				)}

				{renderOrderTypeSpecificDetails()}

				{order.files && order.files.length > 0 && (
					<div className="mt-6">
						<h3 className="text-lg font-semibold mb-2">Attached Files</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
							{order.files.map((file, index) => (
								<a
									key={index}
									href={file}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center p-3 border rounded-md hover:bg-gray-50"
								>
									<FileText className="mr-2" size={18} />
									<span className="truncate">File {index + 1}</span>
								</a>
							))}
						</div>
					</div>
				)}

				{renderStatus()}

				{(order.type === 'writing' || order.type === 'editing') &&
					order.status.state === 'unassigned' && (
						<div className="mt-6">
							<button
								onClick={() => setShowEditModal(true)}
								className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
							>
								<Edit className="mr-2" size={18} />
								Edit Order
							</button>
						</div>
					)}

				{order.responses && order.responses.length > 0 && (
					<div className="mt-8">
						<h2 className="text-xl font-bold mb-4">Order Responses</h2>
						<div className="space-y-4">
							{order.responses.map((response, index) => (
								<div key={index} className="border rounded-md p-4">
									<div className="flex justify-between items-center mb-2">
										<h3 className="font-medium">{response.title || `Response ${index + 1}`}</h3>
										<span className="text-sm text-gray-500">
											{formatDate(response.createdAt)}
										</span>
									</div>
									<a
										href={response.url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center text-blue-600 hover:underline"
									>
										<FileText className="mr-1" size={16} />
										Download File
									</a>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			<ReviewModal
				isOpen={showReviewModal}
				order={order}
				reviewData={reviewData}
				setReviewData={setReviewData}
				handleSubmitReview={handleSubmitReview}
				onClose={() => setShowReviewModal(false)}
			/>

			{showReasonModal && (
				<ReasonModal
					reason={order.status.reason}
					onClose={() => setShowReasonModal(false)}
				/>
			)}

			{showEditModal && (
				<EditOrderModal
					order={order}
					onClose={() => setShowEditModal(false)}
					onSave={handleOrderUpdate}
				/>
			)}
		</div>
	);
};

export default OrderDetails;