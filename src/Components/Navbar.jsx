import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
	return (
		<div className='w-full absolute left-0 flex justify-between text-white font-medium text-xl text-center h-[50px] bg-blue-500'>
			<h2 className='ml-[50px] m-auto'>University of Central Asia</h2>
			<Link to='/login'>
				<h2 className='mr-[50px] m-auto'>Logout</h2>
			</Link>
		</div>
	);
};

export default Navbar;
