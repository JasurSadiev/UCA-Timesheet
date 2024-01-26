import React from "react";
import Approve from "./Approve";
import Reject from "./Reject";

const Buttons = ({ currentTimesheetIdManager, accessToken }) => {
	return (
		<div className='flex gap-x-10 justify-center w-[90%] ml-[5%] pb-10 bg-white'>
			<Approve
				currentTimesheetIdManager={currentTimesheetIdManager}
				accessToken={accessToken}
			/>
			<Reject
				currentTimesheetIdManager={currentTimesheetIdManager}
				accessToken={accessToken}
			/>
		</div>
	);
};

export default Buttons;
