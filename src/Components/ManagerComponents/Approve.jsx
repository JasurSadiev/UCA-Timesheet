import React from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const Approve = ({ currentTimesheetIdManager, accessToken }) => {
	const navigate = useNavigate();

	const APPROVETIMESHEET = `/timesheets/approve/${currentTimesheetIdManager}`;
	function approveTimesheet() {
		axios
			.post(
				APPROVETIMESHEET,
				{},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			)
			.then((response) => {
				console.log(response);
				navigate("/pending-timesheets");
			});
	}
	return (
		<button
			onClick={approveTimesheet}
			className='w-32 py-1 border-2 text-white shadow-xl bg-green-500 font-semibold'
		>
			Approve
		</button>
	);
};

export default Approve;
