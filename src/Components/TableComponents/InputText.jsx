/* eslint-disable react/prop-types */
const InputText = ({ labelText, value }) => {
	// console.log(props);
	return (
		<div className='flex flex-col w-[400px]'>
			<input
				type='text'
				className='border-b-[3px] text-xl border-black focus:border-b-4 active:border-b-4 focus:outline-none text-center'
				value={value}
			/>
			<label htmlFor='' className='text-center'>
				{labelText}
			</label>
		</div>
	);
};

export default InputText;
