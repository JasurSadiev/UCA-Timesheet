import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";
import UcaLogo from "../assets/uca_logo.svg";
import UserMenu from "../assets/user_menu.svg";
import ProfileLogoSmall from "../assets/profile_logo_sm.svg";
import ProfileLogoMedium from "../assets/profile_logo_md.svg";
import SettingLogo from "../assets/settings_logo.svg";
import SignOutLogo from "../assets/sign_out_logo.svg";

const Navbar = () => {
	const [showMenu, setShowMenu] = useState(false);
	const menuRef = useRef(null);

	useEffect(() => {
		// Function to close the menu when clicking outside
		function handleClickOutside(event) {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				setShowMenu(false);
			}
		}

		// Bind the event listener
		document.addEventListener("mousedown", handleClickOutside);

		// Unbind the event listener on cleanup
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [menuRef]);

	return (
		<div className='w-screen left-0 top-0 sticky flex justify-between drop-shadow-lg font-medium text-xl text-center bg-white'>
			<img src={UcaLogo} className='ml-4 ' />
			<div className=' flex gap-x-20 my-auto'>
				<ul className='text-[15px] flex gap-x-8' id='navLinks'>
					<Link to='/my-tables' className=''>
						<span className='text-black'>Home</span>
					</Link>

					<Link to='/my-timesheets' className='text-black'>
						<span className='text-black'>My Timesheet</span>
					</Link>
					<Link to='/pending-timesheets' className=''>
						<span className='text-black'>Inbox</span>
					</Link>
				</ul>
				<div ref={menuRef}>
					<img
						src={UserMenu}
						alt=''
						onClick={() => setShowMenu(!showMenu)}
						className='mr-4 cursor-pointer'
					/>
					{showMenu && <UserMenuDiv />}
				</div>
			</div>
		</div>
	);
};

export const Logout = () => {
	const navigate = useNavigate();
	const { setAuth } = useAuth();

	function logOut() {
		Cookies.remove("accessToken");
		setAuth({});
		navigate("/");
	}
	return (
		<button className='mr-[50px] m-auto' onClick={logOut}>
			Logout
		</button>
	);
};

const UserMenuDiv = () => {
	const navigate = useNavigate();
	const { setAuth } = useAuth();

	function logOut() {
		Cookies.remove("accessToken");
		setAuth({});
		navigate("/");
	}

	return (
		<div className='h-fit w-fit px-2 bg-white text-black flex flex-col absolute right-2 rounded-[8px] shadow-xl cursor-pointer'>
			<div className='flex gap-x-2'>
				<img src={ProfileLogoMedium} alt='' />
				<div className='flex flex-col text-left'>
					<h3 className='text-[12px] -mb-[20px]'>Jasurbek Sadiev</h3>
					<p className='text-[8px] text-[#9DACC3]'>jasurbek.sadiev@gmail.com</p>
				</div>
			</div>
			<hr />
			<div className='flex gap-x-2  text-[#9DACC3]'>
				<img src={ProfileLogoSmall} alt='' />
				<span className='text-[12px] hover:underline hover:text-[#767e8a]'>
					Profile
				</span>
			</div>
			<div className='flex gap-x-2  text-[#9DACC3]'>
				<img src={SettingLogo} alt='' />
				<span className='text-[12px] hover:underline'>Settings</span>
			</div>
			<hr />
			<div className='flex gap-x-2 text-[#9DACC3]'>
				<img src={SignOutLogo} alt='' />
				<span className='text-[12px] hover:underline' onClick={logOut}>
					Sign Out
				</span>
			</div>
		</div>
	);
};

export default Navbar;
