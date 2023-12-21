import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import InputDate from "../Components/TableComponents/InputDate";
import InputText from "../Components/TableComponents/InputText";
import MainTable from "../Components/MainTable";
import Navbar from "../Components/Navbar";

const TablePage = () => {
	const [tableDate, setTableDate] = useState("");
	const [timeSheet, setTimeSheet] = useState(false);
	useEffect(() => {
		const apiUrl = "/timesheets";

		// Send a GET request using axios when the component mounts
		axios
			.get(apiUrl)
			.then((response) => {
				// console.log("Response from server:", response.data);
				setTableDate(response.data);
				// Handle the response as needed
			})
			.catch((error) => {
				console.error("Error:", error);
				// Handle errors
			});
	}, [timeSheet]);

	if (!tableDate || tableDate.length === 0) {
		// If data is still loading or there is no data, you can render a loading spinner or a message.
		return <p>Loading...</p>;
	}

	// console.log(tableDate[0].author.city);

	return (
		<div className='flex flex-col px-4 max-w-screen'>
			<Navbar />
			<h1 className='text-center mb-20 text-3xl font-bold mt-[100px]'>
				University of Central Asia
			</h1>
			<div className='flex justify-between'>
				<InputText
					labelText={"DUTY STATION"}
					value={tableDate[0].author.city}
				/>
				<div className='flex flex-col text-center mb-8'>
					<h3 className='text-xl font-semibold'>MONTHLY TIME SHEET</h3>
					<p className='text-lg font-medium'>FOR PERIOD ENDING</p>
				</div>
				<InputText
					labelText={"POSITION"}
					value={tableDate[0].author.position}
				/>
			</div>
			<div className='flex justify-between'>
				<InputText
					labelText={"EMPLOYEE NAME (PLEASE PRINT)"}
					value={`${tableDate[0].author.first_name} ${tableDate[0].author.last_name}`}
				/>
				<div className='flex gap-x-4'>
					<InputDate labelText={"month"} value={tableDate[0].month} />
					<InputDate labelText={"year"} value={tableDate[0].year} />
				</div>
				<InputText
					labelText={"DEPARTMENT"}
					value={tableDate[0].author.department}
				/>
			</div>
			<MainTable
				tableData={tableDate}
				setTableData={setTableDate}
				getTimeSheet={setTimeSheet}
				timeSheet={timeSheet}
			/>
		</div>
	);
};

export default TablePage;
