import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import AuthModal from './AuthModal';

const NavBar = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState(null);
	const [mobileDropdowns, setMobileDropdowns] = useState({
		services: false,
		whoWeAre: false
	});
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalMode, setModalMode] = useState('login');

	const openModal = (mode) => {
		setModalMode(mode);
		setIsModalOpen(true);
	};

	// Services dropdown items
	const servicesDropdown = [
		'Essay Writing',
		'Research Papers',
		'Thesis Writing',
		'Editing & Proofreading',
		'Assignment Help'
	];

	// Who We Are dropdown items
	const whoWeAreDropdown = [
		'About Us',
		'Our Team',
		'Reviews',
		'Guarantees',
		'Contact'
	];

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
		// Reset mobile dropdowns when closing menu
		if (isMobileMenuOpen) {
			setMobileDropdowns({ services: false, whoWeAre: false });
		}
	};

	const toggleMobileDropdown = (dropdown) => {
		setMobileDropdowns(prev => ({
			...prev,
			[dropdown]: !prev[dropdown]
		}));
	};

	const handleDropdownEnter = (dropdown) => {
		setActiveDropdown(dropdown);
	};

	const handleDropdownLeave = () => {
		setActiveDropdown(null);
	};

	return (
		<div className="min-h-[88px] md:min-h-[110px] bg-white">
			{/* Sticky Navbar Container */}
			<div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
				? 'bg-white'
				: 'bg-transparent'
				}`}>
				<div className={`transition-all duration-300 ${isScrolled
					? 'mx-0 my-0 md:px-20'
					: 'mx-4 my-4 md:mx-16 md:my-6'
					}`}>
					{/* Navbar */}
					<nav className={`transition-all duration-300 ${isScrolled
						? 'bg-white rounded-none px-4 py-3'
						: 'bg-[#fff9f4] rounded-t-2xl px-4 py-4'
						}`}>
						<div className="flex items-center justify-between">
							{/* Logo */}
							<img src="/logoBlack.png" className='w-28 md:w-40' alt="logo" />

							{/* Desktop Navigation Links */}
							<div className="hidden md:flex items-center space-x-8">
								{/* Services Dropdown */}
								<div
									className="relative"
									onMouseEnter={() => handleDropdownEnter('services')}
									onMouseLeave={handleDropdownLeave}
								>
									<button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
										<span>Services</span>
										<ChevronDown className="w-4 h-4" />
									</button>

									{activeDropdown === 'services' && (
										<div
											className="absolute top-4 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
											onMouseEnter={() => handleDropdownEnter('services')}
											onMouseLeave={handleDropdownLeave}
										>
											{servicesDropdown.map((item, index) => (
												<a
													key={index}
													href="/"
													className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
												>
													{item}
												</a>
											))}
										</div>
									)}
								</div>

								{/* How it works */}
								<a href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
									How it works
								</a>

								{/* Top Writers */}
								<a href="/" className="text-gray-700 hover:text-gray-900 transition-colors">
									Top Writers
								</a>

								{/* Who We Are Dropdown */}
								<div
									className="relative"
									onMouseEnter={() => handleDropdownEnter('whoWeAre')}
									onMouseLeave={handleDropdownLeave}
								>
									<button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
										<span>Who We Are</span>
										<ChevronDown className="w-4 h-4" />
									</button>

									{activeDropdown === 'whoWeAre' && (
										<div
											className="absolute top-4 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
											onMouseEnter={() => handleDropdownEnter('whoWeAre')}
											onMouseLeave={handleDropdownLeave}
										>
											{whoWeAreDropdown.map((item, index) => (
												<a
													key={index}
													href="/"
													className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
												>
													{item}
												</a>
											))}
										</div>
									)}
								</div>
							</div>

							{/* Login Button & Mobile Menu Button */}
							<div className="flex items-center justify-between space-x-4">
								<button
									className="bg-red-400 hover:bg-orange-300 text-white px-4 py-2 rounded-full transition-colors"
									onClick={() => openModal('login')}
								>
									Log in
								</button>

								{/* Mobile Menu Button */}
								<button
									onClick={toggleMobileMenu}
									className="md:hidden p-2 text-gray-700 hover:text-gray-900"
								>
									<Menu className="w-6 h-6" />
								</button>
							</div>
						</div>
					</nav>
				</div>
			</div>

			{/* Mobile Menu Overlay */}
			<div className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}>
				<div
					className={`fixed top-0 right-0 h-full w-80 bg-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
						}`}
				>
					{/* Mobile Menu Header */}
					<div className="flex items-center justify-between p-4 border-b">
						<div className="text-xl font-bold text-gray-800">Menu</div>
						<button
							onClick={toggleMobileMenu}
							className="p-2 text-gray-700 hover:text-gray-900"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					{/* Mobile Menu Items */}
					<div className="p-4 space-y-4">
						{/* Services Dropdown */}
						<div>
							<button
								onClick={() => toggleMobileDropdown('services')}
								className="flex items-center justify-between w-full text-left font-semibold text-gray-800 hover:text-gray-900"
							>
								<span>Services</span>
								<ChevronDown className={`w-4 h-4 transition-transform ${mobileDropdowns.services ? 'rotate-180' : ''
									}`} />
							</button>
							{mobileDropdowns.services && (
								<div className="mt-2 pl-4 space-y-2">
									{servicesDropdown.map((item, index) => (
										<a
											key={index}
											href="/"
											className="block text-gray-600 hover:text-gray-800 py-1"
										>
											{item}
										</a>
									))}
								</div>
							)}
						</div>

						{/* How it works */}
						<a href="/" className="block text-gray-800 hover:text-gray-900 font-semibold">
							How it works
						</a>

						{/* Top Writers */}
						<a href="/" className="block text-gray-800 hover:text-gray-900 font-semibold">
							Top Writers
						</a>

						{/* Who We Are Dropdown */}
						<div>
							<button
								onClick={() => toggleMobileDropdown('whoWeAre')}
								className="flex items-center justify-between w-full text-left font-semibold text-gray-800 hover:text-gray-900"
							>
								<span>Who We Are</span>
								<ChevronDown className={`w-4 h-4 transition-transform ${mobileDropdowns.whoWeAre ? 'rotate-180' : ''
									}`} />
							</button>
							{mobileDropdowns.whoWeAre && (
								<div className="mt-2 pl-4 space-y-2">
									{whoWeAreDropdown.map((item, index) => (
										<a
											key={index}
											href="/"
											className="block text-gray-600 hover:text-gray-800 py-1"
										>
											{item}
										</a>
									))}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>


			<AuthModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>
		</div>
	);
};

export default NavBar;