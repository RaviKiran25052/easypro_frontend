import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, PenTool, Edit3, Code, Upload, Presentation, Star, Plus, Minus } from 'lucide-react';

const getDaysRemaining = (deadline) => {
	if (!deadline) return 0;
	const deadlineDate = new Date(deadline);
	const today = new Date();
	const diffTime = deadlineDate - today;
	return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Main Order Flow Component
const OrderFlow = () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [orderData, setOrderData] = useState({
		type: '',
		paperType: '',
		subject: '',
		otherSubject: '',
		otherPaperType: '',
		otherSoftware: '',
		instructions: '',
		files: [],
		pageCount: 1,
		slides: 0,
		showSlides: false,
		deadline: '',
		software: 'Not applicable',
		showSoftware: false,
		selectedWriter: null,
		availableWriters: []
	});

	const updateOrderData = (newData) => {
		setOrderData(prev => ({ ...prev, ...newData }));
	};

	const nextStep = () => {
		if (currentStep < 3) {
			setCurrentStep(prev => prev + 1);
		}
	};

	const prevStep = () => {
		if (currentStep > 0) {
			setCurrentStep(prev => prev - 1);
		}
	};

	const getDefaultDeadline = (days = 10) => {
		const date = new Date();
		date.setDate(date.getDate() + days);
		return date.toISOString().slice(0, 16);
	};

	const setQuickDeadline = (days) => {
		updateOrderData({ deadline: getDefaultDeadline(days) });
	};

	const fetchWriters = async (subject, deadline) => {
		// In a real app, you would fetch writers from an API based on subject and deadline
		// This is a mock implementation
		const mockWriters = [
			{
				id: 1,
				name: "Dr. Sarah Chen",
				rating: 4.9,
				completedOrders: 287,
				expertise: ["Python", "Data Analysis", "Machine Learning"],
				price: 45,
				avatar: "SC"
			},
			{
				id: 2,
				name: "Prof. Michael Rodriguez",
				rating: 4.8,
				completedOrders: 156,
				expertise: ["MATLAB", "Engineering", "Statistics"],
				price: 50,
				avatar: "MR"
			},
			{
				id: 3,
				name: "Dr. Emily Watson",
				rating: 4.9,
				completedOrders: 203,
				expertise: ["R", "Statistics", "Data Visualization"],
				price: 42,
				avatar: "EW"
			},
			{
				id: 4,
				name: "James Thompson",
				rating: 4.7,
				completedOrders: 134,
				expertise: ["SQL", "Database Design", "Business Analytics"],
				price: 38,
				avatar: "JT"
			}
		];

		// Filter writers based on subject (mock filtering)
		const filteredWriters = mockWriters.filter(writer =>
			writer.expertise.some(skill =>
				skill.toLowerCase().includes(subject.toLowerCase()) ||
				subject.toLowerCase().includes(skill.toLowerCase())
			)
		);

		updateOrderData({ availableWriters: filteredWriters });
	};

	useEffect(() => {
		if (orderData.type === 'technical' && currentStep === 2 && orderData.deadline && orderData.subject) {
			fetchWriters(orderData.subject, orderData.deadline);
		}
	}, [orderData.type, currentStep, orderData.deadline, orderData.subject]);

	const getCurrentStepComponent = () => {
		if (currentStep === 0) {
			return <OrderTypeSelection updateOrderData={updateOrderData} onNext={nextStep} />;
		}

		switch (orderData.type) {
			case 'writing':
				if (currentStep === 1) return <WritingStep1 orderData={orderData} updateOrderData={updateOrderData} onNext={nextStep} onPrev={prevStep} />;
				if (currentStep === 2) return <WritingStep2 orderData={orderData} updateOrderData={updateOrderData} onNext={nextStep} onPrev={prevStep} />;
				if (currentStep === 3) return <WritingStep3 orderData={orderData} updateOrderData={updateOrderData} onPrev={prevStep} getDefaultDeadline={getDefaultDeadline} setQuickDeadline={setQuickDeadline} getDaysRemaining={getDaysRemaining} />;
				break;
			case 'editing':
				if (currentStep === 1) return <EditingStep1 orderData={orderData} updateOrderData={updateOrderData} onNext={nextStep} onPrev={prevStep} />;
				if (currentStep === 2) return <EditingStep2 orderData={orderData} updateOrderData={updateOrderData} onNext={nextStep} onPrev={prevStep} getDefaultDeadline={getDefaultDeadline} setQuickDeadline={setQuickDeadline} getDaysRemaining={getDaysRemaining} />;
				break;
			case 'technical':
				if (currentStep === 1) return <TechnicalStep1 orderData={orderData} updateOrderData={updateOrderData} onNext={nextStep} onPrev={prevStep} />;
				if (currentStep === 2) return <TechnicalStep2 orderData={orderData} updateOrderData={updateOrderData} onNext={nextStep} onPrev={prevStep} getDefaultDeadline={getDefaultDeadline} setQuickDeadline={setQuickDeadline} getDaysRemaining={getDaysRemaining} />;
				if (currentStep === 3) return <TechnicalStep3 orderData={orderData} updateOrderData={updateOrderData} onPrev={prevStep} />;
				break;
		}
		return <OrderTypeSelection updateOrderData={updateOrderData} onNext={nextStep} />;
	};

	return (
		<div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-lg shadow-lg min-h-[600px]">
			{/* Progress Bar */}
			{orderData.type && currentStep > 0 && (
				<div className="mb-8">
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm font-medium text-gray-600">Step {currentStep} of {orderData.type === 'editing' ? 2 : 3}</span>
						<span className="text-sm text-gray-500 capitalize">{orderData.type} Order</span>
					</div>
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-blue-600 h-2 rounded-full transition-all duration-300"
							style={{ width: `${(currentStep / (orderData.type === 'editing' ? 2 : 3)) * 100}%` }}
						></div>
					</div>
				</div>
			)}

			{/* Current Step Component */}
			{getCurrentStepComponent()}
		</div>
	);
};

