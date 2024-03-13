import "./App.css";
import TablePage from "./Pages/TablePage";
import Layout from "./Components/Layout";
import Missing from "./Components/Missing";
import Unauthorized from "./Components/Unauthorized";
import RequireAuth from "./Components/RequireAuth";
import { Routes, Route } from "react-router-dom";
import Login_Page from "./Pages/Login_Page";
import { useState } from "react";
import Manager from "./Pages/Manager";
import Main from "./Pages/Main";
import ListOfTimesheets from "./Pages/ListOfTimesheets";
import ListOfTimesheetsManager from "./Pages/ListOfTimeSheetsManager";
import UserSettings from "./Pages/UserSettings";
import ListOfHolidays from "./Pages/HolidaysList";

const ROLES = {
	User: 2001,
	Editor: 1984,
	Admin: 5150,
};

function App() {
	const [accessToken, setAccessToken] = useState(null);
	const [currentTimesheetId, setCurrentTimesheetId] = useState(null);
	const [currentTimesheetIdManager, setCurrentTimesheetIdManager] =
		useState(null);

	return (
		// <div className='App flex flex-col px-4 max-w-screen'>
		// 	<TablePage />
		// </div>
		<Routes>
			<Route path='/' element={<Layout />}>
				{/* public routes */}
				<Route
					path='my-tables'
					// element={<TablePage accessToken={accessToken} />}
					element={<Main />}
					// element={<Manager accessToken={accessToken} />}
				/>
				<Route
					path='my-timesheets'
					element={
						<ListOfTimesheets setCurrentTimesheetId={setCurrentTimesheetId} />
					}
				/>
				<Route
					path={`timesheet/`}
					element={<TablePage currentTimesheetId={currentTimesheetId} />}
				/>

				<Route path={`settings/`} element={<UserSettings />} />
				<Route path={`holidays/`} element={<ListOfHolidays />} />

				<Route
					path='pending-timesheets'
					element={
						<ListOfTimesheetsManager
							setCurrentTimesheetIdManager={setCurrentTimesheetIdManager}
						/>
					}
				/>
				<Route
					path='manager/review'
					element={
						<Manager currentTimesheetIdManager={currentTimesheetIdManager} />
					}
				/>
				<Route path='unauthorized' element={<Unauthorized />} />
				<Route
					path='/'
					element={<Login_Page setAccessToken={setAccessToken} />}
					// element={<Manager />}
				/>

				{/* we want to protect these routes */}
				<Route element={<RequireAuth allowedRoles={[ROLES.User]} />}></Route>
				{/* catch all */}
				<Route path='*' element={<Missing />} />
			</Route>
		</Routes>
	);
}

export default App;
