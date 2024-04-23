import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import Navbar, { Logout } from "../Components/Navbar";

const ListOfHolidays = () => {
	const [holiday, setHoliday] = useState({});
	const [holidays, setHolidays] = useState(null);
	const [countries, setCountries] = useState(null);
	const [addHolidayModal, setAddHolidayModal] = useState(false);
	const { auth, setAuth } = useAuth();
	const [selectedCountry, setSelectedCountry] = useState(
		auth.userInfo ? auth.userInfo.country_id : "All"
	);
	const navigate = useNavigate();

	const accessToken = auth.accessToken;
	const HOLIDAYS = "/holidays";

	function fetchHolidays() {
		axios
			.get(
				selectedCountry === "All"
					? HOLIDAYS
					: `/holidays/country/${selectedCountry}`,
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json",
						withCredentials: true,
					},
				}
			)
			.then((response) => {
				console.log(response.data);
				setHolidays(response.data);
			})
			.catch((error) => {
				console.error(error);
			});
	}

	useEffect(() => {
		fetchHolidays();
	}, [selectedCountry]);

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

	const filteredCountries = countries
		? countries.filter(
				(country) =>
					country.name !== "Kyrgyzstan" &&
					country.name !== "Tajikistan" &&
					country.name !== "Pakistan" &&
					country.name !== "Kazakhstan"
		  )
		: [];

	const handleDeleteHoliday = (id) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this Holiday?"
		);
		if (confirmDelete) {
			axios
				.delete(`/holidays/${id}`, {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				})
				.then((response) => {
					console.log("Deleted successfully:", response);
					setHolidays(holidays.filter((holiday) => holiday.id !== id));
					// Handle success
				})
				.catch((error) => {
					console.error("Error deleting:", error);
					// Handle error
				});
		} else {
			window.alert("timesheet is not a draft");
		}
	};

	return (
		<div className='w-screen min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-bl from-[#d8e7f5] to-[#afcce700]'>
			<Navbar />
			<h1 className='text-center mt-4 text-2xl font-bold mb-[100px]'>
				Holidays
			</h1>

			{addHolidayModal && (
				<AddHolidayModal
					filteredCountries={filteredCountries}
					setAddHolidayModal={setAddHolidayModal}
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
					<option key={0} value={"All"}>
						All
					</option>
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
						setAddHolidayModal(!addHolidayModal);
					}}
					className='px-2 py-2 font-medium text-[18px] border-none mb-2 text-white bg-[#2F3C48] rounded-lg'
				>
					Add New Holiday +
				</button>
			</div>
			<table className='w-2/3 mx-auto bg-white border-[#EBEFF5]'>
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
					{holidays &&
						holidays.map((holiday) => (
							<tr className='text-center border-[#EBEFF5]' key={holiday.id}>
								<td className='border-[#EBEFF5] py-1'>{holiday.day}</td>
								<td className='border-[#EBEFF5] py-1'>{holiday.month}</td>
								<td className='border-[#EBEFF5] py-1'>{holiday.year}</td>
								<td className={`border-[#efe9e9] py-1  `}>{holiday.name}</td>
								<td className=' py-1.5 border-[#efe9e9] '>
									{findCountryNameById(holiday.country_id)}
								</td>
								<td
									onClick={() => handleDeleteHoliday(holiday.id)}
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

const AddHolidayModal = ({ filteredCountries, setAddHolidayModal }) => {
	const [date, setDate] = useState("");
	const [description, setDescription] = useState("");
	const [country, setCountry] = useState("");
	const [holidays, setHolidays] = useState({});

	const auth = useAuth();
	const accessToken = auth.accessToken;

	function handleAddTimesheet(e) {
		e.preventDefault();
		const formattedDate = new Date(date).toLocaleDateString("en-GB");
		const [day, month, year] = formattedDate.split("/");
		const newHoliday = {
			day: Number(day),
			month: Number(month),
			year: Number(year),
			name: description,
			country_id: Number(country),
		};

		axios
			.post("/holidays", newHoliday, {
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			})
			.then((response) => {
				console.log("Holiday added successfully:", response.data);
				setHolidays({ ...holidays, ...newHoliday });
				setDate("");
				setDescription("");
				setCountry("");
			})
			.catch((error) => {
				console.error("Error adding holiday:", error);
				// Handle error if needed
			});
	}

	const handleClickOutside = (e) => {
		if (e.target.className === "absolute w-screen h-screen bg-gray-800/80") {
			setAddHolidayModal(false);
		}
	};

	return (
		<div
			className='absolute w-screen h-screen bg-gray-800/80'
			onClick={handleClickOutside}
		>
			<form className='flex w-[760px] mt-[5%] flex-col rounded-md items-center bg-white m-auto px-8 py-4'>
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
					<select
						name='countryId'
						value={country}
						onChange={(e) => setCountry(e.target.value)}
						className='w-[400px] border-black border-2 text-black rounded-sm pl-2 py-0.5'
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
				<div className='flex justify-between w-full'>
					<button
						onClick={(bool) => setAddHolidayModal(!bool)}
						className='self-end mt-10 ml-[150px] px-4 py-1 border-none rounded-md bg-[#2F3C48] text-white'
					>
						Cancel
					</button>
					<button
						onClick={(e) => handleAddTimesheet(e)}
						className='self-end mt-10 mr-[150px] px-4 py-1 border-none rounded-md bg-green-600 text-white'
					>
						Add holiday
					</button>
				</div>
			</form>
		</div>
	);
};

export default ListOfHolidays;
