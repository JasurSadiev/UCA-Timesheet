import React from "react";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
	const { auth, setAuth } = useAuth();
	const navigate = useNavigate();

	let user1 = {
		city: "Bishkek",
		country_id: 113,
		department: "SAP",
		email: "nazgul.osmonalieva@ucentralasia.org",
		first_name: "Nazgul",
		is_admin: true,
		last_name: "Osmonalieva",
		manager_id: 8,
		password: "qwerty",
		position: "Academic Operations Manager",
		sap_id: "10",
		shift_id: 1,
	};

	let user2 = {
		city: "Bishkek",
		country_id: 113,
		department: "HR",
		email: "daniyar.tokhtakhunov@ucentralasia.org",
		first_name: "Daniyar",
		is_admin: true,
		last_name: "Tokhtakhunov",
		manager_id: 1,
		password: "qwerty",
		position: "Senior Manager",
		sap_id: "28",
		shift_id: 1,
	};

	const signUp = async (details) => {
		const accessToken = auth.accessToken;
		const headers = {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		};

		try {
			const response = await axios.post("/auth/sign-up", details, {
				headers: headers,
			});

			if (response.status === 200) {
				console.log("User signed up successfully!");
			} else {
				console.error(
					"Failed to sign up user:",
					response.status,
					response.data
				);
			}
		} catch (error) {
			if (error.response && error.response.status === 401) {
				navigate("/");
			}
			console.error("Error signing up user:", error);
		}
	};

	return (
		<div>
			<button onClick={() => signUp(user1)}>Add User1</button>
			<button onClick={() => signUp(user2)}>Add User2</button>
		</div>
	);
};

export default SignUp;
