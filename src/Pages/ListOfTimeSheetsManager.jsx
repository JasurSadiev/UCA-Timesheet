import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Logout } from "../Components/Navbar";

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
				console.error(error);
			});
	}

	useEffect(() => {
		fetchUpdatedTimesheets();
	}, [accessToken]);

	return (
		<div className='w-screen flex flex-col'>
			<h1 className='text-center text-2xl font-bold mb-[100px]'>
				Pending Timesheets
			</h1>
			<div className='absolute flex self-end w-full text-center my-auto mt-4'>
				<Logout />
			</div>

			<table className='w-2/3 m-auto'>
				<thead>
					<tr>
						<th>Timesheet ID</th>
						<th>Author</th>
						<th>Month</th>
						<th>Year</th>
						<th>Status</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{timesheets &&
						timesheets.map((timesheet) => (
							<tr className='text-center' key={timesheet.timesheet_id}>
								<td>{timesheet.timesheet_id}</td>
								<td>
									{timesheet.author.first_name} {timesheet.author.last_name}
								</td>
								<td>{timesheet.month}</td>
								<td>{timesheet.year}</td>
								<td>{timesheet.status}</td>
								<td>
									<Link
										to={`/manager/review`}
										onClick={() =>
											setCurrentTimesheetIdManager(timesheet.timesheet_id)
										}
										className='bg-blue-400 block w-full h-full border-2 rounded-none'
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
