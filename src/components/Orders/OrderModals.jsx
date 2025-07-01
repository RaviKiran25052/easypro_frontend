import React, { useState } from 'react';
import { Star, Plus, Trash2 } from 'lucide-react';

const OrderModals = ({
	modalState,
	setModalState,
	selectedOrder,
	setSelectedOrder,
	newDeadline,
	setNewDeadline,
	reviewData,
	setReviewData,
	handleCancelOrder,
	handleSubmitReview,
	handleRepeatOrder,
	handleRevokeOrder
}) => {
	const [cancelReason, setCancelReason] = useState('');
	const [newCustomFieldName, setNewCustomFieldName] = useState('');

	const handleRatingChange = (field, value) => {
		setReviewData({
			...reviewData,
			[field]: value
		});
	};

	const handleReviewDescriptionChange = (e) => {
		setReviewData({
			...reviewData,
			description: e.target.value
		});
	};

	const addCustomField = () => {
		if (newCustomFieldName.trim()) {
			setReviewData({
				...reviewData,
				other: [
					...(reviewData.other || []),
					{
						name: newCustomFieldName,
						rating: 0
					}
				]
			});
			setNewCustomFieldName('');
		}
	};

	const updateCustomFieldRating = (index, rating) => {
		const updatedOther = [...reviewData.other];
		updatedOther[index].rating = rating;
		setReviewData({
			...reviewData,
			other: updatedOther
		});
	};

	const removeCustomField = (index) => {
		const updatedOther = [...reviewData.other];
		updatedOther.splice(index, 1);
		setReviewData({
			...reviewData,
			other: updatedOther
		});
	};

	const handleCancelWithReason = () => {
		const payload = {
			status: { state: 'cancelled' },
			...(cancelReason && { cancellationReason: cancelReason })
		};
		handleCancelOrder(payload);
	};

	// Check if all ratings are filled
	const isReviewValid = () => {
		const mainRatingsValid = ['followingInstructions', 'grammar', 'responseSpeed', 'formatting'].every(
			field => reviewData[field] > 0
		);

		const customRatingsValid = (reviewData.other || []).every(
			field => field.rating > 0
		);

		return mainRatingsValid && customRatingsValid;
	};

	return (
		<>
			{/* Cancel Confirmation Modal */}
			{modalState.showConfirmCancel && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Cancel Order</h3>
						<p className="text-gray-600 mb-2">
							Are you sure you want to cancel this order? This action cannot be undone.
						</p>
						<div className="mb-4">
							<label className="text-sm font-medium text-gray-700 mb-2 block">Reason for Cancellation</label>
							<textarea
								value={cancelReason}
								onChange={(e) => setCancelReason(e.target.value)}
								rows={3}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Optional: Please provide a reason for cancellation..."
							/>
						</div>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => {
									setModalState({ ...modalState, showConfirmCancel: false });
									setSelectedOrder(null);
									setCancelReason('');
								}}
								className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								No, Keep Order
							</button>
							<button
								onClick={handleCancelWithReason}
								className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
							>
								Yes, Cancel Order
							</button>
						</div>
					</div>
				</div>
			)}

			{/* View Writer Modal */}
			{modalState.showViewWriter && selectedOrder && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Writer Information</h3>
						<div className="space-y-3">
							<div>
								<label className="text-sm font-medium text-gray-700">Name</label>
								<p className="text-gray-900">{selectedOrder.writer?.fullName || 'Not available'}</p>
							</div>
							<div>
								<label className="text-sm font-medium text-gray-700">Email</label>
								<p className="text-gray-900">{selectedOrder.writer?.email || 'Not available'}</p>
							</div>
						</div>
						<div className="flex justify-end mt-6">
							<button
								onClick={() => {
									setModalState({ ...modalState, showViewWriter: false });
									setSelectedOrder(null);
								}}
								className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
							>
								Close
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Review Modal */}
			{modalState.showReview && selectedOrder && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-6">
						<h3 className="text-xl font-semibold text-gray-800 mb-6 border-b py-6 px-6">
							{selectedOrder.review ? 'Review Details' : 'Leave a Review'}
						</h3>

						<div className='max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pl-6'>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								{['followingInstructions', 'grammar', 'responseSpeed', 'formatting'].map((field) => (
									<div key={field}>
										<p className="text-sm font-medium text-gray-700 mb-1 capitalize">
											{field.replace(/([A-Z])/g, ' $1')}
										</p>
										<div className="flex gap-1">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`w-6 h-6 transition ${star <= reviewData[field] ? 'text-yellow-400' : 'text-gray-300'
														} ${selectedOrder.review ? '' : 'hover:scale-110 cursor-pointer'}`}
													fill={star <= reviewData[field] ? 'currentColor' : 'none'}
													onClick={
														selectedOrder.review ? undefined : () => handleRatingChange(field, star)
													}
												/>
											))}
										</div>
									</div>
								))}

							</div>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6 border-t mt-4'>
								{(reviewData.other || []).map((field, index) => (
									<div key={index} className="pt-4">
										<div className="flex justify-between items-center mb-2">
											<p className="text-sm font-medium text-gray-700">{field.name}</p>
											{!selectedOrder.review && (
												<button
													onClick={() => removeCustomField(index)}
													className="text-red-500 hover:text-red-700"
													title="Remove field"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											)}
										</div>
										<div className="flex gap-1">
											{[1, 2, 3, 4, 5].map((star) => (
												<Star
													key={star}
													className={`w-6 h-6 transition ${star <= field.rating ? 'text-yellow-400' : 'text-gray-300'
														} ${selectedOrder.review ? '' : 'hover:scale-110 cursor-pointer'}`}
													fill={star <= field.rating ? 'currentColor' : 'none'}
													onClick={
														selectedOrder.review
															? undefined
															: () => updateCustomFieldRating(index, star)
													}
												/>
											))}
										</div>
									</div>
								))}

								{/* Add Custom Field */}
								{!selectedOrder.review && (
									<div className="flex gap-2 mt-4">
										<input
											type="text"
											value={newCustomFieldName}
											onChange={(e) => setNewCustomFieldName(e.target.value)}
											placeholder="Custom rating field"
											className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
										/>
										<button
											onClick={addCustomField}
											disabled={!newCustomFieldName.trim()}
											className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center gap-1"
										>
											<Plus className="w-4 h-4" />
											Add
										</button>
									</div>
								)}
							</div>
							{/* Description */}
							<div className="mt-4">
								<p className="text-sm font-medium text-gray-700 mb-1">Description</p>
								{selectedOrder.review ? (
									<p className="bg-gray-100 text-gray-800 p-3 rounded-md whitespace-pre-wrap shadow-sm">
										{reviewData.description}
									</p>
								) : (
									<textarea
										value={reviewData.description}
										onChange={handleReviewDescriptionChange}
										rows={4}
										className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
										placeholder="Share your experience..."
									/>
								)}
							</div>
						</div>

						{/* Buttons */}
						<div className="flex justify-end gap-3 mt-6 border-t p-6">
							<button
								onClick={() => {
									setModalState({ ...modalState, showReview: false });
									setSelectedOrder(null);
									setReviewData({
										followingInstructions: 0,
										grammar: 0,
										responseSpeed: 0,
										formatting: 0,
										other: [],
										description: '',
										writer: selectedOrder.writer?._id,
										order: selectedOrder._id
									});
								}}
								className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
							>
								Close
							</button>
							{!selectedOrder.review && (
								<button
									onClick={handleSubmitReview}
									disabled={!isReviewValid()}
									className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
								>
									Submit
								</button>
							)}
						</div>
					</div>
				</div>
			)}

			{/* Repeat Order Modal */}
			{modalState.showRepeatOrder && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Repeat Order</h3>
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 block">New Deadline</label>
								<input
									type="datetime-local"
									value={newDeadline}
									onChange={(e) => setNewDeadline(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>
						<div className="flex gap-3 justify-end mt-6">
							<button
								onClick={() => {
									setModalState({ ...modalState, showRepeatOrder: false });
									setSelectedOrder(null);
									setNewDeadline('');
								}}
								className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								onClick={handleRepeatOrder}
								disabled={!newDeadline}
								className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Repeat Order
							</button>
						</div>
					</div>
				</div>
			)}

			{/* Revoke Order Modal */}
			{modalState.showRevokeOrder && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
						<h3 className="text-lg font-semibold text-gray-900 mb-4">Revoke Order</h3>
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium text-gray-700 mb-2 block">New Deadline</label>
								<input
									type="datetime-local"
									value={newDeadline}
									onChange={(e) => setNewDeadline(e.target.value)}
									className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								/>
							</div>
						</div>
						<div className="flex gap-3 justify-end mt-6">
							<button
								onClick={() => {
									setModalState({ ...modalState, showRevokeOrder: false });
									setSelectedOrder(null);
									setNewDeadline('');
								}}
								className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
							>
								Cancel
							</button>
							<button
								onClick={handleRevokeOrder}
								disabled={!newDeadline}
								className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								Revoke Order
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default OrderModals;