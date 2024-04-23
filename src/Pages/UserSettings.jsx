import React from "react";
import Navbar from "../Components/Navbar";
import UserMenuCard from "../Components/UserMenuCard";
import AddNewUserForm from "../Components/AddNewUserForm";

const UserSettings = () => {
	return (
		<div className='h-fit overflow-x-hidden min-h-screen pr-4 max-w-screen bg-gradient-to-bl from-[#d8e7f5] to-[#afcce700]'>
			<Navbar />
			<div className='flex justify-normal gap-x-20'>
				<UserMenuCard />
				<AddNewUserForm />
			</div>
		</div>
	);
};

export default UserSettings;
