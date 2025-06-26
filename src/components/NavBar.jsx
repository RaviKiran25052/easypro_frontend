import React, { useState, useEffect } from 'react';
import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import AuthModal from './AuthModal';
import LogoutModal from './LogoutModal';

const NavBar = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState(null);
	const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);

	const navLinks = [
		{
			label: "Services", links: [
				{ label: 'Essay Writing', link: "/" },
				{ label: 'Research Papers', link: "/" },
				{ label: 'Thesis Writing', link: "/" },
				{ label: 'Editing & Proofreading', link: "/" },
				{ label: 'About Us', link: "/" },
				{ label: 'Assignment Help', link: "/" }
			]
		},
		{ label: "How it works", link: "/howitworks" },
		{ label: "Top Writers", link: "/top-writers" },
		{
			label: "Who Are We", links: [
				{ label: 'Reviews', link: "/reviews" },
				{ label: 'FAQS', link: "/faqs" },
				{ label: 'Contact Us', link: "/contactus" }
			]
		}
	];

	const loggedNavLinks = [
		{ label: "My Orders", link: "/user/orders" },
		{ label: "Top Writers", link: "/top-writers" },
		{
			label: "Services", links: [
				{ label: 'Essay Writing', link: "/" },
				{ label: 'Research Papers', link: "/" },
				{ label: 'Thesis Writing', link: "/" },
				{ label: 'Editing & Proofreading', link: "/" },
				{ label: 'About Us', link: "/" },
				{ label: 'Assignment Help', link: "/" }
			]
		},
		{ label: "Place Order", link: "/order" }
	];

	const userProfileDropdown = [
		{ icon: <User className='w-4' />, label: 'Profile', action: () => window.location.href = '/user' },
		{ icon: <LogOut className='w-4' />, label: 'Logout', action: () => setIsLogoutModalOpen(true) }
	];

	const handleLogout = () => {
		setIsAuthenticated(false);
		setUser(null);
		setIsLogoutModalOpen(false);
		localStorage.removeItem('token');
		localStorage.removeItem('user');
	};

	useEffect(() => {
		const storedUser = JSON.parse(localStorage.getItem('user'));
		const token = localStorage.getItem('token');
		if (storedUser && token) {
			if (storedUser.role === "admin") {
				window.location.replace('/admin/home');
			}
			setUser(storedUser);
			setIsAuthenticated(true);
		}
	}, [isModalOpen]);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, [])

	const handleDropdownEnter = (dropdown) => {
		setActiveDropdown(dropdown);
	};

	const handleDropdownLeave = () => {
		setActiveDropdown(null);
	};

	return (
		<div className="min-h-[86px] md:min-h-[110px] bg-white">
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
								{!isAuthenticated ? (
									<>
										{navLinks.map((navItem, index) => {
											// Check if it's a dropdown (has links array)
											if (navItem.links) {
												return (
													<div
														key={index}
														className="relative"
														onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
														onMouseLeave={handleDropdownLeave}
													>
														<button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
															<span>{navItem.label}</span>
															<ChevronDown className="w-4 h-4" />
														</button>

														{activeDropdown === navItem.label.toLowerCase().replace(/\s+/g, '') && (
															<div
																className="absolute top-4 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
																onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
																onMouseLeave={handleDropdownLeave}
															>
																{navItem.links.map((dropdownItem, dropdownIndex) => (
																	<a
																		key={dropdownIndex}
																		href={dropdownItem.link}
																		className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
																	>
																		{dropdownItem.label}
																	</a>
																))}
															</div>
														)}
													</div>
												);
											} else {
												// Regular link (no dropdown)
												return (
													<a
														key={index}
														href={navItem.link}
														className="text-gray-700 hover:text-gray-900 transition-colors"
													>
														{navItem.label}
													</a>
												);
											}
										})}
									</>
								) : (
									<>
										{loggedNavLinks.map((navItem, index) => {
											// Check if it's a dropdown (has links array)
											if (navItem.links) {
												return (
													<div
														key={index}
														className="relative"
														onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
														onMouseLeave={handleDropdownLeave}
													>
														<button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
															<span>{navItem.label}</span>
															<ChevronDown className="w-4 h-4" />
														</button>

														{activeDropdown === navItem.label.toLowerCase().replace(/\s+/g, '') && (
															<div
																className="absolute top-4 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
																onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
																onMouseLeave={handleDropdownLeave}
															>
																{navItem.links.map((dropdownItem, dropdownIndex) => (
																	<a
																		key={dropdownIndex}
																		href={dropdownItem.link}
																		className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
																	>
																		{dropdownItem.label}
																	</a>
																))}
															</div>
														)}
													</div>
												);
											} else {
												// Regular link (no dropdown)
												return (
													<a
														key={index}
														href={navItem.link}
														className="text-gray-700 hover:text-gray-900 transition-colors"
													>
														{navItem.label}
													</a>
												);
											}
										})}
									</>
								)}
							</div>

							{/* Login Button / User Profile */}
							<div className="flex items-center justify-between space-x-2">
								{!isAuthenticated ? (
									<button
										className="text-sm md:text-base bg-red-400 hover:bg-orange-300 text-white px-4 py-2 rounded-full transition-colors"
										onClick={() => setIsModalOpen(true)}
									>
										Log in
									</button>
								) : (
									<div
										className="relative"
										onMouseEnter={() => handleDropdownEnter('userProfile')}
										onMouseLeave={handleDropdownLeave}
									>
										<button className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors">
											<img
												src={user?.profilePic}
												alt={user?.userName}
												className="w-8 h-8 rounded-full"
											/>
											<span className="hidden md:block">{user?.userName}</span>
											<ChevronDown className="w-4 h-4" />
										</button>

										{activeDropdown === 'userProfile' && (
											<div
												className="absolute top-6 right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
												onMouseEnter={() => handleDropdownEnter('userProfile')}
												onMouseLeave={handleDropdownLeave}
											>
												{userProfileDropdown.map((item, index) => (
													<button
														key={index}
														onClick={item.action}
														className={`flex gap-2 items-center w-full text-left px-4 py-2 text-sm ${item.label === 'Logout' ? "text-red-500" : "text-gray-700"} hover:bg-gray-100 first:rounded-t-md last:rounded-b-md`}
													>
														{item.icon}
														{item.label}
													</button>
												))}
											</div>
										)}
									</div>
								)}

								{/* Mobile Menu Button */}
								<button
									onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
									className="md:hidden text-gray-700 hover:text-gray-900"
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
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
							className="p-2 text-gray-700 hover:text-gray-900"
						>
							<X className="w-6 h-6" />
						</button>
					</div>

					{/* Mobile Menu Items */}
					<div className="p-4 space-y-4 flex flex-col">
						{!isAuthenticated ? (
							<>
								{navLinks.map((navItem, index) => {
									// Check if it's a dropdown (has links array)
									if (navItem.links) {
										return (
											<div
												key={index}
												className="relative"
												onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
												onMouseLeave={handleDropdownLeave}
											>
												<button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
													<span>{navItem.label}</span>
													<ChevronDown className="w-4 h-4" />
												</button>

												{activeDropdown === navItem.label.toLowerCase().replace(/\s+/g, '') && (
													<div
														className="absolute top-4 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
														onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
														onMouseLeave={handleDropdownLeave}
													>
														{navItem.links.map((dropdownItem, dropdownIndex) => (
															<a
																key={dropdownIndex}
																href={dropdownItem.link}
																className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
															>
																{dropdownItem.label}
															</a>
														))}
													</div>
												)}
											</div>
										);
									} else {
										// Regular link (no dropdown)
										return (
											<a
												key={index}
												href={navItem.link}
												className="text-gray-700 hover:text-gray-900 transition-colors"
											>
												{navItem.label}
											</a>
										);
									}
								})}
							</>
						) : (
							<>
								{/* User Profile Section */}
								<div className="pb-4 border-b">
									<div className="flex items-center space-x-3">
										<img
											src={user?.profilePic}
											alt={user?.userName}
											className="w-10 h-10 rounded-full"
										/>
										<div>
											<div className="font-semibold text-gray-800">{user?.userName}</div>
											<div className="text-sm text-gray-600">{user?.email}</div>
										</div>
									</div>
								</div>

								{loggedNavLinks.map((navItem, index) => {
									// Check if it's a dropdown (has links array)
									if (navItem.links) {
										return (
											<div
												key={index}
												className="relative"
												onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
												onMouseLeave={handleDropdownLeave}
											>
												<button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors">
													<span>{navItem.label}</span>
													<ChevronDown className="w-4 h-4" />
												</button>

												{activeDropdown === navItem.label.toLowerCase().replace(/\s+/g, '') && (
													<div
														className="absolute top-4 left-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50"
														onMouseEnter={() => handleDropdownEnter(navItem.label.toLowerCase().replace(/\s+/g, ''))}
														onMouseLeave={handleDropdownLeave}
													>
														{navItem.links.map((dropdownItem, dropdownIndex) => (
															<a
																key={dropdownIndex}
																href={dropdownItem.link}
																className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
															>
																{dropdownItem.label}
															</a>
														))}
													</div>
												)}
											</div>
										);
									} else {
										// Regular link (no dropdown)
										return (
											<a
												key={index}
												href={navItem.link}
												className="text-gray-700 hover:text-gray-900 transition-colors"
											>
												{navItem.label}
											</a>
										);
									}
								})}

								{/* Profile Actions */}
								<div className="pt-4 border-t space-y-2">
									{userProfileDropdown.map((item, index) => (
										<button
											key={index}
											onClick={item.action}
											className={`flex gap-2 items-center w-full text-left py-2 ${item.label === 'Logout' ? "text-red-500" : "text-gray-700"}`}
										>
											{item.icon}
											{item.label}
										</button>
									))}
								</div>
							</>
						)}
					</div>
				</div>
			</div>

			<AuthModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
			/>

			<LogoutModal
				isOpen={isLogoutModalOpen}
				onClose={() => setIsLogoutModalOpen(false)}
				onConfirm={handleLogout}
			/>
		</div>
	);
};

export default NavBar;