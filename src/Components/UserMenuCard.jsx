import React from "react";
import UserProfileLogo from "../assets/profile_logo_md.svg";

const UserMenuCard = () => {
	return (
		<div className='text-center flex flex-col w-[10%] bg-white'>
			<img src={UserProfileLogo} className='w-[3em] mx-auto' alt='' />
			<h2 className='text-[0.6em] font-semibold'>Jasurbek Sadiev</h2>
			<p className='text-[0.35em]'>jasurbek.sadiev@gmail.com</p>
		</div>
	);
};

export default UserMenuCard;
