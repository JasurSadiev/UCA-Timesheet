import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import InputDate from "../Components/TableComponents/InputDate";
import InputText from "../Components/TableComponents/InputText";
import MainTable from "../Components/MainTable";
import Navbar from "../Components/Navbar";
import AddRowModal from "../Components/AddRowModal";
import useAuth from "../hooks/useAuth";
import Status from "../Components/Status";

const TablePage = ({ currentTimesheetId }) => {
	const [tableData, setTableData] = useState("");
	const [days, setDays] = useState(30);
	const [timeSheet, setTimeSheet] = useState(false);
	const [updateTimeSheet, setUpdateTimeSheet] = useState(false);
	const [isOpen, setisOpen] = useState(false);
	const [order, setOrder] = useState({});
	const NEW_RECORD_API = "/records";

	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();

	const apiUrl = `/timesheets/${currentTimesheetId}`;
	let accessToken = auth.accessToken;

	console.log(tableData.author);

	function getTimesheet() {
		axios
			.get(apiUrl, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
				},
			})
			.then((response) => {
				// console.log("Response from server:", response.data);
				setTableData(response.data);
				setDays(
					response.data.records && response.data.records[0]
						? response.data.records[0].daily_hours.length
						: 30
				);
				// Handle the response as needed
			})
			.catch((error) => {
				console.error("Error:", error);
				// Handle errors
			});
	}

	useEffect(() => {
		getTimesheet();
	}, []);

	console.log(order.order_id);
	const NewRecord = async () => {
		const timesheetId = tableData.timesheet_id;
		const randomNumber = (Math.floor(Math.random() * 100000) + 1).toString();

		try {
			const response = await axios.post(
				NEW_RECORD_API,
				JSON.stringify({
					timesheet_id: timesheetId,
					external_id: randomNumber,
					order_id: order.order_id,
				}),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			console.log(JSON.stringify(response?.data));
			getTimesheet();
			// getTimeSheet(true);
			// window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	if (!tableData || tableData.length === 0) {
		// If data is still loading or there is no data, you can render a loading spinner or a message.
		return <p>Loading...</p>;
	}

	// console.log(tableData[0].author.city);

	return (
		<div className='flex flex-col max-w-screen'>
			<Navbar />
			<Status status={tableData.status} />
			<h1 className='text-center mb-10 text-3xl font-bold mt-[20px]'>
				University of Central Asia
			</h1>
			<div className='mx-4'>
				<div className='flex justify-between'>
					<InputText labelText={"DUTY STATION"} value={tableData.author.city} />
					<div className='flex flex-col text-center mb-8'>
						<h3 className='text-xl font-semibold'>MONTHLY TIME SHEET</h3>
						<p className='text-lg font-medium'>FOR PERIOD ENDING</p>
					</div>
					<InputText labelText={"POSITION"} value={tableData.author.position} />
				</div>
				<div className='flex justify-between'>
					<InputText
						labelText={"EMPLOYEE NAME (PLEASE PRINT)"}
						value={`${tableData.author.first_name} ${tableData.author.last_name} ID: ${tableData.author.user_id}`}
					/>
					<div className='flex gap-x-4'>
						<InputDate labelText={"month"} value={tableData.month} />
						<InputDate labelText={"year"} value={tableData.year} />
					</div>
					<InputText
						labelText={"DEPARTMENT"}
						value={tableData.author.department}
					/>
				</div>
				<AddRowModal
					isOpen={isOpen}
					onClose={setisOpen}
					order={order}
					setOrder={setOrder}
					newRecord={NewRecord}
				/>
				<MainTable
					tableData={tableData}
					setTableData={setTableData}
					getTimeSheet={setTimeSheet}
					timeSheet={timeSheet}
					isOpen={isOpen}
					setisOpen={setisOpen}
					order={order}
					setOrder={setOrder}
					currentTimesheetId={currentTimesheetId}
					accessToken={accessToken}
					days={days}
				/>
			</div>
		</div>
	);
};

export default TablePage;
