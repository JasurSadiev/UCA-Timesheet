import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

import TimesheetLogo from "../assets/timesheet_logo.svg";
import InboxLogo from "../assets/inbox_logo.svg";
import ReportLogo from "../assets/reportLogo.svg";
import WorkingHoursIcon from "../assets/WorkingHoursIcon.svg";
import Navbar, { Logout } from "../Components/Navbar";

const Main = () => {
	const [userInfo, setUserInfo] = useState(null);
	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();

	const accessToken = auth.accessToken;

	const [pendings, setPendings] = useState(0);
	const [loading, setLoading] = useState(true);

	const USERINFO = "/user/me";

	console.log(pendings);

	// console.log(userInfo);
	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("/user/manager/timesheets/filter", {
					params: { status: "pending" },
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
						withCredentials: true,
					},
				});

				// Update the state with the number of pending timesheets
				setPendings(response.data.length);
			} catch (error) {
				console.error("Error fetching data:", error);
				if (error.response.status === 401) {
					navigate("/");
				}
			}
		};

		// Only fetch data if the user is a manager
		if (userInfo) {
			fetchData();
		}
	}, [userInfo]);

	useEffect(() => {
		if (accessToken) {
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
						setAuth((prevData) => ({ ...prevData, userInfo: response.data }));
						setLoading(false);
					})
					.catch((error) => {
						console.log(error);
						setLoading(false);
						if (error.response.status === 401) {
							navigate("/");
						}
					});
			} catch (error) {
				console.error("Error:", error);

				// Handle other errors
				setLoading(false);
			}
		}
	}, [accessToken]);

	return (
		<>
			{loading && userInfo ? (
				<p>Loading...</p>
			) : userInfo ? (
				<div className='flex bg-gradient-to-bl from-[#d8e7f5] to-[#afcce700] h-screen  w-screen overflow-hidden flex-col'>
					<Navbar />
					<div className='flex'>
						<p className='font-semibold mt-8 ml-10 text-2xl'>
							Welcome back,{" "}
							<span>
								{userInfo.first_name} {userInfo.last_name}
							</span>
							!
						</p>
						{/* <Logout /> */}
					</div>
					<div className='mt-[15%] ml-10 flex gap-x-10 text-center'>
						<Link
							to={"/my-timesheets"}
							className='w-[200px] h-[200px] text-[22px] shadow-md font-semibold my-auto bg-white rounded-2xl'
						>
							<p className='text-black mt-4'>My Timesheets</p>
							<img src={TimesheetLogo} alt='' className='w-1/2 m-auto mt-4' />
						</Link>
						<Link
							to={"/pending-timesheets"}
							className='w-[200px] h-[200px] text-[22px] shadow-md font-semibold my-auto bg-white rounded-2xl'
						>
							<p className='text-black mt-4'>Inbox</p>
							<span className='text-white font-medium text-[12px] bg-[#FA7E7E] rounded-full px-[12px] py-[6px] ml-[40%]'>
								{pendings}
							</span>
							<img src={InboxLogo} alt='' className=' m-auto' />
						</Link>
						{!userInfo.is_admin && (
							<Link
								to={"/pending-timesheets"}
								className='w-[200px] h-[200px] text-[22px] shadow-md font-semibold my-auto bg-white rounded-2xl'
							>
								<p className='text-black mt-4'>Report</p>

								<img src={ReportLogo} alt='' className=' mx-auto mt-[1.5em]' />
							</Link>
						)}
						<Link
							to={"/holidays"}
							className='w-[200px] h-[200px] text-[22px] shadow-md font-semibold my-auto bg-white rounded-2xl'
						>
							<p className='text-black mt-4'>Holidays</p>
							<img src={TimesheetLogo} alt='' className='w-1/2 m-auto mt-4' />
						</Link>
						<Link
							to={"/working-hours"}
							className='w-[200px] h-[200px] text-[22px] shadow-md font-semibold my-auto bg-white rounded-2xl'
						>
							<p className='text-black mt-4'>Working Hours</p>
							<img
								src={WorkingHoursIcon}
								alt=''
								className='w-1/2 m-auto mt-4'
							/>
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