// Order Type Selection Component
const OrderTypeSelection = ({ updateOrderData, onNext }) => {
	const orderTypes = [
		{
			type: 'writing',
			icon: PenTool,
			title: 'Writing',
			description: 'Get an essay or paper written according to your instructions by a professional writer.',
			color: 'blue'
		},
		{
			type: 'editing',
			icon: Edit3,
			title: 'Editing',
			description: 'Get your paper edited, proofread, or have AI content revised by a professional editor.',
			color: 'green'
		},
		{
			type: 'technical',
			icon: Code,
			title: 'Technical',
			description: 'Get an expert\'s help with math problems, data analysis, coding, labs, accounting, etc.',
			color: 'purple'
		}
	];

	const selectType = (type) => {
		// Clear previous data when selecting a new type
		updateOrderData({
			type,
			paperType: '',
			subject: '',
			otherSubject: '',
			otherPaperType: '',
			otherSoftware: '',
			instructions: '',
			files: [],
			pageCount: 1,
			slides: 0,
			showSlides: false,
			deadline: '',
			software: 'Not applicable',
			showSoftware: false,
			selectedWriter: null
		});
		setTimeout(onNext, 150);
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Order Type</h2>
				<p className="text-gray-600">Select the type of service you need</p>
			</div>

			<div className="grid gap-4">
				{orderTypes.map(({ type, icon: Icon, title, description, color }) => (
					<button
						key={type}
						onClick={() => selectType(type)}
						className="p-4 sm:p-6 border-2 rounded-lg text-left transition-all hover:shadow-md hover:scale-[1.01] border-gray-200 hover:border-gray-300"
					>
						<div className="flex items-start space-x-4">
							<div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-500' : color === 'green' ? 'bg-green-500' : 'bg-purple-500'} text-white`}>
								<Icon size={24} />
							</div>
							<div className="flex-1">
								<h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
								<p className="text-gray-600 text-sm leading-relaxed">{description}</p>
							</div>
						</div>
					</button>
				))}
			</div>
		</div>
	);
};

// Counter Component
const Counter = ({ value, onChange, min = 0, max = 100, label }) => {
	return (
		<div className="flex items-center space-x-3">
			<button
				onClick={() => onChange(Math.max(min, value - 1))}
				disabled={value <= min}
				className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<Minus size={16} />
			</button>
			<div className="flex flex-col items-center">
				<span className="text-lg font-medium w-12 text-center">{value}</span>
				{label && <span className="text-xs text-gray-500">{label}</span>}
			</div>
			<button
				onClick={() => onChange(Math.min(max, value + 1))}
				disabled={value >= max}
				className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
			>
				<Plus size={16} />
			</button>
		</div>
	);
};

