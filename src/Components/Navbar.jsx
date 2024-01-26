import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Cookies from "js-cookie";

const Navbar = () => {
	return (
		<div className='w-full absolute left-0 flex justify-between text-white font-medium text-xl text-center h-[50px] bg-blue-500'>
			<h2 className='ml-[50px] m-auto'>University of Central Asia</h2>
			<Logout />
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

export default Navbar;
