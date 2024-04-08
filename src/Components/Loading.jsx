import React from "react";
import LoadingGIF from "../assets/loading.gif";

const Loading = () => {
	return (
		<div className='w-screen h-screen'>
			<img className='mx-auto' src={LoadingGIF} alt='' />
		</div>
	);
};

export default Loading;
