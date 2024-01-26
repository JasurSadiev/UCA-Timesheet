import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
	return (
		<div className='bg-black text-white flex justify-between items-center'>
			<div>
				<img src='' alt='' />
				<h1 className='text-[32px] font-mono text-blue-100 ml-[50px] font-bold'>
					UNIVERSITY <br /> OF CENTRAL ASIA
				</h1>
			</div>
			<div className='mr-20'>
				<ul className='flex gap-x-10'>
					<li className=''>
						<Link>HOME</Link>
					</li>
					<li>
						<Link>DASHBOARD</Link>
					</li>
					<li>
						<Link>RESOURCES</Link>
					</li>
					<li>
						<Link>SUPPORT</Link>
					</li>
					<li>
						<Link>MORE</Link>
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Nav;
