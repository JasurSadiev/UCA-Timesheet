// import { useState } from "react";
import "./App.css";
import TablePage from "./Pages/TablePage";
import Layout from "./Components/Layout";
import Missing from "./Components/Missing";
import Unauthorized from "./Components/Unauthorized";
import RequireAuth from "./Components/RequireAuth";
import { Routes, Route } from "react-router-dom";
import Login_Page from "./Pages/Login_Page";

const ROLES = {
	User: 2001,
	Editor: 1984,
	Admin: 5150,
};

function App() {
	return (
		// <div className='App flex flex-col px-4 max-w-screen'>
		// 	<TablePage />
		// </div>
		<Routes>
			<Route path='/' element={<Layout />}>
				{/* public routes */}
				<Route path='login' element={<Login_Page />} />
				<Route path='unauthorized' element={<Unauthorized />} />
				<Route path='/' element={<TablePage />} />

				{/* we want to protect these routes */}
				<Route element={<RequireAuth allowedRoles={[ROLES.User]} />}></Route>
				{/* catch all */}
				<Route path='*' element={<Missing />} />
			</Route>
		</Routes>
	);
}

export default App;
