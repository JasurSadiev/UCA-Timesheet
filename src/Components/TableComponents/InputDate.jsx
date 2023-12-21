/* eslint-disable react/prop-types */
const InputDate = ({ labelText, value }) => {
	// console.log();
	return (
		<div className='flex flex-col text-center items-center w-[100px]'>
			<div className='flex flex-row'>
				<input
					type='text'
					className='w-12 h-10 border-2 text-xl border-black text-center'
					value={value}
				/>
				{/* <input
					type='text'
					className='w-10 h-10 border-2 text-xl border-black text-center'
					value={value}
				/> */}
			</div>
			<label htmlFor='' className='text-lg'>
				{labelText}
			</label>
		</div>
	);
};

export default InputDate;
