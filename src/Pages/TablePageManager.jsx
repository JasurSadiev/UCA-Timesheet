import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import InputDate from "../Components/TableComponents/InputDate";
import InputText from "../Components/TableComponents/InputText";
import MainTableManager from "../Components/ManagerComponents/MainTableManager";
import Navbar from "../Components/Navbar";
import AddRowModal from "../Components/AddRowModal";
import useAuth from "../hooks/useAuth";

const TablePageManager = ({ currentTimesheetIdManager }) => {
	const [tableData, setTableData] = useState("");
	const [timeSheet, setTimeSheet] = useState(false);
	const [isOpen, setisOpen] = useState(false);
	const [order, setOrder] = useState("");
	const NEW_RECORD_API = "/records";

	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		const apiUrl = `/timesheets/${currentTimesheetIdManager}`;
		let accessToken = auth.accessToken;

		// const header = `Authorization: Bearer ${accessToken}`;
		// Send a GET request using axios when the component mounts
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
				// Handle the response as needed
			})
			.catch((error) => {
				console.error("Error:", error);
				// Handle errors
			});
	}, [timeSheet]);

	const NewRecord = async () => {
		const timesheetId = tableData[0].timesheet_id;
		const orderId = order.orderId;
		const randomNumber = Math.floor(Math.random() * 100000) + 1;
		const randomNumber2 = Math.floor(Math.random() * 100000) + 1;
		try {
			const response = await axios.post(
				NEW_RECORD_API,
				JSON.stringify({
					timesheet_id: timesheetId,
					external_id: randomNumber,
					order_id: orderId,
				}),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			console.log(JSON.stringify(response?.data));
			getTimeSheet(true);
			// window.location.reload();
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!auth.accessToken) {
			navigate("/");
		}
	}, [auth]);

	if (!tableData || tableData.length === 0) {
		// If data is still loading or there is no data, you can render a loading spinner or a message.
		return <p>Loading...</p>;
	}

	// console.log(tableData[0].author.city);

	return (
		<div className='flex flex-col px-4 max-w-full bg-white'>
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
					value={`${tableData.author.first_name} ${tableData.author.last_name}`}
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
			<MainTableManager
				tableData={tableData}
				setTableData={setTableData}
				getTimeSheet={setTimeSheet}
				timeSheet={timeSheet}
				isOpen={isOpen}
				setisOpen={setisOpen}
				order={order}
				setOrder={setOrder}
			/>
		</div>
	);
};

export default TablePageManager;
