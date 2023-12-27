import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
	return (
		<div>
			<div>
				<img src='' alt='' />
				<h1>
					University <br />
					of Central Asia
				</h1>
			</div>
			<div>
				<ul>
					<li>
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
