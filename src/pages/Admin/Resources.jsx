import { useState } from 'react';
import ResourceFormModal from '../../components/Admin/Resource/ResourceFormModal';
import NavBar from '../../components/Admin/NavBar';

const Resources = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [editingResource, setEditingResource] = useState(null);

	const handleSuccess = (resource, action) => {
		console.log(`Resource ${action} successfully:`, resource);
		// Refresh your resources list or update state here
	};

	return (
		<div>
			<NavBar/>
			<button
				onClick={() => {
					setEditingResource(null);
					setIsModalOpen(true);
				}}
				className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
			>
				Add New Resource
			</button>

			{/* When editing, you would do: */}
			<button onClick={() => {
				// setEditingResource(resourceToEdit);
				setIsModalOpen(true);
			}}>
				Edit
			</button>

			<ResourceFormModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				resourceToEdit={editingResource}
				onSuccess={handleSuccess}
			/>
		</div>
	);
};

export default Resources