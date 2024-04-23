import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const AddNewUserForm = () => {
	const auth = useAuth();
	const [countries, setCountries] = useState(null);
	const [allUsers, setAllUsers] = useState([]);
	const [userInfo, setUserInfo] = useState({
		firstName: "",
		lastName: "",
		email: "",
		countryId: "",
		city: "",
		department: "",
		position: "",
		manager_id: "",
		sapID: "",
		isAdmin: false,
	});

	const accessToken = auth.accessToken;

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

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get("/admin/users", {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setAllUsers(response.data);
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};
		fetchUsers();
	}, [accessToken]);

	console.log(allUsers.users);
	console.log(userInfo);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setUserInfo((prevUserInfo) => ({
			...prevUserInfo,
			[name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post(
				"/auth/sign-up",
				{
					city: userInfo.city,
					country_id: Number(userInfo.countryId),
					department: userInfo.department,
					email: userInfo.email,
					first_name: userInfo.firstName,
					is_admin: Boolean(userInfo.isAdmin),
					last_name: userInfo.lastName,
					manager_id: Number(userInfo.manager_id),
					password: "qwerty",
					position: userInfo.position,
					sap_id: userInfo.sapID,
					shift_id: 1,
				},
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);
			console.log("User created successfully!");
			// Clear the form
			setUserInfo({
				firstName: "",
				lastName: "",
				email: "",
				countryId: "",
				city: "",
				department: "",
				position: "",
				sapID: "",
				manager_id: "",
			});
		} catch (error) {
			console.error("Error creating user:", error);
			alert("An error occurred. Please try again later.");
		}
	};

	const filteredCountries = countries
		? countries.filter(
				(country) =>
					country.name !== "Kyrgyzstan" &&
					country.name !== "Tajikistan" &&
					country.name !== "Pakistan" &&
					country.name !== "Kazakhstan"
		  )
		: [];

	return (
		<div className='h-fit overflow-hidden bg-white flex flex-col mt-[3%] p-[30px] text-[16px]  mb-8 rounded-lg shadow-lg'>
			<h2 className='font-medium text-[16px] mb-4'>Add New User:</h2>
			<hr className='mb-2' />
			<form onSubmit={handleSubmit}>
				<div className='flex gap-x-20 mb-4'>
					<div>
						<p className='font-medium mb-1'>First Name:</p>
						<input
							type='text'
							name='firstName'
							value={userInfo.firstName}
							onChange={handleChange}
							placeholder='Add your First Name'
							className='border-[#9DACC3] border-2 rounded-md px-2 py-0.5 min-w-[350px]'
						/>
					</div>
					<div>
						<p className='font-medium mb-1'>Last Name:</p>
						<input
							type='text'
							name='lastName'
							value={userInfo.lastName}
							onChange={handleChange}
							className='border-[#9DACC3] border-2 rounded-md px-2 py-0.5 min-w-[350px]'
							placeholder='Add your Last Name'
						/>
					</div>
				</div>
				<div className='flex gap-x-20 mb-4'>
					<div>
						<p className='font-medium mb-1'>Email:</p>
						<input
							type='text'
							name='email'
							value={userInfo.email}
							onChange={handleChange}
							placeholder='Add your email address'
							className='border-[#9DACC3] border-2 rounded-md px-2 py-0.5 min-w-[350px] text-[16px]'
						/>
					</div>
					<div className=''>
						<p className='font-medium mb-1'>Country:</p>
						<select
							name='countryId'
							value={userInfo.countryId}
							onChange={handleChange}
							className='border-[#9DACC3] border-2 rounded-md px-2 py-1 w-[350px]'
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
				</div>
				<div className='flex justify-between mb-4'>
					<p className='font-medium'>City</p>
					<input
						type='text'
						name='city'
						value={userInfo.city}
						onChange={handleChange}
						className='border-[#9DACC3] border-2 rounded-md px-2 py-0.5 min-w-[500px] mr-16'
						placeholder='Add your City'
					/>
				</div>
				<div className='flex justify-between mb-4'>
					<p className='font-medium'>Department</p>
					<input
						type='text'
						name='department'
						value={userInfo.department}
						onChange={handleChange}
						placeholder='Add your Department'
						className='border-[#9DACC3] border-2 rounded-md px-2 py-0.5 min-w-[500px] mr-16'
					/>
				</div>
				<div className='flex justify-between mb-4'>
					<p className='font-medium'>Position</p>
					<input
						type='text'
						name='position'
						value={userInfo.position}
						onChange={handleChange}
						placeholder='Add your Position'
						className='border-[#9DACC3] border-2 rounded-md px-2 py-0.5 min-w-[500px] mr-16'
					/>
				</div>
				<div className='flex justify-between mb-4'>
					<p className='font-medium'>SAP ID</p>
					<input
						type='text'
						name='sapID'
						value={userInfo.sapID}
						onChange={handleChange}
						placeholder='Add your SAP ID'
						className='border-[#9DACC3] border-2 rounded-md px-2 py-0.5 min-w-[500px] mr-16'
					/>
				</div>
				<div className='flex justify-between mb-4 text-center'>
					<label
						htmlFor='manager_id'
						className='font-medium text-center my-auto'
					>
						Manager
					</label>
					<select
						value={userInfo.manager_id}
						onChange={handleChange}
						name='manager_id'
						className='border-[#9DACC3] border-2 rounded-md px-2 py-1  min-w-[500px] mr-16'
					>
						<option value='' className=''>
							Select a manager
						</option>
						{allUsers.users &&
							allUsers.users.map((user) => (
								<option key={user.id} value={user.id}>
									{user.first_name}
									{user.last_name}
								</option>
							))}
					</select>
				</div>

				<div className='flex justify-start gap-x-32 mb-6'>
					<label htmlFor='is-admin-yes' className='font-medium'>
						Is Admin
					</label>
					<fieldset className='flex gap-x-10 text-[18px] font-normal'>
						<legend className='sr-only'>Is Admin</legend>
						<label>
							<input
								type='radio'
								name='isAdmin'
								value='true'
								required
								onChange={handleChange}
							/>{" "}
							Yes
						</label>
						<label>
							<input
								type='radio'
								name='isAdmin'
								value='false'
								required
								onChange={handleChange}
							/>{" "}
							No
						</label>
					</fieldset>
				</div>

				<button
					type='submit'
					className='w-[200px] py-1 rounded-lg bg-black text-white'
					onClick={handleSubmit}
				>
					Add New User
				</button>
			</form>
		</div>
	);
};

export default AddNewUserForm;
