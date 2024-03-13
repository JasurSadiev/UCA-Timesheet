import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Navbar, { Logout } from "../Components/Navbar";

const ListOfHolidays = ({ setCurrentTimesheetId }) => {
	const [holiday, setHoliday] = useState({});
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

	return (
		<div className='w-screen min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-bl from-[#d8e7f5] to-[#afcce700]'>
			<Navbar />
			<h1 className='text-center mt-4 text-2xl font-bold mb-[100px]'>
				Holidays
			</h1>
			{/* <div className='absolute flex self-end w-full text-center my-auto mt-4'>
				<Logout />
			</div> */}

			{createTimesheetModal && <AddHolidayModal />}

			<table className='w-2/3 mx-auto bg-white border-[#EBEFF5]'>
				<caption className='ml-[75%] text-right w-[auto]'>
					<button
						onClick={() => {
							setCreateTimesheetModal(!createTimesheetModal);
						}}
						className='px-2 py-2 font-medium text-[18px] border-none mb-2 text-white bg-[#2F3C48] rounded-lg'
					>
						Create New Timesheet +
					</button>
				</caption>
				<thead>
					<tr className='border-[#EBEFF5] font-semibold'>
						<th className='border-[#EBEFF5] font-semibold'>Day</th>
						<th className='border-[#EBEFF5] font-semibold'>Month</th>
						<th className='border-[#EBEFF5] font-semibold'>Year</th>
						<th className='border-[#EBEFF5] font-semibold'>Description</th>
						<th className='border-[#EBEFF5] font-semibold'>Country</th>
						<th className='border-[#EBEFF5] font-semibold'></th>
					</tr>
				</thead>
				<tbody className='border-[#EBEFF5]'>
					{timesheets &&
						timesheets.map((timesheet) => (
							<tr
								className='text-center border-[#EBEFF5]'
								key={timesheet.timesheet_id}
							>
								<td className='border-[#EBEFF5] py-1'>
									{timesheet.timesheet_id}
								</td>
								<td className='border-[#EBEFF5] py-1'>{timesheet.month}</td>
								<td className='border-[#EBEFF5] py-1'>{timesheet.year}</td>
								<td
									className={`border-[#efe9e9] py-1 ${statusColor(
										timesheet.status
									)} `}
								>
									{timesheet.status}
								</td>
								<td className=' py-1.5 border-[#efe9e9] bg-[#2F3C48]'>
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
											className=' block w-full h-max rounded-none'
										>
											Open
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

const AddHolidayModal = () => {
	const [date, setDate] = useState("");
	const [description, setDescription] = useState("");
	const [country, setCountry] = useState("");
	const [holidays, setHolidays] = useState({});

	function handleCreateTimesheet(e) {
		e.preventDefault();
		const formattedDate = new Date(date).toLocaleDateString("en-GB");
		const [day, month, year] = formattedDate.split("/");
		const newHoliday = {
			[`${day}/${month}/${year}`]: {
				holidayDescription: description,
				country: country,
			},
		};
		setHolidays({ ...holidays, ...newHoliday });
		setDate("");
		setDescription("");
		setCountry("");
	}

	return (
		<div className='absolute w-screen h-screen bg-gray-800/80'>
			<form className='flex w-[700px] mt-[20%] flex-col rounded-md items-center bg-white m-auto'>
				<h2 className='text-center text-black font-semibold text-xl'>
					Choose the date of the holiday and provide description:
				</h2>
				<div className='flex flex-col'>
					<label htmlFor='month'>Month</label>
					<input
						type='date'
						value={date}
						onChange={(e) => setDate(e.target.value)}
						name='date'
						id='date'
						className='w-[400px] border-black border-2 text-black rounded-sm pl-2'
					/>
				</div>
				<div className='flex flex-col'>
					<label htmlFor='description'>Description</label>
					<input
						type='text'
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						name='description'
						id='description'
						className='w-[400px] border-black border-2 text-black rounded-sm pl-2'
					/>
				</div>
				<div className='flex flex-col'>
					<label htmlFor='country' className='self-start'>
						Country
					</label>
					<input
						type='text'
						name='country'
						id='country'
						value={country}
						onChange={(e) => setCountry(e.target.value)}
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
			<pre>{JSON.stringify(holidays, null, 4)}</pre>
		</div>
	);
};

export default ListOfHolidays;
