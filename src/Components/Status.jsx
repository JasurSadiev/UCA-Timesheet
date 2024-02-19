import React from "react";

const Status = ({ status }) => {
	function statusColor() {
		if (status == "draft") {
			return "bg-[#C5DAFB] text-[#428AF8]";
		} else if (status == "approved") {
			return "bg-[#D1FAE5] text-[#3A9E75]";
		} else if (status == "rejected") {
			return "bg-[#FFD0D0] text-[#EF4444]";
		} else {
			return "bg-[#FEF3C7] text-[#E07706]";
		}
	}

	return (
		<div className={`flex gap-x-2 font-bold mt-4 ml-4`}>
			<p className='text-[16px]'>Status:</p>
			<span className={`${statusColor()} px-4 py-1 rounded-lg text-[11px]`}>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		</div>
	);
};

export default Status;
