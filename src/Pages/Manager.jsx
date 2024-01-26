import React, { useEffect, useState } from "react";
import Nav from "../Components/ManagerComponents/Nav";
import Review from "../Components/ManagerComponents/Review";
import Buttons from "../Components/ManagerComponents/Buttons";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Manager = ({ currentTimesheetIdManager }) => {
	const [timesheets, setTimesheets] = useState(null);
	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();
	const accessToken = auth.accessToken;
	const MANAGERTIMESHEETS = "/user/manager/timesheets";
	useEffect(() => {
		console.log(accessToken);
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
	}, []);

	return (
		<div className='w-screen h-[100vh] bg-sky-600'>
			<Nav />
			{/* <WelcomeBack /> */}
			<Review currentTimesheetIdManager={currentTimesheetIdManager} />
			<Buttons
				currentTimesheetIdManager={currentTimesheetIdManager}
				accessToken={accessToken}
			/>
		</div>
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
