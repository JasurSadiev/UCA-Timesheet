import React from "react";
import TablePageManager from "../../Pages/TablePageManager";
import Status from "../Status";

const Review = ({ currentTimesheetIdManager }) => {
	return (
		<div className='w-screen  flex flex-col mx-auto pt-4 bg-white'>
			{/* <h2 className='self-center font-bold border-2 border-black px-4 py-1'>
				TIMESHEET
			</h2> */}
			<TablePageManager currentTimesheetIdManager={currentTimesheetIdManager} />
		</div>
	);
};

export default Review;
