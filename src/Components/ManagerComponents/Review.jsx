import React from "react";
import TablePageManager from "../../Pages/TablePageManager";

const Review = ({ currentTimesheetIdManager }) => {
	return (
		<div className='w-screen  flex flex-col mx-auto mt-4 bg-white'>
			<h2 className=' w-min px-4 bg-red-800 text-white border-none'>Review</h2>
			{/* <h2 className='self-center font-bold border-2 border-black px-4 py-1'>
				TIMESHEET
			</h2> */}
			<TablePageManager currentTimesheetIdManager={currentTimesheetIdManager} />
		</div>
	);
};

export default Review;
