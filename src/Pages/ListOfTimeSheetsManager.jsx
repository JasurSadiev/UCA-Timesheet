import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Navbar, { Logout } from "../Components/Navbar";

const ListOfTimesheetsManager = ({ setCurrentTimesheetIdManager }) => {
	const [timesheets, setTimesheets] = useState(null);
	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();

	const accessToken = auth.accessToken;
	const MYTIMESHEETS = "/user/manager/timesheets";

	function fetchUpdatedTimesheets() {
		axios
			.get(MYTIMESHEETS, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
					withCredentials: true,
				},
			})
			.then((response) => {
				// console.log(response.data);
				setTimesheets(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}

	useEffect(() => {
		fetchUpdatedTimesheets();
	}, [accessToken]);

	function statusColor(status) {
		if (status == "draft") {
			return "bg-[#C5DAFB] text-[#428AF8]";
		} else if (status == "approved") {
			return "bg-[#D1FAE5] text-[#3A9E75]";
		} else if (status == "rejected") {
			return "bg-[#FFD0D0] text-[#EF4444]";
		} else {
			return "bg-[#FEF3C7] text-[#E07706]";
		}
	}

	function getMonthName(monthId) {
		const months = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];

		return months[monthId - 1];
	}

	return (
		<div className='w-screen flex flex-col bg-gradient-to-bl from-[#d8e7f5] to-[#afcce700] min-h-screen'>
			<Navbar />
			<h1 className='text-center mt-8 text-2xl font-bold mb-[100px]'>
				Pending Timesheets
			</h1>
			{/* <div className='absolute flex self-end w-full text-center my-auto mt-4'>
				<Logout />
			</div> */}

			<table className='w-2/3 mx-auto  bg-white border-[#EBEFF5]'>
				<thead>
					<tr className='border-[#EBEFF5] font-semibold'>
						<th className='border-[#EBEFF5] font-semibold'>Timesheet ID</th>
						<th className='border-[#EBEFF5] font-semibold'>Author</th>
						<th className='border-[#EBEFF5] font-semibold'>Month</th>
						<th className='border-[#EBEFF5] font-semibold'>Year</th>
						<th className='border-[#EBEFF5] font-semibold'>Status</th>
						<th className='border-[#EBEFF5] font-semibold'></th>
					</tr>
				</thead>
				<tbody className='border-[#EBEFF5]'>
					{timesheets &&
						timesheets.map((timesheet) => (
							<tr className='text-center' key={timesheet.timesheet_id}>
								<td className='text-center border-[#EBEFF5]'>
									{timesheet.timesheet_id}
								</td>
								<td className='text-center border-[#EBEFF5]'>
									{timesheet.author.first_name} {timesheet.author.last_name}
								</td>
								<td className='text-center border-[#EBEFF5]'>
									{getMonthName(timesheet.month)}
								</td>
								<td className='text-center border-[#EBEFF5]'>
									{timesheet.year}
								</td>
								<td
									className={`border-[#efe9e9] py-1 ${statusColor(
										timesheet.status
									)} `}
								>
									{timesheet.status}
								</td>
								<td className='py-1.5 border-[#efe9e9] bg-[#2F3C48]'>
									<Link
										to={`/manager/review`}
										onClick={() =>
											setCurrentTimesheetIdManager(timesheet.timesheet_id)
										}
										className='block w-full h-full rounded-none'
									>
										View
									</Link>
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

export default ListOfTimesheetsManager;
