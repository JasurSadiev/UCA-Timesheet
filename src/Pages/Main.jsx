import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

import TimesheetLogo from "../assets/timesheetLogo.png";
import { Logout } from "../Components/Navbar";

const Main = () => {
	const [userInfo, setUserInfo] = useState(null);
	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();

	const accessToken = auth.accessToken;

	const [pendings, setPendings] = useState(0);
	const [loading, setLoading] = useState(true);

	const USERINFO = "/user/me";

	useEffect(() => {
		const fetchData = async () => {
			if (userInfo && userInfo.id === userInfo.manager_id && !loading) {
				try {
					const response = await axios.get("/user/manager/timesheets/filter", {
						params: { status: "pending" },
						headers: {
							Authorization: `Bearer ${accessToken}`,
							"Content-Type": "application/json",
							withCredentials: true,
						},
					});

					console.log(response.data);
				} catch (error) {
					console.error("Error fetching data:", error);
				}
			}
		};

		fetchData();
	}, [userInfo, accessToken, loading]);

	useEffect(() => {
		try {
			axios
				.get(USERINFO, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
						withCredentials: true,
					},
				})
				.then((response) => {
					setUserInfo(response.data);
					setLoading(false);
				})
				.catch((error) => {
					console.log(error);
					setLoading(false);
				});
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	}, [accessToken]);

	return (
		<>
			{loading ? (
				<p>Loading...</p>
			) : userInfo ? (
				<div className='flex bg-[#adc7e1] h-screen flex-col'>
					<div className='flex'>
						<p className='font-bold mt-4 ml-10 text-2xl'>
							Welcome back, <span>{userInfo.first_name}</span>!
						</p>
						<Logout />
					</div>
					<div className='mt-[30%] ml-10 flex gap-x-10 text-center'>
						<Link
							to={"/my-timesheets"}
							className='w-[200px] h-[200px] text-xl bg-white shadow-2xl'
						>
							<p className='text-black '>My Timesheets</p>
							<img src={TimesheetLogo} alt='' className='w-1/2 m-auto mt-6' />
						</Link>
						<Link
							to={"/pending-timesheets"}
							className='w-[200px] h-[200px] bg-white shadow-2xl'
						>
							<p className='text-black mb-10 text-xl'>Inbox</p>
							<span className='text-red-400 font-semibold text-[40px]'>
								{pendings}
							</span>
						</Link>
					</div>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</>
	);
};

export default Main;
