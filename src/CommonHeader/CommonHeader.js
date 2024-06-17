import React from 'react'
import './Commonheader.scss';
function CommonHeader({ title, colorName,smalltext }) {

    return (
        <div className='common-title'>
           
            <div className='span-box'>
                <div className='span-active-text' style={{
                    color:colorName
                }}>{title?.slice(0, 1)}</div><div className='span-text'>{title?.slice(1, 100)}</div>
            </div>
        </div>
    )
}

export default CommonHeader