import React from "react";
import axios from "../../api/axios";

import { useNavigate } from "react-router-dom";

const Reject = ({ currentTimesheetIdManager, accessToken }) => {
	const navigate = useNavigate();

	const REJECTTIMESHEET = `/timesheets/reject/${currentTimesheetIdManager}`;
	function rejectTimesheet() {
		axios
			.post(
				REJECTTIMESHEET,
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
			onClick={rejectTimesheet}
			className='py-1 border-2 w-32 shadow-xl text-red-400 bg-white font-semibold'
		>
			Reject
		</button>
	);
};

export default Reject;
