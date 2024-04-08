import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserProfileLogo from "../assets/profile_logo_md.svg";
import ProfileLogoSmall from "../assets/profile_logo_sm.svg";
import SettingLogo from "../assets/settings_logo.svg";
import SignOutLogo from "../assets/sign_out_logo.svg";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";

const UserMenuCard = () => {
	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();

	function logOut() {
		Cookies.remove("accessToken");
		setAuth({});
		navigate("/");
	}

	return (
		<div className='text-center flex flex-col min-w-[15%] w-fit max-h-[280px] bg-white mt-[2%] ml-[5%] shadow-md rounded-lg'>
			<img src={UserProfileLogo} className='w-[3em] mt-2 mx-auto' alt='' />
			<h2 className='text-[0.8em] font-semibold mt-2'>
				{auth.userInfo.first_name || ""} {auth.userInfo.last_name || ""}
			</h2>
			<p className='text-[0.6em] mt-1'>{auth.userInfo.email}</p>
			<div className='flex gap-x-6  text-[#9DACC3] ml-10 mt-4 ]'>
				<img src={ProfileLogoSmall} alt='' />
				<span className='text-[14px] hover:underline hover:text-[#767e8a]'>
					Profile
				</span>
			</div>
			<div className='flex gap-x-6 mt-1  ml-10  text-[#9DACC3]'>
				<img src={SettingLogo} alt='' className='my-auto' />
				<Link to={"/settings"} className='-mt-1'>
					<span className='text-[14px] font-medium my-auto text-[#181819] hover:underline'>
						Settings
					</span>
				</Link>
			</div>
			<hr className='mx-10' />
			<div className='flex gap-x-6 ml-10 mt-2 mb-[5%] text-[#9DACC3]'>
				<img src={SignOutLogo} alt='' />
				<span className='text-[14px] hover:underline' onClick={logOut}>
					Sign Out
				</span>
			</div>
		</div>
	);
};

export default UserMenuCard;
