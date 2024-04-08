// Modal.js

import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading.jsx";

const AddRowModal = ({
	isOpen,
	onClose,
	order,
	setOrder,
	newRecord,
	loading,
	setLoading,
}) => {
	const ORDERSAPI = "/orders";
	const GRANTSAPI = "/grants";
	const [grants, setGrants] = useState([]);
	const [orders, setOrders] = useState([]);
	const [selectedGrant, setSelectedGrant] = useState({
		grantName: "",
		grantId: "",
	});
	const [selectedOrder, setSelectedOrder] = useState({
		orderName: "",
		orderId: "",
	});

	const navigate = useNavigate();

	async function getGrants() {
		try {
			const response = await axios.get(GRANTSAPI, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			});
			setGrants(response.data);
		} catch (error) {
			console.log(error);
		}
	}

	async function getOrders(grant_id) {
		try {
			const response = await axios.get(
				ORDERSAPI,
				{ grant_id: grant_id },
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			setOrders(response.data);
		} catch (error) {
			if (error.response && error.response.status === 401) {
				navigate("/");
			}
			console.log(error);
		}
	}

	useEffect(() => {
		getGrants();
		getOrders();
	}, [isOpen]);

	useEffect(() => {
		if (selectedGrant.grantId) {
			getOrders(selectedGrant.grantId);
		}
	}, [selectedGrant]);

	const handleOrderChange = (dropdown, value) => {
		const selectedOrderId = orders.find(
			(element) => element.description === value
		)?.order_id;

		setSelectedOrder((prevSelectedGrant) => ({
			...prevSelectedGrant,
			orderName: value,
			orderId: selectedOrderId || "",
		}));
		setOrder((prev) => ({
			...prev,
			order_id: selectedOrderId,
		}));
	};

	const handleGrantChange = (dropdown, value) => {
		const selectedGrantId = grants.find(
			(element) => element.description === value
		)?.grant_id;

		setSelectedGrant((prevSelectedGrant) => ({
			...prevSelectedGrant,
			grantName: value,
			grantId: selectedGrantId || "",
		}));
	};

	const handleSubmit = () => {
		setLoading(true);
		setOrder({
			description: selectedGrant.grantName,
			order_id: selectedOrder.orderId,
			grant_id: selectedGrant.grantId,
		});
		onClose();
		newRecord();
	};

	if (!orders || orders.length === 0) {
		// If data is still loading or there is no data, you can render a loading spinner or a message.
		return <p>Loading...</p>;
	}

	if (loading) {
		return <Loading />;
	}

	return (
		<div
			className={`modal ${
				isOpen && orders
					? "block absolute top-0 w-screen px-10 overflow-x-hidden  min-h-screen -ml-[20px] backdrop-blur-lg"
					: "hidden"
			}`}
		>
			<div className='modal-overlay' onClick={onClose}></div>
			<div className='modal-container'>
				<div className='modal-content'>
					<div className='flex justify-between'>
						<h2 className='text-2xl font-bold mb-4'>Select Options</h2>
						<span
							onClick={() => onClose(false)}
							className='font-bold cursor-pointer bg-white px-3 text-red-500 mt-2 text- text-2xl'
						>
							X
						</span>
					</div>

					{/* Dropdowns */}
					<div className='grid grid-cols-2 gap-4'>
						{[1].map((dropdownNumber) => (
							<div key={dropdownNumber}>
								<label htmlFor={`dropdown${dropdownNumber}`}>Grants</label>
								<select
									id={`dropdown${dropdownNumber}`}
									value={selectedGrant["grantName"]}
									onChange={(e) =>
										handleGrantChange(
											`dropdown${dropdownNumber}`,
											e.target.value
										)
									}
									className='w-full p-2 border border-gray-300 rounded'
								>
									<option value=''></option>
									{/* Add your dropdown options here */}
									{grants.map((element) => (
										<option
											key={element.grant_id}
											value={`${element.description}`}
										>
											{element.description}
										</option>
									))}
								</select>
							</div>
						))}
					</div>

					<div className='grid grid-cols-2 gap-4'>
						{[1].map((dropdownNumber) => (
							<div key={dropdownNumber}>
								<label htmlFor={`dropdown${dropdownNumber}`}>Orders</label>
								<select
									id={`dropdown${dropdownNumber}`}
									value={selectedOrder["orderName"]}
									onChange={(e) =>
										handleOrderChange(
											`dropdown${dropdownNumber}`,
											e.target.value
										)
									}
									className='w-full p-2 border border-gray-300 rounded'
								>
									<option value=''></option>
									{/* Add your dropdown options here */}
									{orders.map((element) => (
										<option
											key={element.order_id}
											value={`${element.description}`}
										>
											{element.order_id} - {element.description}
										</option>
									))}
								</select>
							</div>
						))}
					</div>

					{/* Submit Button */}
					<button
						onClick={handleSubmit}
						className='mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700'
					>
						Submit
					</button>
				</div>
			</div>
		</div>
	);
};

export default AddRowModal;
