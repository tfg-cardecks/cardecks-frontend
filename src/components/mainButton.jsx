import React from 'react'
import { Link } from 'react-router-dom'

export default function MainButton(text, link, func = '', w = '100px', h = '50px') {
    let res = ''
    if (func === '') {
        res = (
            <Link to={link} className='flex flex-col button-container'>
                <div className='flex main-button-container'>
                    <h4>{text}</h4>
                </div>
            </Link>
        )
    } else {
        res = (
            <button onClick={func} className='flex flex-col button-container'>
                <div className='flex main-button-container'>
                    <h4>{text}</h4>
                </div>
            </button>
        )
    }

    return (
        <div className='flex justify-center items-center' style={{ width: w, height: h, borderWidth: '3px', backgroundColor: 'white', borderRadius: '10px', borderColor:'black', marginRight:'10%' }}>
            {res}
        </div>
    )
}