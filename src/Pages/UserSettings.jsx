import React from "react";
import Navbar from "../Components/Navbar";
import UserMenuCard from "../Components/UserMenuCard";

const UserSettings = () => {
	return (
		<div className='min-h-screen max-w-screen bg-gradient-to-bl from-[#d8e7f5] to-[#afcce700]'>
			<Navbar />
			<UserMenuCard />
		</div>
	);
};

export default UserSettings;
