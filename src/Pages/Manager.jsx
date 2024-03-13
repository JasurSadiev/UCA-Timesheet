import React, { useEffect, useState } from "react";
import Review from "../Components/ManagerComponents/Review";
import Buttons from "../Components/ManagerComponents/Buttons";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";

const Manager = ({ currentTimesheetIdManager }) => {
	const [timesheets, setTimesheets] = useState(null);
	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();
	const accessToken = auth.accessToken;
	const MANAGERTIMESHEETS = "/user/manager/timesheets";

	console.log(timesheets);

	useEffect(() => {
		try {
			axios
				.get(MANAGERTIMESHEETS, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
						withCredentials: true,
					},
				})
				.then((response) => {
					setTimesheets(response.data);
				});
		} catch (error) {
			console.log(error);
		}
	}, [accessToken]);

	return (
		<>
			{timesheets ? (
				<div className='w-screen min-h-screen overflow-x-hidden bg-gradient-to-bl from-[#d8e7f5] to-[#afcce700]'>
					<Navbar />
					{/* <WelcomeBack /> */}
					<Review currentTimesheetIdManager={currentTimesheetIdManager} />
					{timesheets.status !== "approved" && (
						<Buttons
							currentTimesheetIdManager={currentTimesheetIdManager}
							accessToken={accessToken}
						/>
					)}
				</div>
			) : (
				<p>Loading</p>
			)}
		</>
	);
};

const WelcomeBack = () => {
	return (
		<p className='ml-[100px] mt-10 text-black text-[32px] font-bold'>
			Welcome back, Username!
		</p>
	);
};

export default Manager;
