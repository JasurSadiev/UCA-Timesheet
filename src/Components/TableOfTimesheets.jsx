import React from "react";

const TableOfTimesheets = ({ timesheetId, status, date, author }) => {
	return (
		<tr>
			<td>{timesheetId}</td>
			<td>{author}</td>
			<td>{date}</td>
			<td>{status}</td>
		</tr>
	);
};

export default TableOfTimesheets;