// Writing Steps
const WritingStep1 = ({ orderData, updateOrderData, onNext, onPrev }) => {
	const paperTypes = [
		'Essay', 'Research Paper', 'Term Paper', 'Thesis', 'Dissertation',
		'Case Study', 'Report', 'Review', 'Proposal', 'Other'
	];

	const subjects = [
		'English', 'Literature', 'History', 'Psychology', 'Sociology', 'Philosophy',
		'Business', 'Economics', 'Marketing', 'Finance', 'Management',
		'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Statistics',
		'Computer Science', 'Engineering', 'Medicine', 'Nursing', 'Law', 'Other'
	];

	const handleSubjectChange = (e) => {
		const value = e.target.value;
		updateOrderData({
			subject: value,
			otherSubject: value === 'Other' ? orderData.otherSubject : ''
		});
	};

	const handlePaperTypeChange = (e) => {
		const value = e.target.value;
		updateOrderData({
			paperType: value,
			otherPaperType: value === 'Other' ? orderData.otherPaperType : ''
		});
	};

	const canProceed = orderData.paperType && orderData.subject &&
		(orderData.paperType !== 'Other' || orderData.otherPaperType) &&
		(orderData.subject !== 'Other' || orderData.otherSubject);

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Paper Details</h2>
				<p className="text-gray-600">Select your paper type and subject</p>
			</div>

			<div className="space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Paper Type *</label>
					<select
						value={orderData.paperType}
						onChange={handlePaperTypeChange}
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">Select paper type</option>
						{paperTypes.map(type => (
							<option key={type} value={type}>{type}</option>
						))}
					</select>
					{orderData.paperType === 'Other' && (
						<div className="mt-2">
							<input
								type="text"
								value={orderData.otherPaperType}
								onChange={(e) => updateOrderData({ otherPaperType: e.target.value })}
								placeholder="Please specify paper type"
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
					<select
						value={orderData.subject}
						onChange={handleSubjectChange}
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="">Select subject</option>
						{subjects.map(subject => (
							<option key={subject} value={subject}>{subject}</option>
						))}
					</select>
					{orderData.subject === 'Other' && (
						<div className="mt-2">
							<input
								type="text"
								value={orderData.otherSubject}
								onChange={(e) => updateOrderData({ otherSubject: e.target.value })}
								placeholder="Please specify subject"
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					)}
				</div>
			</div>

			<div className="flex justify-between pt-4 text-sm md:text-base">
				<button onClick={onPrev} className="flex items-center pr-4 p-2 text-gray-600 hover:text-gray-800 bg-gray-300 rounded-md">
					<ChevronLeft size={20} className="mr-1" />
					Back
				</button>
				<button
					onClick={onNext}
					disabled={!canProceed}
					className="flex items-center pl-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Next
					<ChevronRight size={20} className="ml-1" />
				</button>
			</div>
		</div>
	);
};

const WritingStep2 = ({ orderData, updateOrderData, onNext, onPrev }) => {
	const handleFileUpload = (e) => {
		const files = Array.from(e.target.files);
		const fileNames = files.map(file => file.name);
		updateOrderData({ files: [...orderData.files, ...fileNames] });
	};

	const removeFile = (index) => {
		const newFiles = orderData.files.filter((_, i) => i !== index);
		updateOrderData({ files: newFiles });
	};

	const handleSlidesChange = (value) => {
		updateOrderData({ slides: value });
		if (value === 0) {
			updateOrderData({ showSlides: false });
		} else if (!orderData.showSlides) {
			updateOrderData({ showSlides: true });
		}
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Instructions & Details</h2>
				<p className="text-gray-600">Provide instructions and specify page count</p>
			</div>

			<div className="space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Instructions *</label>
					<textarea
						value={orderData.instructions}
						onChange={(e) => updateOrderData({ instructions: e.target.value })}
						placeholder="Please provide detailed instructions..."
						className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Upload Files (Optional)</label>
					<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
						<Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
						<label className="cursor-pointer">
							<span className="text-blue-600 hover:text-blue-500 font-medium">Click to upload</span>
							<input
								type="file"
								multiple
								onChange={handleFileUpload}
								className="hidden"
								accept=".pdf,.doc,.docx,.txt,.rtf"
							/>
						</label>
					</div>
					{orderData.files.length > 0 && (
						<div className="mt-3 space-y-2">
							{orderData.files.map((file, index) => (
								<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
									<span className="text-sm">{file}</span>
									<button onClick={() => removeFile(index)} className="text-red-500 text-sm">Remove</button>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
					<div>
						<label className="block text-sm font-medium text-gray-700">Page Count</label>
						<p className="text-xs text-gray-500">Double-spaced (275 words/page)</p>
					</div>
					<Counter
						value={orderData.pageCount}
						onChange={(value) => updateOrderData({ pageCount: value })}
						min={1}
						label="pages"
					/>
				</div>

				<div className="border rounded-lg p-4">
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center space-x-2">
							<Presentation size={20} className="text-purple-600" />
							<span className="font-medium">Add Presentation Details</span>
						</div>
						{!orderData.showSlides &&
							<button
								onClick={() => updateOrderData({ showSlides: !orderData.showSlides, slides: 1 })}
								className="px-3 py-1 rounded text-sm bg-gray-100 text-gray-600"
							>
								Add
							</button>
						}
					</div>
					{orderData.showSlides && (
						<div className="flex items-center justify-between">
							<span className="text-sm text-gray-600">Presentation Slides</span>
							<Counter
								value={orderData.slides}
								onChange={handleSlidesChange}
								min={0}
								label="slides"
							/>
						</div>
					)}
				</div>
			</div>

			<div className="flex justify-between pt-4 text-sm md:text-base">
				<button onClick={onPrev} className="flex items-center pr-4 p-2 text-gray-600 hover:text-gray-800 bg-gray-300 rounded-md">
					<ChevronLeft size={20} className="mr-1" />
					Back
				</button>
				<button
					onClick={onNext}
					disabled={!orderData.instructions.trim()}
					className="flex items-center pl-4 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Next
					<ChevronRight size={20} className="ml-1" />
				</button>
			</div>
		</div>
	);
};

const WritingStep3 = ({ orderData, updateOrderData, onPrev, getDefaultDeadline, setQuickDeadline, getDaysRemaining }) => {
	useEffect(() => {
		if (!orderData.deadline) {
			updateOrderData({ deadline: getDefaultDeadline() });
		}
	}, []);

	const handleSubmit = () => {
		console.log('Submitting writing order:', orderData);
		alert('Writing order submitted successfully!');
	};

	const getSubjectDisplay = () => {
		return orderData.subject === 'Other' ? orderData.otherSubject : orderData.subject;
	};

	const getPaperTypeDisplay = () => {
		return orderData.paperType === 'Other' ? orderData.otherPaperType : orderData.paperType;
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Set Deadline</h2>
				<p className="text-gray-600">When do you need your order completed?</p>
			</div>

			<div className="max-w-sm mx-auto space-y-4">
				<div className="flex space-x-2">
					<button
						onClick={() => setQuickDeadline(3)}
						className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
					>
						3 Days
					</button>
					<button
						onClick={() => setQuickDeadline(7)}
						className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
					>
						1 Week
					</button>
					<button
						onClick={() => setQuickDeadline(14)}
						className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
					>
						2 Weeks
					</button>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
					<input
						type="datetime-local"
						value={orderData.deadline}
						onChange={(e) => updateOrderData({ deadline: e.target.value })}
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					/>
					{orderData.deadline && (
						<p className="text-sm text-gray-500 mt-1">
							{getDaysRemaining(orderData.deadline)} days remaining
						</p>
					)}
				</div>
			</div>

			<div className="bg-gray-50 p-4 rounded-lg">
				<h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-gray-600">Type:</span>
						<span className="font-medium">Writing</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">Paper Type:</span>
						<span className="font-medium">{getPaperTypeDisplay()}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">Subject:</span>
						<span className="font-medium">{getSubjectDisplay()}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">Pages:</span>
						<span className="font-medium">{orderData.pageCount}</span>
					</div>
					{orderData.showSlides && orderData.slides > 0 && (
						<div className="flex justify-between">
							<span className="text-gray-600">Slides:</span>
							<span className="font-medium">{orderData.slides}</span>
						</div>
					)}
					{orderData.files.length > 0 && (
						<div className="flex justify-between">
							<span className="text-gray-600">Files:</span>
							<span className="font-medium">{orderData.files.length} file(s)</span>
						</div>
					)}
					<div className="flex justify-between">
						<span className="text-gray-600">Deadline:</span>
						<span className="font-medium">
							{new Date(orderData.deadline).toLocaleString('en-GB', {
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
								hour: '2-digit',
								minute: '2-digit',
								hour12: true
							})}
						</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">Days:</span>
						<span className="font-medium">
							{getDaysRemaining(orderData.deadline)} days
						</span>
					</div>
				</div>
			</div>

			<div className="flex justify-between pt-4 text-sm md:text-base">
				<button onClick={onPrev} className="flex items-center pr-4 p-2 text-gray-600 hover:text-gray-800 bg-gray-300 rounded-md">
					<ChevronLeft size={20} className="mr-1" />
					Back
				</button>
				<button
					onClick={handleSubmit}
					className="flex items-center pl-4 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
				>
					Submit Order
					<ChevronRight size={20} className="ml-1" />
				</button>
			</div>
		</div>
	);
};

// Editing Steps
const EditingStep1 = ({ orderData, updateOrderData, onNext, onPrev }) => {
	const subjects = [
		'English', 'Literature', 'History', 'Psychology', 'Sociology', 'Philosophy',
		'Business', 'Economics', 'Marketing', 'Finance', 'Management',
		'Biology', 'Chemistry', 'Physics', 'Mathematics', 'Statistics',
		'Computer Science', 'Engineering', 'Medicine', 'Nursing', 'Law', 'Other'
	];

	const handleSubjectChange = (e) => {
		const value = e.target.value;
		updateOrderData({
			subject: value,
			otherSubject: value === 'Other' ? orderData.otherSubject : ''
		});
	};

	const handleFileUpload = (e) => {
		const files = Array.from(e.target.files);
		const fileNames = files.map(file => file.name);
		updateOrderData({ files: [...orderData.files, ...fileNames] });
	};

	const removeFile = (index) => {
		const newFiles = orderData.files.filter((_, i) => i !== index);
		updateOrderData({ files: newFiles });
	};

	const canProceed = orderData.subject &&
		(orderData.subject !== 'Other' || orderData.otherSubject) &&
		orderData.files.length > 0 &&
		orderData.instructions.trim();

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Editing Details</h2>
				<p className="text-gray-600">Select subject, upload files, and provide instructions</p>
			</div>

			<div className="space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
					<select
						value={orderData.subject}
						onChange={handleSubjectChange}
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
					>
						<option value="">Select subject</option>
						{subjects.map(subject => (
							<option key={subject} value={subject}>{subject}</option>
						))}
					</select>
					{orderData.subject === 'Other' && (
						<div className="mt-2">
							<input
								type="text"
								value={orderData.otherSubject}
								onChange={(e) => updateOrderData({ otherSubject: e.target.value })}
								placeholder="Please specify subject"
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
							/>
						</div>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Upload Files *</label>
					<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
						<Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
						<label className="cursor-pointer">
							<span className="text-green-600 hover:text-green-500 font-medium">Click to upload files</span>
							<input
								type="file"
								multiple
								onChange={handleFileUpload}
								className="hidden"
								accept=".pdf,.doc,.docx,.txt,.rtf"
							/>
						</label>
						<p className="text-xs text-gray-500 mt-1">Required: Upload files that need editing</p>
					</div>
					{orderData.files.length > 0 && (
						<div className="mt-3 space-y-2">
							{orderData.files.map((file, index) => (
								<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
									<span className="text-sm">{file}</span>
									<button onClick={() => removeFile(index)} className="text-red-500 text-sm">Remove</button>
								</div>
							))}
						</div>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Instructions *</label>
					<textarea
						value={orderData.instructions}
						onChange={(e) => updateOrderData({ instructions: e.target.value })}
						placeholder="Please provide editing instructions..."
						className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
					/>
				</div>
			</div>

			<div className="flex justify-between pt-4 text-sm md:text-base">
				<button onClick={onPrev} className="flex items-center pr-4 p-2 text-gray-600 hover:text-gray-800 bg-gray-300 rounded-md">
					<ChevronLeft size={20} className="mr-1" />
					Back
				</button>
				<button
					onClick={onNext}
					disabled={!canProceed}
					className="flex items-center pl-4 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Next
					<ChevronRight size={20} className="ml-1" />
				</button>
			</div>
		</div>
	);
};

const EditingStep2 = ({ orderData, updateOrderData, onNext, onPrev, getDefaultDeadline, setQuickDeadline, getDaysRemaining }) => {
	useEffect(() => {
		if (!orderData.deadline) {
			updateOrderData({ deadline: getDefaultDeadline() });
		}
	}, []);

	const getSubjectDisplay = () => {
		return orderData.subject === 'Other' ? orderData.otherSubject : orderData.subject;
	};

	const handleSubmit = () => {
		console.log('Submitting editing order:', orderData);
		alert('Editing order submitted successfully!');
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Final Details</h2>
				<p className="text-gray-600">Specify page count and set deadline</p>
			</div>

			<div className="space-y-6">
				<div className="flex items-center justify-center">
					<div className="p-4 bg-gray-50 rounded-lg w-full max-w-md flex flex-col md:flex-row justify-between items-center gap-5">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Pages to Edit</label>
							<p className="text-xs text-gray-500">Double-spaced pages</p>
						</div>
						<Counter
							value={orderData.pageCount}
							onChange={(value) => updateOrderData({ pageCount: value })}
							min={1}
							label="pages"
						/>
					</div>
				</div>

				<div className="max-w-sm mx-auto space-y-4">
					<div className="flex space-x-2">
						<button
							onClick={() => setQuickDeadline(3)}
							className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
						>
							3 Days
						</button>
						<button
							onClick={() => setQuickDeadline(7)}
							className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
						>
							1 Week
						</button>
						<button
							onClick={() => setQuickDeadline(14)}
							className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
						>
							2 Weeks
						</button>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
						<input
							type="datetime-local"
							value={orderData.deadline}
							onChange={(e) => updateOrderData({ deadline: e.target.value })}
							className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
						/>
						{orderData.deadline && (
							<p className="text-sm text-gray-500 mt-1">
								{getDaysRemaining(orderData.deadline)} days remaining
							</p>
						)}
					</div>
				</div>

				<div className="bg-gray-50 p-4 rounded-lg">
					<h3 className="font-medium text-gray-900 mb-3">Order Summary</h3>
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-600">Type:</span>
							<span className="font-medium">Editing</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Subject:</span>
							<span className="font-medium">{getSubjectDisplay()}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Pages:</span>
							<span className="font-medium">{orderData.pageCount}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Files:</span>
							<span className="font-medium">{orderData.files.length} file(s)</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Deadline:</span>
							<span className="font-medium">
								{new Date(orderData.deadline).toLocaleString('en-GB', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: true
								})}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Days:</span>
							<span className="font-medium">
								{getDaysRemaining(orderData.deadline)} days
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between pt-4 text-sm md:text-base">
				<button onClick={onPrev} className="flex items-center pr-4 p-2 text-gray-600 hover:text-gray-800 bg-gray-300 rounded-md">
					<ChevronLeft size={20} className="mr-1" />
					Back
				</button>
				<button
					onClick={handleSubmit}
					className="flex items-center pl-4 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
				>
					Submit Order
					<ChevronRight size={20} className="ml-1" />
				</button>
			</div>
		</div>
	);
};

// Technical Steps
const TechnicalStep1 = ({ orderData, updateOrderData, onNext, onPrev }) => {
	const subjects = [
		'Mathematics', 'Statistics', 'Physics', 'Chemistry', 'Biology',
		'Computer Science', 'Engineering', 'Data Analysis', 'Accounting', 'Finance',
		'Economics', 'Business Analytics', 'Machine Learning', 'Other'
	];

	const softwareOptions = [
		'Not applicable', 'Python', 'R', 'MATLAB', 'Excel', 'SPSS', 'SAS', 'Stata', 'Java',
		'C++', 'JavaScript', 'SQL', 'Tableau', 'Power BI', 'AutoCAD', 'Other'
	];

	const handleSubjectChange = (e) => {
		const value = e.target.value;
		updateOrderData({
			subject: value,
			otherSubject: value === 'Other' ? orderData.otherSubject : ''
		});
	};

	const handleSoftwareChange = (e) => {
		const value = e.target.value;
		updateOrderData({
			software: value,
			otherSoftware: value === 'Other' ? orderData.otherSoftware : ''
		});
	};

	const handleFileUpload = (e) => {
		const files = Array.from(e.target.files);
		const fileNames = files.map(file => file.name);
		updateOrderData({ files: [...orderData.files, ...fileNames] });
	};

	const removeFile = (index) => {
		const newFiles = orderData.files.filter((_, i) => i !== index);
		updateOrderData({ files: newFiles });
	};

	const toggleSoftware = () => {
		if (orderData.showSoftware) {
			updateOrderData({ showSoftware: false, software: 'Not applicable', otherSoftware: '' });
		} else {
			updateOrderData({ showSoftware: true, software: 'Python' });
		}
	};

	const canProceed = orderData.subject &&
		(orderData.subject !== 'Other' || orderData.otherSubject) &&
		orderData.instructions.trim() &&
		(!orderData.showSoftware ||
			(orderData.software !== 'Other' || orderData.otherSoftware));

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Technical Details</h2>
				<p className="text-gray-600">Select subject, provide instructions, and upload files</p>
			</div>

			<div className="space-y-6">
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
					<select
						value={orderData.subject}
						onChange={handleSubjectChange}
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
					>
						<option value="">Select subject</option>
						{subjects.map(subject => (
							<option key={subject} value={subject}>{subject}</option>
						))}
					</select>
					{orderData.subject === 'Other' && (
						<div className="mt-2">
							<input
								type="text"
								value={orderData.otherSubject}
								onChange={(e) => updateOrderData({ otherSubject: e.target.value })}
								placeholder="Please specify subject"
								className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							/>
						</div>
					)}
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Instructions *</label>
					<textarea
						value={orderData.instructions}
						onChange={(e) => updateOrderData({ instructions: e.target.value })}
						placeholder="Please provide detailed instructions for your technical task..."
						className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Upload Files (Optional)</label>
					<div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
						<Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
						<label className="cursor-pointer">
							<span className="text-purple-600 hover:text-purple-500 font-medium">Click to upload</span>
							<input
								type="file"
								multiple
								onChange={handleFileUpload}
								className="hidden"
								accept=".pdf,.doc,.docx,.txt,.rtf,.csv,.xlsx,.py,.r,.m"
							/>
						</label>
					</div>
					{orderData.files.length > 0 && (
						<div className="mt-3 space-y-2">
							{orderData.files.map((file, index) => (
								<div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
									<span className="text-sm">{file}</span>
									<button onClick={() => removeFile(index)} className="text-red-500 text-sm">Remove</button>
								</div>
							))}
						</div>
					)}
				</div>

				<div className="border rounded-lg p-4">
					<div className="flex items-center justify-between mb-3">
						<div className="flex items-center space-x-2">
							<Code size={20} className="text-purple-600" />
							<span className="font-medium">Add Software</span>
						</div>
						<button
							onClick={toggleSoftware}
							className={`px-3 py-1 rounded text-sm ${orderData.showSoftware ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}
						>
							{orderData.showSoftware ? 'Remove' : 'Add'}
						</button>
					</div>
					{orderData.showSoftware && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Software/Tool</label>
							<select
								value={orderData.software}
								onChange={handleSoftwareChange}
								className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
							>
								{softwareOptions.map(software => (
									<option key={software} value={software}>{software}</option>
								))}
							</select>
							{orderData.software === 'Other' && (
								<div className="mt-2">
									<input
										type="text"
										value={orderData.otherSoftware}
										onChange={(e) => updateOrderData({ otherSoftware: e.target.value })}
										placeholder="Please specify software"
										className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
									/>
								</div>
							)}
						</div>
					)}
				</div>
			</div>

			<div className="flex justify-between pt-4 text-sm md:text-base">
				<button onClick={onPrev} className="flex items-center pr-4 p-2 text-gray-600 hover:text-gray-800 bg-gray-300 rounded-md">
					<ChevronLeft size={20} className="mr-1" />
					Back
				</button>
				<button
					onClick={onNext}
					disabled={!canProceed}
					className="flex items-center pl-4 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Next
					<ChevronRight size={20} className="ml-1" />
				</button>
			</div>
		</div>
	);
};

const TechnicalStep2 = ({ orderData, updateOrderData, onNext, onPrev, getDefaultDeadline, setQuickDeadline, getDaysRemaining }) => {
	useEffect(() => {
		if (!orderData.deadline) {
			updateOrderData({ deadline: getDefaultDeadline() });
		}
	}, []);

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Set Deadline & Select Writer</h2>
				<p className="text-gray-600">When do you need your technical work completed?</p>
			</div>

			<div className="max-w-sm mx-auto space-y-4">
				<div className="flex space-x-2">
					<button
						onClick={() => setQuickDeadline(3)}
						className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
					>
						3 Days
					</button>
					<button
						onClick={() => setQuickDeadline(7)}
						className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
					>
						1 Week
					</button>
					<button
						onClick={() => setQuickDeadline(14)}
						className="flex-1 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded"
					>
						2 Weeks
					</button>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
					<input
						type="datetime-local"
						value={orderData.deadline}
						onChange={(e) => updateOrderData({ deadline: e.target.value })}
						className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
					/>
					{orderData.deadline && (
						<p className="text-sm text-gray-500 mt-1">
							{getDaysRemaining(orderData.deadline)} days remaining
						</p>
					)}
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="font-medium text-gray-900">Available Writers</h3>
				{orderData.availableWriters.length > 0 ? (
					orderData.availableWriters.map((writer) => (
						<div
							key={writer.id}
							className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${orderData.selectedWriter?.id === writer.id
								? 'border-purple-500 bg-purple-50'
								: 'border-gray-200 hover:border-gray-300'
								}`}
							onClick={() => updateOrderData({ selectedWriter: writer })}
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-4">
									<div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-semibold">
										{writer.avatar}
									</div>
									<div>
										<h3 className="font-semibold text-gray-900">{writer.name}</h3>
										<div className="flex items-center space-x-2 text-sm text-gray-600">
											<div className="flex items-center">
												<Star size={14} className="text-yellow-400 fill-current" />
												<span className="ml-1">{writer.rating}</span>
											</div>
											<span>•</span>
											<span>{writer.completedOrders} orders</span>
										</div>
										<div className="flex flex-wrap gap-1 mt-1">
											{writer.expertise.map((skill, index) => (
												<span
													key={index}
													className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
												>
													{skill}
												</span>
											))}
										</div>
									</div>
								</div>
								<div className="text-right">
									<div className="text-lg font-semibold text-gray-900">${writer.price}</div>
									<div className="text-sm text-gray-500">per hour</div>
								</div>
							</div>
						</div>
					))
				) : (
					<div className="text-center py-8 text-gray-500">
						Loading available writers...
					</div>
				)}
			</div>

			<div className="flex justify-between pt-4 text-sm md:text-base">
				<button onClick={onPrev} className="flex items-center pr-4 p-2 text-gray-600 hover:text-gray-800 bg-gray-300 rounded-md">
					<ChevronLeft size={20} className="mr-1" />
					Back
				</button>
				<button
					onClick={onNext}
					disabled={!orderData.selectedWriter}
					className="flex items-center pl-4 p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
				>
					Next
					<ChevronRight size={20} className="ml-1" />
				</button>
			</div>
		</div>
	);
};

const TechnicalStep3 = ({ orderData, updateOrderData, onPrev }) => {
	const getSubjectDisplay = () => {
		return orderData.subject === 'Other' ? orderData.otherSubject : orderData.subject;
	};

	const getSoftwareDisplay = () => {
		if (!orderData.showSoftware) return 'Not applicable';
		return orderData.software === 'Other' ? orderData.otherSoftware : orderData.software;
	};

	const handleSubmit = () => {
		console.log('Submitting technical order:', orderData);
		alert(`Technical order submitted successfully! Assigned to ${orderData.selectedWriter.name}`);
	};

	return (
		<div className="space-y-6">
			<div className="text-center">
				<h2 className="text-2xl font-bold text-gray-900 mb-2">Order Summary</h2>
				<p className="text-gray-600">Review your technical order details</p>
			</div>

			<div className="bg-gray-50 p-4 rounded-lg">
				<div className="space-y-4">
					<div className="space-y-2 text-sm">
						<div className="flex justify-between">
							<span className="text-gray-600">Type:</span>
							<span className="font-medium">Technical</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Subject:</span>
							<span className="font-medium">{getSubjectDisplay()}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Software:</span>
							<span className="font-medium">{getSoftwareDisplay()}</span>
						</div>
						{orderData.files.length > 0 && (
							<div className="flex justify-between">
								<span className="text-gray-600">Files:</span>
								<span className="font-medium">{orderData.files.length} file(s)</span>
							</div>
						)}
						<div className="flex justify-between">
							<span className="text-gray-600">Assigned Writer:</span>
							<span className="font-medium">{orderData.selectedWriter?.name}</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Deadline:</span>
							<span className="font-medium">
								{new Date(orderData.deadline).toLocaleString('en-GB', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
									hour: '2-digit',
									minute: '2-digit',
									hour12: true
								})}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="text-gray-600">Days:</span>
							<span className="font-medium">
								{getDaysRemaining(orderData.deadline)} days
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-between pt-4 text-sm md:text-base">
				<button onClick={onPrev} className="flex items-center pr-4 p-2 text-gray-600 hover:text-gray-800 bg-gray-300 rounded-md">
					<ChevronLeft size={20} className="mr-1" />
					Back
				</button>
				<button
					onClick={handleSubmit}
					className="flex items-center pl-4 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
				>
					Submit Order
					<ChevronRight size={20} className="ml-1" />
				</button>
			</div>
		</div>
	);
};

export default OrderFlow;