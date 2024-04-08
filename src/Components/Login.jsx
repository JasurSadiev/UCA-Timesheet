import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

import "../Temp.css";
import axios from "../api/axios";
const LOGIN_URL = "/auth/sign-in";
const USER_INFO_URL = "/user/me";

const Login = ({ setAccessToken }) => {
	const { auth, setAuth } = useAuth();
	const accessToken = auth.accessToken;

	const navigate = useNavigate();
	const location = useLocation();
	const from = "/my-tables";

	const emailRef = useRef();
	const errRef = useRef();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errMsg, setErrMsg] = useState("");

	useEffect(() => {
		emailRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg("");
	}, [email, password]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				LOGIN_URL,
				JSON.stringify({ email, password }),
				{
					headers: { "Content-Type": "application/json" },
					withCredentials: true,
				}
			);
			const accessToken = response?.data?.access_token;
			setAuth({ accessToken });
			setEmail("");
			setPassword("");

			navigate(from, { replace: true });
		} catch (err) {
			if (!err?.response) {
				setErrMsg("No Server Response");
			} else if (err.response?.status === 400) {
				setErrMsg("Missing Username or Password");
			} else if (err.response?.status === 401) {
				setErrMsg("Unauthorized");
			} else {
				setErrMsg("Login Failed");
			}
			errRef.current.focus();
		}
	};

	return (
		<section className='text-white'>
			<p
				ref={errRef}
				className={errMsg ? "errmsg" : "offscreen"}
				aria-live='assertive'
			>
				{errMsg}
			</p>
			<h1>Sign In</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor='email'>Email:</label>
				<input
					type='email'
					id='email'
					ref={emailRef}
					autoComplete='off'
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					required
				/>

				<label htmlFor='password'>Password:</label>
				<input
					type='password'
					id='password'
					onChange={(e) => setPassword(e.target.value)}
					value={password}
					required
				/>
				<button className='bg-white text-black w-[fit-content] py-1 mt-4 px-4'>
					Sign In
				</button>
			</form>
			<p>
				<span className='underline'>Forgot Password</span>
			</p>
		</section>
	);
};

export default Login;
