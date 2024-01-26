import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { Logout } from "../Components/Navbar";

const ListOfTimesheets = ({ setCurrentTimesheetId }) => {
	const [timesheets, setTimesheets] = useState(null);
	const [createTimesheetModal, setCreateTimesheetModal] = useState(false);
	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();

	const accessToken = auth.accessToken;
	const MYTIMESHEETS = "/user/timesheets";

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
				console.log(response.data);
				setTimesheets(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	useEffect(() => {
		fetchUpdatedTimesheets();
	}, [accessToken]);

	function makeDraft(id) {
		axios
			.put(
				`/timesheets/${id}`,
				{ status: "draft" },
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
				fetchUpdatedTimesheets();
			})
			.catch((error) => {
				console.error(error);
			});
	}

	return (
		<div className='w-screen flex flex-col'>
			<h1 className='text-center text-2xl font-bold mb-[100px]'>
				My Timesheets
			</h1>
			<div className='absolute flex self-end w-full text-center my-auto mt-4'>
				<Logout />
			</div>

			{createTimesheetModal && (
				<CreateTimesheetModal
					accessToken={accessToken}
					setCreateTimesheetModal={setCreateTimesheetModal}
					fetchUpdatedTimesheets={fetchUpdatedTimesheets}
				/>
			)}

			<table className='w-2/3 m-auto'>
				<caption className='ml-[80%] w-[auto]'>
					<button
						onClick={() => {
							setCreateTimesheetModal(!createTimesheetModal);
						}}
						className='px-2 py-2 border-none rounded-none mb-2 text-white font-semibold bg-green-600'
					>
						Create New Timesheet
					</button>
				</caption>
				<thead>
					<tr>
						<th>Timesheet ID</th>
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
								<td>{timesheet.month}</td>
								<td>{timesheet.year}</td>
								<td>{timesheet.status}</td>
								<td>
									{timesheet.status == "pending" ? (
										<button
											onClick={() => makeDraft(timesheet.timesheet_id)}
											className='bg-yellow-400 w-full h-full border-2 rounded-none'
										>
											Make Draft
										</button>
									) : (
										<Link
											to={`/timesheet`}
											onClick={() =>
												setCurrentTimesheetId(timesheet.timesheet_id)
											}
											className='bg-blue-400 block w-full h-full border-2 rounded-none'
										>
											Edit
										</Link>
									)}
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

const CreateTimesheetModal = ({
	accessToken,
	setCreateTimesheetModal,
	fetchUpdatedTimesheets,
}) => {
	const [month, setMonth] = useState(1);
	const [year, setYear] = useState(1900);

	function handleCreateTimesheet(e) {
		e.preventDefault();

		axios
			.post(
				"/timesheets",
				{ month: Number(month), year: Number(year) },
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
					},
					withCredentials: true,
				}
			)
			.then((response) => {
				console.log(response.data);
				fetchUpdatedTimesheets();
				setCreateTimesheetModal(false);
			});
	}

	return (
		<div className='absolute w-screen h-screen bg-gray-800/80'>
			<form className='flex w-[700px] mt-[20%] flex-col rounded-md items-center bg-white m-auto'>
				<h2 className='text-center text-black font-semibold text-xl'>
					Choose Month and Year to Create a New Timesheet
				</h2>
				<div className='flex flex-col'>
					<label htmlFor='month'>Month</label>
					<input
						type='number'
						value={month}
						onChange={(e) => setMonth(e.target.value)}
						name='month'
						id='month'
						className='w-[400px] border-black border-2 text-black rounded-sm pl-2'
					/>
				</div>
				<div className='flex flex-col'>
					<label htmlFor='year' className='self-start'>
						Year
					</label>
					<input
						type='number'
						name='year'
						id='year'
						value={year}
						onChange={(e) => setYear(e.target.value)}
						className='w-[400px] border-black border-2 text-black rounded-sm pl-2'
					/>
				</div>
				<button
					onClick={(e) => handleCreateTimesheet(e)}
					className='self-end mt-10 mr-[150px] px-4 py-1 border-none rounded-md bg-green-600 text-white'
				>
					Create
				</button>
			</form>
		</div>
	);
};

export default ListOfTimesheets;
