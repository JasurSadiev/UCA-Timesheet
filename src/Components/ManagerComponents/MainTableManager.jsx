import React, { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { v4 as uuidv4 } from "uuid";
import { getWeekOfDay } from "../HolidaysAndWeekends";

const MainTableManager = ({
	tableData,
	setTableData,
	getTimeSheet,
	timeSheet,
	isOpen,
	setisOpen,
	order,
	setOrder,
	days,
	currentTimesheetIdManager,
	accessToken,
}) => {
	const [rowCount, setRowCount] = useState(
		tableData.records ? tableData.records.length : 0
	); // Initial number of rows
	const [comments, setComments] = useState(
		tableData.comment ? tableData.comment : ""
	);
	const [totalHours, setTotalHours] = useState(
		Array(tableData.records ? tableData.records.length : 0).fill(0)
	);
	const [tableTotalHours, setTableTotalHours] = useState(0);

	const [tableTotal, setTableTotal] = useState(Array(days + 2).fill(0));

	const UPDATE_DAILY_HOURS_API = "/daily-hours";

	const navigate = useNavigate();

	function modalState() {
		setisOpen(!isOpen);
	}

	const handleInputChange = async (rowIndex, columnName, value) => {
		setTableData((prevTableData) => {
			const newTableData = JSON.parse(JSON.stringify(prevTableData));

			newTableData.records[rowIndex].daily_hours[columnName - 1].hours =
				value || "";
			return newTableData;
		});
		try {
			const daily_hours_id =
				tableData.records[rowIndex].daily_hours[columnName - 1]
					.daily_hours_id || "";
			const response = await axios.put(
				`${UPDATE_DAILY_HOURS_API}/${daily_hours_id}`,
				JSON.stringify({
					hours: Number(value),
				}),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);

			console.log("Update Successful");
			// Handle success, update state, or perform other actions
		} catch (error) {
			if (error.response && error.response.status === 401) {
				navigate("/");
			}
			console.error("Error updating data", error);
			// Handle error, show an error message, or perform other actions
		}
	};

	useEffect(() => {
		generateTableData(tableData.records ? tableData.records.length : 0, days);

		setRowCount(tableData.records ? tableData.records.length : 0);
	}, [tableData]);

	useEffect(() => {
		if (tableData.records) {
			let rows_total_hours = Array(tableData.records.length).fill(0);
			for (let j = 0; j < tableData.records.length; j++) {
				let hours = tableData.records[j].daily_hours;
				for (let i = 0; i < hours.length; i++) {
					rows_total_hours[j] += Number(hours[i].hours);
				}
			}
			setTotalHours(rows_total_hours);

			let newTotalHours = 0;
			for (let k = 0; k < rows_total_hours.length; k++) {
				newTotalHours += rows_total_hours[k];
			}
			setTableTotalHours(newTotalHours);
		}
	}, [tableData]);

	useLayoutEffect(() => {
		function calculateTotals() {
			if (tableData.records) {
				let currentTotals = Array(days + 2).fill(0);
				for (let j = 0; j < tableData.records.length; j++) {
					let hours = tableData.records[j].daily_hours;
					for (let i = 0; i < hours.length; i++) {
						if (i === 0) {
							currentTotals[i + 1] = tableTotalHours;
						}
						currentTotals[i + 2] += Number(hours[i].hours);
					}
				}
				setTableTotal(currentTotals);
			}
		}
		calculateTotals();
	}, [tableData, tableTotalHours, totalHours]);

	// const NewRecord = async (e) => {
	// 	const timesheetId = tableData[0].timesheet_id;
	// 	const orderId = order.orderId;
	// 	const randomNumber = Math.floor(Math.random() * 100000) + 1;
	// 	const randomNumber2 = Math.floor(Math.random() * 100000) + 1;
	// 	console.log(timesheetId, orderId, randomNumber);
	// 	try {
	// 		const response = await axios.post(
	// 			NEW_RECORD_API,
	// 			JSON.stringify({
	// 				timesheet_id: timesheetId,
	// 				external_id: randomNumber,
	// 				order_id: orderId,
	// 			}),
	// 			{
	// 				headers: { "Content-Type": "application/json" },
	// 				withCredentials: true,
	// 			}
	// 		);
	// 		console.log(JSON.stringify(response?.data));
	// 		getTimeSheet(true);
	// 		// window.location.reload();
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	const generateFirstRowHeaders = () => {
		const headers = [
			"Charging Code/Project",
			"Hours",
			...Array.from({ length: days }, (_, index) => index + 1),
		];

		return headers.map((header, index) => (
			<th
				key={index}
				className={getWeekOfDay(
					index - 1,
					tableData.year,
					tableData.month,
					tableData.author.city
				)}
				colSpan={`${index === 0 ? "7" : "1"}`}
			>
				{header}
			</th>
		));
	};

	// Function to generate the table headers for the second row
	const generateSecondRowHeaders = () => {
		const headers = [
			"Code",
			"Internal Order",
			"Name",
			"Budget",
			"Start Date",
			"End Date",
			"%",
		];

		return [
			...headers.map((header, index) => (
				<th
					key={index}
					className={`${
						header === "%"
							? "max-w-[100px] w-[50px] text-[14px]"
							: "max-w-[200px] w-[100px] text-[14px]"
					}`}
				>
					{header}
				</th>
			)),
			...Array.from({ length: days + 1 }).map((_, index) => (
				<td key={headers.length + index} className=' text-[12px] bg-gray-300'>
					<input
						type='text'
						disabled
						className='w-[20px] bg-gray-300 focus:border-none active:border-none focus:outline-none text-center'
					/>
				</td>
			)),
		];
	};

	const generateTotalRow = () => (
		<tr>
			<th colSpan='6' className='text-[14px]'>
				TOTAL
			</th>
			{tableTotal.map((total, index) => (
				<th className='text-[14px]' key={index}>
					{total.toFixed(0)}
				</th>
			))}
		</tr>
	);

	// function generateTableRows(rowCount, colCount){
	// 	for (let i=0; i<tableData[0].records.length; i++){
	// 		generateTableData(rowCount, colCount)
	// 	}
	// }

	// Function to generate the table data cells
	const generateTableData = (numRows, numColumns) => {
		const rows = Array.from({ length: numRows }, (_, rowIndex) => (
			<tr key={rowIndex} className=''>
				<td className='max-w-[200px] w-[125px]'>
					<input
						type='text'
						value={tableData.records[rowIndex].grant_id ?? ""}
						onChange={(e) =>
							handleInputChange(
								rowIndex,
								"Charging Code/Project",
								e.target.value
							)
						}
						className='w-[100%] focus:border-none active:border-none focus:outline-none text-center text-[14px]'
					/>
				</td>
				<td className='max-w-[200px] w-[125px]'>
					<input
						type='text'
						value={tableData.records[rowIndex].order_id || ""}
						onChange={(e) =>
							handleInputChange(rowIndex, "Internal Order", e.target.value)
						}
						className='w-[100%] focus:border-none active:border-none focus:outline-none text-center text-[14px]'
					/>
				</td>
				<td className='max-w-[200px] w-[125px]'>
					<input
						type='text'
						value={tableData.records[rowIndex].grand_description || ""}
						onChange={(e) =>
							handleInputChange(rowIndex, "Name", e.target.value)
						}
						className='w-[100%] focus:border-none active:border-none focus:outline-none text-center text-[14px]'
					/>
				</td>
				<td className='max-w-[200px] w-[125px]'>
					<input
						type='text'
						value={tableData.records[rowIndex].balance || ""}
						onChange={(e) =>
							handleInputChange(rowIndex, "Budget", e.target.value)
						}
						className='w-[100%] focus:border-none active:border-none focus:outline-none text-center text-[14px]'
					/>
				</td>
				<td className='max-w-[200px] w-[125px]'>
					<input
						type='text'
						// value={tableData[0].records[rowIndex].start_date || ""}
						value={
							new Date(
								tableData.records[rowIndex].start_date
							).toLocaleDateString("en-US", {
								day: "numeric",
								month: "long",
								year: "numeric",
							}) || ""
						}
						onChange={(e) =>
							handleInputChange(rowIndex, "Start Date", e.target.value)
						}
						className='w-[100%] focus:border-none active:border-none focus:outline-none text-center text-[14px]'
					/>
				</td>
				<td className='max-w-[200px] w-[125px]'>
					<input
						type='text'
						value={
							new Date(tableData.records[rowIndex].end_date).toLocaleDateString(
								"en-US",
								{
									day: "numeric",
									month: "long",
									year: "numeric",
								}
							) || ""
						}
						onChange={(e) =>
							handleInputChange(rowIndex, "End Date", e.target.value)
						}
						className='w-[100%] focus:border-none active:border-none focus:outline-none text-center text-[14px]'
					/>
				</td>
				<td className='max-w-[100px] w-[50px]'>
					<input
						type='text'
						value={tableData[rowIndex]?.["%"] || ""}
						onChange={(e) => handleInputChange(rowIndex, "%", e.target.value)}
						className='w-[100%] focus:border-none active:border-none focus:outline-none text-center text-[14px]'
					/>
				</td>
				<td className='max-w-[50px] w-[25px]'>
					<input
						type='text'
						value={totalHours[rowIndex]}
						onChange={(e) =>
							handleInputChange(rowIndex, "Hours", e.target.value)
						}
						className='w-[100%] focus:border-none active:border-none focus:outline-none text-center text-[14px]'
					/>
				</td>
				{/* Add input fields for the remaining columns */}
				{Array.from({ length: numColumns }, (_, colIndex) => (
					<td key={colIndex} className=''>
						<p
							type='text'
							value={
								tableData.records[rowIndex].daily_hours[colIndex].hours
									? tableData.records[rowIndex].daily_hours[colIndex].hours
									: ""
							}
							onChange={(e) =>
								handleInputChange(rowIndex, colIndex + 1, e.target.value)
							}
							className='w-[100%] h-[20px] focus:border-none active:border-none focus:outline-none text-center text-[14px]'
						>
							{tableData.records[rowIndex].daily_hours[colIndex].hours
								? tableData.records[rowIndex].daily_hours[colIndex].hours
								: ""}
						</p>
					</td>
				))}
			</tr>
		));

		return rows;
	};

	// const addRow = () => {
	// 	setTableData((prevData) => {
	// 		return [...prevData, createEmptyRow(37)];
	// 	});
	// 	setRowCount((prevCount) => prevCount + 1);
	// };

	const handleCommentsChange = (e) => {
		axios
			.put(
				`/timesheets/${currentTimesheetIdManager}`,
				{ comment: e.target.value },
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
				// fetchUpdatedTimesheets();
			})
			.catch((error) => {
				console.error(error);
			});
		setComments(e.target.value);
	};

	return (
		<div className=' max-w-screen mt-[50px] pb-10 overflow-x-hidden'>
			<table className='max-w-screen'>
				<thead>
					<tr>{generateFirstRowHeaders()}</tr>
					<tr>{generateSecondRowHeaders()}</tr>
				</thead>
				<tbody>
					{tableData.records && generateTableData(rowCount, days)}

					{generateTotalRow()}
				</tbody>
				<tfoot>
					<tr>
						<td colSpan='39'>
							<textarea
								value={comments}
								onChange={handleCommentsChange}
								className='w-full h-16 p-2 focus:outline-none'
								placeholder='Add your comments here...'
							></textarea>
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
};

export default MainTableManager;
