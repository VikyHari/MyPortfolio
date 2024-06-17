import React, { useEffect, useState } from 'react'
import './styles/Header.scss';
import { useDispatch, useSelector } from 'react-redux';
function Header({ loader }) {
    const [indexs, setIndexs] = useState("");
    const dispatch = useDispatch();
    const state = useSelector((state) => state?.colors?.ColorName)
    useEffect(() => {
        localStorage.setItem("loader", loader)
    }, [])


    const iconsData = [
        {
            id: 1,
            name: "Home",
            icon: <i class="fa-solid fa-house"></i>

        },
        {
            id: 2,
            name: "About",
            icon: <i class="fa-solid fa-user"></i>

        },

        {
            id: 4,
            name: "Skill",
            icon: <i class="fa-solid fa-award"></i>

        },
        {
            id: 5,
            name: "Projects",
            icon: <i class="fa-solid fa-phone-volume"></i>

        },
        {
            id: 6,
            name: "Contact Us",
            icon: <i class="fa-solid fa-phone-volume"></i>

        }
    ]
    return (
        <div style={{ color: state }} className='main-header-sections'>
            <div className='inside-header-section'>
                {/* <nav>
                    <ul>
                        <li>
                            Download CV
                            <span></span><span></span><span></span><span></span>
                        </li>

                    </ul>
                </nav> */}
                <div className='left-logo'>
                    logo
                </div>
                <div className='middle-logo'>
                    <div className='main-card-header'>
                        {iconsData?.map((item, index) => {
                            return (
                                <div className='inside-header-boxes' key={index}>
                                    <div>
                                        {item?.icon}
                                    </div>
                                    <div>
                                        {item?.name}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='right-logo'>
                    button
                </div>
            </div>
        </div>
    )
}

export default Header


