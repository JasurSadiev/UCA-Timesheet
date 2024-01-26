// Modal.js

import React, { useState, useEffect } from "react";
import axios from "../api/axios";

const AddRowModal = ({ isOpen, onClose, order, setOrder, newRecord }) => {
	const ORDERSAPI = "/orders";
	const [orders, setOrders] = useState([]);
	const [selectedOrder, setSelectedOrder] = useState({
		orderName: "",
		orderId: "",
	});

	console.log(selectedOrder);

	async function getOrders() {
		try {
			const response = await axios.get(ORDERSAPI, {
				headers: { "Content-Type": "application/json" },
				withCredentials: true,
			});
			setOrders(response.data);
		} catch (error) {
			console.log(error);
		}
	}

	useEffect(() => {
		// const setInitialSelectedOrder = () => {
		// 	if (orders.length > 0) {
		// 		setSelectedOrder({
		// 			orderName: orders[0].grant_description,
		// 			orderId: orders[0].id,
		// 		});
		// 	}
		// };

		getOrders();
		// setInitialSelectedOrder();
	}, [isOpen]);

	const handleDropdownChange = (dropdown, value) => {
		const selectedOrderId = orders.find(
			(element) => element.grant_description === value
		)?.id;

		setSelectedOrder((prevSelectedOrder) => ({
			...prevSelectedOrder,
			orderName: value,
			orderId: selectedOrderId || "", // Handle the case where selectedOrderId is undefined
		}));

		// Log the state after it has been updated
	};

	const handleSubmit = () => {
		setOrder(selectedOrder);

		// Perform any other actions with selectedOrder if needed
		// console.log("Selected Options:", selectedOrder);

		// Close the modal
		onClose();
		newRecord();
	};

	if (!orders || orders.length === 0) {
		// If data is still loading or there is no data, you can render a loading spinner or a message.
		return <p>Loading...</p>;
	}

	return (
		<div
			className={`modal ${
				isOpen && orders
					? "block absolute w-screen px-10 overflow-x-hidden  h-[100%] -ml-[20px] backdrop-blur-lg"
					: "hidden"
			}`}
		>
			<div className='modal-overlay' onClick={onClose}></div>
			<div className='modal-container'>
				<div className='modal-content'>
					<h2 className='text-2xl font-bold mb-4'>Select Options</h2>

					{/* Dropdowns */}
					<div className='grid grid-cols-2 gap-4'>
						{[1].map((dropdownNumber) => (
							<div key={dropdownNumber}>
								<label htmlFor={`dropdown${dropdownNumber}`}>Orders</label>
								<select
									id={`dropdown${dropdownNumber}`}
									value={selectedOrder["orderName"]}
									onChange={(e) =>
										handleDropdownChange(
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
											key={element.id}
											value={`${element.grant_description}`}
										>
											{element.grant_description}
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
