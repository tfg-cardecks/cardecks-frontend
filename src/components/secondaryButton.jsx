import React from 'react'
import { Link } from 'react-router-dom'

export default function SecondaryButton(text, link, func = '', w = '100px', h = '50px') {
	let res = ''
	if (func === '') {
		res = (
			<Link to={link} className='flex flex-col button-container'>
				<div className='flex secondary-button-container'>
					<h4>{text}</h4>
				</div>
			</Link>
		)
	} else {
		res = (
			<button onClick={func} className='flex flex-col button-container'>
				<div className='flex secondary-button-container'>
					<h4>{text}</h4>
				</div>
			</button>
		)
	}

	return (
		
		<div className='flex justify-center items-center text-white' style={{ width: w, height: h, borderWidth: '3px', backgroundColor: 'black', borderRadius: '10px', borderColor:'#EEEEEE' }}>
		{res}
	</div>
	)
}
