import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
	Eye,
	X,
	Star,
	RotateCcw,
	RefreshCw,
	Calendar,
	User,
	FileText,
	Clock,
	CheckCircle,
	AlertCircle,
	XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderModals from './OrderModals';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const OrdersTable = () => {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [pagination, setPagination] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const navigate = useNavigate();
	const limit = 10;

	// Modal states
	const [modalState, setModalState] = useState({
		showConfirmCancel: false,
		showViewWriter: false,
		showReview: false,
		showRepeatOrder: false,
		showRevokeOrder: false
	});

	// Selected order for actions
	const [selectedOrder, setSelectedOrder] = useState(null);

	// Form states
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
	const [newDeadline, setNewDeadline] = useState('');

	useEffect(() => {
		fetchOrders();
	}, [currentPage]);

	const fetchOrders = async () => {
		try {
			setLoading(true);
			const response = await axios.get(`${API_URL}/order?page=${currentPage}&limit=${limit}`, {
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
				}
			});

			if (response.data.success) {
				setOrders(response.data.data.orders);
				setPagination(response.data.data.pagination);
			}
		} catch (err) {
			setError('Failed to fetch orders');
			console.error('Error fetching orders:', err);
		} finally {
			setLoading(false);
		}
	};

	const getStatusIcon = (status) => {
		switch (status) {
			case 'unassigned':
				return <AlertCircle className="w-4 h-4 text-yellow-500" />;
			case 'assigned':
			case 'pending':
				return <Clock className="w-4 h-4 text-blue-500" />;
			case 'completed':
				return <CheckCircle className="w-4 h-4 text-green-500" />;
			case 'cancelled':
				return <XCircle className="w-4 h-4 text-red-500" />;
			default:
				return <AlertCircle className="w-4 h-4 text-gray-500" />;
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case 'unassigned':
				return 'bg-yellow-100 text-yellow-800';
			case 'assigned':
			case 'pending':
				return 'bg-blue-100 text-blue-800';
			case 'completed':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const formatDate = (date) => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	const handleCancelOrder = async () => {
		try {
			const response = await axios.patch(
				`${API_URL}/order/${selectedOrder._id}`,
				{ status: { state: 'cancelled' } },
				{
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`,
						'Content-Type': 'multipart/form-data'
					}
				}
			);

			if (response.data.success) {
				setModalState({ ...modalState, showConfirmCancel: false });
				setSelectedOrder(null);
				fetchOrders();
			}
		} catch (err) {
			console.error('Error cancelling order:', err);
		}
	};

	const handleSubmitReview = async () => {
		try {
			const reviewPayload = {
				...reviewData,
				writer: selectedOrder.writer?._id,
				order: selectedOrder._id
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
				setModalState({ ...modalState, showReview: false });
				setSelectedOrder(null);
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
				fetchOrders();
			}
		} catch (err) {
			console.error('Error submitting review:', err);
		}
	};

	const handleRepeatOrder = async () => {
		try {
			const response = await axios.patch(
				`${API_URL}/order/${selectedOrder._id}`,
				{ deadline: newDeadline },
				{
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				}
			);

			if (response.data.success) {
				setModalState({ ...modalState, showRepeatOrder: false });
				setSelectedOrder(null);
				setNewDeadline('');
				fetchOrders();
			}
		} catch (err) {
			console.error('Error repeating order:', err);
		}
	};

	const handleRevokeOrder = async () => {
		try {
			const response = await axios.patch(
				`${API_URL}/order/${selectedOrder._id}`,
				{ status: { state: 'unassigned' }, deadline: newDeadline },
				{
					headers: {
						'Authorization': `Bearer ${localStorage.getItem('token')}`
					}
				}
			);

			if (response.data.success) {
				setModalState({ ...modalState, showRevokeOrder: false });
				setSelectedOrder(null);
				setNewDeadline('');
				fetchOrders();
			}
		} catch (err) {
			console.error('Error revoking order:', err);
		}
	};

	const renderActions = (order) => {
		const status = order.status.state;

		switch (status) {
			case 'unassigned':
				return (
					<button
						onClick={() => {
							setSelectedOrder(order);
							setModalState({ ...modalState, showConfirmCancel: true });
						}}
						className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
					>
						<X className="w-4 h-4" />
						Cancel
					</button>
				);
			case 'assigned':
			case 'pending':
				return (
					<div className="flex gap-2">
						<button
							onClick={() => {
								setSelectedOrder(order);
								setModalState({ ...modalState, showViewWriter: true });
							}}
							className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
						>
							<Eye className="w-4 h-4" />
							View Writer
						</button>
						<button
							onClick={() => {
								setSelectedOrder(order);
								setModalState({ ...modalState, showConfirmCancel: true });
							}}
							className="flex items-center gap-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
						>
							<X className="w-4 h-4" />
							Cancel
						</button>
					</div>
				);
			case 'completed':
				return (order.review ?
					<button
						onClick={() => {
							setSelectedOrder(order);
							setModalState({ ...modalState, showReview: true });
							setReviewData(order?.review);
						}}
						className="flex items-center gap-1 px-3 py-1 text-yellow-600 hover:bg-yellow-50 rounded-md transition-colors"
					>
						View Review
					</button>
					:
					<button
						onClick={() => {
							setSelectedOrder(order);
							setModalState({ ...modalState, showReview: true });
						}}
						className="flex items-center gap-1 px-3 py-1 text-green-600 hover:bg-green-50 rounded-md transition-colors"
					>
						<Star className="w-4 h-4" />
						Leave Review
					</button>
				);
			case 'cancelled':
				return (
					<button
						onClick={() => {
							setSelectedOrder(order);
							setModalState({ ...modalState, showRepeatOrder: true });
						}}
						className="flex items-center gap-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
					>
						<RotateCcw className="w-4 h-4" />
						Repeat Order
					</button>
				);
			default:
				return (
					<button
						onClick={() => {
							setSelectedOrder(order);
							setModalState({ ...modalState, showRevokeOrder: true });
						}}
						className="flex items-center gap-1 px-3 py-1 text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
					>
						<RefreshCw className="w-4 h-4" />
						Revoke Order
					</button>
				);
		}
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-64">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="text-center py-8">
				<p className="text-red-600">{error}</p>
				<button
					onClick={fetchOrders}
					className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<div className="w-full max-w-7xl mx-auto p-4">
			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<div className="px-6 py-4 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-900">My Orders</h2>
				</div>

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50">
							<tr>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Order Details
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Status
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Deadline
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Writer
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="bg-white divide-y divide-gray-200">
							{orders.map((order) => (
								<tr key={order._id} className="hover:bg-gray-50">
									<td className="px-6 py-4 cursor-pointer"
										onClick={() => navigate(`/order/${order._id}`)}>
										<div className="flex items-start gap-3">
											<FileText className="w-5 h-5 text-gray-400 mt-0.5" />
											<div>
												<p className="text-sm font-medium text-gray-900 hover:underline">{order.subject}</p>
												<p className="text-sm text-gray-500">{order.type} • {order.paperType}</p>
												{order.pageCount && (
													<p className="text-xs text-gray-400">{order.pageCount} pages</p>
												)}
											</div>
										</div>
									</td>
									<td className="px-6 py-4">
										<span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status.state)}`}>
											{getStatusIcon(order.status.state)}
											{order.status.state}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center gap-1 text-sm text-gray-900">
											<Calendar className="w-4 h-4 text-gray-400" />
											{formatDate(order.deadline)}
										</div>
									</td>
									<td className="px-6 py-4">
										{order.writer ? (
											<div className="flex items-center gap-1 text-sm text-gray-900">
												<User className="w-4 h-4 text-gray-400" />
												{order.writer.fullName}
											</div>
										) : (
											<span className="text-sm text-gray-400">Not assigned</span>
										)}
									</td>
									<td className="px-6 py-4">
										{renderActions(order)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>

				{pagination.totalPages > 1 && (
					<div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
						<div className="text-sm text-gray-700">
							Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * 10, pagination.totalOrders)} of {pagination.totalOrders} orders
						</div>
						<div className="flex gap-2">
							<button
								onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
								disabled={!pagination.hasPrev}
								className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Previous
							</button>
							<button
								onClick={() => setCurrentPage(prev => prev + 1)}
								disabled={!pagination.hasNext}
								className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Next
							</button>
						</div>
					</div>
				)}
			</div>

			<OrderModals
				modalState={modalState}
				setModalState={setModalState}
				selectedOrder={selectedOrder}
				setSelectedOrder={setSelectedOrder}
				newDeadline={newDeadline}
				setNewDeadline={setNewDeadline}
				reviewData={reviewData}
				setReviewData={setReviewData}
				handleCancelOrder={handleCancelOrder}
				handleSubmitReview={handleSubmitReview}
				handleRepeatOrder={handleRepeatOrder}
				handleRevokeOrder={handleRevokeOrder}
			/>
		</div>
	);
};

export default OrdersTable;