import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Navbar, { Logout } from "../Components/Navbar";

const WorkingHours = () => {
	const [holiday, setHoliday] = useState({});
	const [monthlyWorkingHours, setMonthlyWorkingHours] = useState(null);
	const [countries, setCountries] = useState(null);
	const [addMonthlyWorkingHoursModal, setAddMonthlyWorkingHoursModal] =
		useState(false);
	const { auth, setAuth } = useAuth();
	const [selectedCountry, setSelectedCountry] = useState(
		auth.userInfo ? auth.userInfo.country_id : 113
	);
	const navigate = useNavigate();

	const accessToken = auth.accessToken;

	function fetchMonthlyWorkingHours() {
		axios
			.get(`/monthly-working-hours/country/${selectedCountry}`, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
					"Content-Type": "application/json",
					withCredentials: true,
				},
			})
			.then((response) => {
				console.log(response.data);
				setMonthlyWorkingHours(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	useEffect(() => {
		fetchMonthlyWorkingHours();
	}, [selectedCountry, addMonthlyWorkingHoursModal]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await axios.get("/countries", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setCountries(response.data);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const handleCountryChange = (e) => {
		setSelectedCountry(e.target.value);
	};

	function findCountryNameById(id) {
		if (countries) {
			const country = countries.find((country) => country.id === id);
			return country ? country.name : null;
		} else {
			return "Something Went Wrong!";
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

		// Ensure monthId is within valid range
		if (monthId < 1 || monthId > 12) {
			return "Invalid Month";
		}

		// Subtract 1 from monthId to match array indexing
		return months[monthId - 1];
	}

	const filteredCountries = countries
		? countries.filter(
				(country) =>
					country.name !== "Kyrgyzstan" &&
					country.name !== "Tajikistan" &&
					country.name !== "Pakistan" &&
					country.name !== "Kazakhstan"
		  )
		: [];

	const handleDeleteMontlyWorkingHours = (id) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this monthly working hours?"
		);
		if (confirmDelete) {
			axios
				.delete(`/monthly-working-hours/${id}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((response) => {
					console.log("Deleted successfully:", response);
					setMonthlyWorkingHours(
						monthlyWorkingHours.filter((hours) => hours.id !== id)
					);
					// Handle success
				})
				.catch((error) => {
					console.error("Error deleting:", error);
					// Handle error
				});
		}
	};

	return (
		<div className='w-screen min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-bl from-[#d8e7f5] to-[#afcce700]'>
			<Navbar />
			<h1 className='text-center mt-4 text-2xl font-bold mb-[100px]'>
				Monthly Working Hours
			</h1>

			{addMonthlyWorkingHoursModal && (
				<AddMonthlyWorkingHoursModal
					filteredCountries={filteredCountries}
					setAddMonthlyWorkingHoursModal={setAddMonthlyWorkingHoursModal}
					findCountryNameById={findCountryNameById}
				/>
			)}
			<div className=' flex w-2/3 mx-auto justify-between'>
				<select
					name='countryId'
					value={selectedCountry}
					onChange={handleCountryChange}
					className='text-[16px] rounded-lg my-1 px-2'
				>
					<option value=''>Select your Country</option>

					<option key={113} value={113}>
						Kyrgyzstan
					</option>
					<option key={204} value={204}>
						Tajikistan
					</option>
					<option key={109} value={109}>
						Kazakhstan
					</option>
					<option key={157} value={157}>
						Pakistan
					</option>
					{filteredCountries.map((country) => (
						<option key={country.id} value={country.id}>
							{country.name}
						</option>
					))}
				</select>
				<button
					onClick={() => {
						setAddMonthlyWorkingHoursModal(!addMonthlyWorkingHoursModal);
					}}
					className='px-2 py-2 font-medium text-[18px] border-none mb-2 text-white bg-[#2F3C48] rounded-lg'
				>
					Add New Monthly Working Hours +
				</button>
			</div>
			<table className='w-2/3 mx-auto bg-white border-[#EBEFF5]'>
				<thead>
					<tr className='border-[#EBEFF5] font-semibold'>
						<th className='border-[#EBEFF5] font-semibold'>Month</th>
						<th className='border-[#EBEFF5] font-semibold'>Year</th>
						<th className='border-[#EBEFF5] font-semibold'>Hours</th>
						<th className='border-[#EBEFF5] font-semibold'>Country</th>
						<th className='border-[#EBEFF5] font-semibold'></th>
					</tr>
				</thead>
				<tbody className='border-[#EBEFF5]'>
					{monthlyWorkingHours &&
						monthlyWorkingHours.map((hours) => (
							<tr className='text-center border-[#EBEFF5]' key={hours.id}>
								<td className='border-[#EBEFF5] py-1'>
									{getMonthName(hours.month)}
								</td>
								<td className='border-[#EBEFF5] py-1'>{hours.year}</td>
								<td className={`border-[#efe9e9] py-1  `}>
									{hours.working_hours}
								</td>
								<td className=' py-1.5 border-[#efe9e9] '>
									{findCountryNameById(hours.country_id)}
								</td>
								<td
									onClick={() => handleDeleteMontlyWorkingHours(hours.id)}
									className='border-[#EBEFF5] py-1 bg-red-700 text-white'
								>
									Delete
								</td>
							</tr>
						))}
				</tbody>
			</table>
		</div>
	);
};

const AddMonthlyWorkingHoursModal = ({
	filteredCountries,
	setAddMonthlyWorkingHoursModal,
	findCountryNameById,
}) => {
	const [country, setCountry] = useState("");
	const [newMonthlyWorkingHour, setNewMonthlyWorkingHour] = useState({
		month: "",
		year: "",
		country: "",
		hours: "",
	});

	const auth = useAuth();
	const accessToken = auth.accessToken;

	function handleAddTimesheet(e) {
		e.preventDefault();

		axios
			.post(
				"/monthly-working-hours",
				{
					country_id: Number(newMonthlyWorkingHour.country),
					month: Number(newMonthlyWorkingHour.month),
					working_hours: Number(newMonthlyWorkingHour.hours),
					year: Number(newMonthlyWorkingHour.year),
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)
			.then((response) => {
				console.log(
					"Monthly Working Hour has been added successfully:",
					response.data
				);
				setNewMonthlyWorkingHour({
					month: "",
					year: "",
					country: "",
					hours: "",
				});
			})
			.catch((error) => {
				console.error("Error adding holiday:", error);
				window.alert("Error adding holiday:", error);
				// Handle error if needed
			})
			.finally(() => {
				// This block will execute regardless of success or failure
				window.alert("Monthly Working Hour has been added successfully:");
			});
	}

	const handleClickOutside = (e) => {
		if (e.target.className === "absolute w-screen h-screen bg-gray-800/80") {
			setAddMonthlyWorkingHoursModal(false);
		}
	};

	const handleMonthChange = (e) => {
		const month = e.target.value;
		setNewMonthlyWorkingHour((prevState) => ({ ...prevState, month }));
	};

	const handleYearChange = (e) => {
		const year = e.target.value;
		setNewMonthlyWorkingHour((prevState) => ({ ...prevState, year }));
	};

	const handleCountryChange = (e) => {
		const country = e.target.value;
		setNewMonthlyWorkingHour((prevState) => ({ ...prevState, country }));
	};

	const handleHoursChange = (e) => {
		const hours = e.target.value;
		setNewMonthlyWorkingHour((prevState) => ({ ...prevState, hours }));
	};

	console.log(newMonthlyWorkingHour);

	return (
		<div
			className='absolute w-screen h-screen bg-gray-800/80'
			onClick={handleClickOutside}
		>
			<form className='flex w-[760px] mt-[10%] flex-col rounded-md items-center bg-white m-auto px-8 py-4'>
				<h2 className='text-center text-black font-semibold text-xl'>
					Add Working Hours within a Month:
				</h2>
				<div className='flex justify-between w-full ml-10'>
					<div className='flex flex-col gap-y-1'>
						<label htmlFor='month'>Month</label>
						<select
							id='monthSelect'
							className='w-[300px] border-2 border-[#E0E2E4] px-2 rounded-md'
							onChange={handleMonthChange}
						>
							<option value='01'>Select the month</option>
							<option value='01'>January</option>
							<option value='02'>February</option>
							<option value='03'>March</option>
							<option value='04'>April</option>
							<option value='05'>May</option>
							<option value='06'>June</option>
							<option value='07'>July</option>
							<option value='08'>August</option>
							<option value='09'>September</option>
							<option value='10'>October</option>
							<option value='11'>November</option>
							<option value='12'>December</option>
						</select>
					</div>
					<div className='flex flex-col gap-y-1'>
						<label htmlFor='description'>Year</label>
						<input
							type='text'
							value={newMonthlyWorkingHour.year}
							onChange={(e) => handleYearChange(e)}
							name='description'
							id='description'
							className='w-1/2 border-[#E0E2E4] border-2 rounded-md text-black  pl-2'
						/>
					</div>
				</div>
				<div className='flex justify-between w-full ml-10 mt-4'>
					<div className='flex flex-col gap-y-1'>
						<label htmlFor='country' className='self-start'>
							Country
						</label>
						<select
							name='countryId'
							value={newMonthlyWorkingHour.country}
							onChange={(e) => handleCountryChange(e)}
							className='w-[300px] border-[##E0E2E4] border-2 rounded-md text-black pl-2 py-0.5'
						>
							<option value=''>Select your Country</option>
							<option key={113} value={113}>
								Kyrgyzstan
							</option>
							<option key={204} value={204}>
								Tajikistan
							</option>
							<option key={109} value={109}>
								Kazakhstan
							</option>
							<option key={157} value={157}>
								Pakistan
							</option>
							{filteredCountries.map((country) => (
								<option key={country.id} value={country.id}>
									{country.name}
								</option>
							))}
						</select>
					</div>
					<div className='flex flex-col gap-y-1'>
						<label htmlFor=''>Hours</label>
						<input
							type='number'
							className='w-1/2 border-[#E0E2E4] border-2 text-black rounded-md pl-2'
							value={newMonthlyWorkingHour.hours}
							onChange={(e) => handleHoursChange(e)}
						/>
					</div>
				</div>
				<div className='flex justify-between w-full'>
					<button
						onClick={(bool) => setAddMonthlyWorkingHoursModal(!bool)}
						className='self-end mt-10 ml-[150px] px-4 py-1 border-none rounded-md bg-[#2F3C48] text-white'
					>
						Cancel
					</button>
					<button
						onClick={(e) => handleAddTimesheet(e)}
						className='self-end mt-10 mr-[150px] px-4 py-1 border-none rounded-md bg-green-600 text-white'
					>
						Create
					</button>
				</div>
			</form>
		</div>
	);
};

export default WorkingHours;
