import React, { useEffect, useState } from 'react'
import './styles/Home.scss';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules'
import 'swiper/css';
import 'swiper/css/autoplay';
import person1 from '../../assests/images/person1.png';
import person2 from '../../assests/images/person2.png';
import person3 from '../../assests/images/person3.png';
import { Typewriter } from 'react-simple-typewriter'
import Modal from 'react-bootstrap/Modal';
import pdf from '../../assests/Kalai-resume.pdf';

import AOS from 'aos';
function Home({ colorName, theme }) {


    useEffect(() => {
        AOS.init();
    }, [])


    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);


    const datas = [
        {
            id: 1,
            image: person1
        },
        {
            id: 1,
            image: person2
        },
        {
            id: 1,
            image: person3
        }
    ]


    const LinkedInPath = () => {
        window.open('https://www.linkedin.com/feed/')
    }

    const GithubPath = () => {
        window.open('https://github.com/KalaiRoman?tab=repositories')
    }
    const handleType = (count) => {
    }

    const handleDone = () => {
    }
    return (
        <>
            <div className='main-home-section' id="Home">



                <div className='empty-circle'>

                </div>
                <div className='emoji1'>
                    😎
                </div>
                <div className='blue-box animate__animated animate__jello animate__infinite animate__delay-3s 3s infinite animate__slower 2s '>

                </div>
                <div className='green-box animate__animated animate__bounce animate__infinite animate__delay-3s 3s infinite animate__slower 2s'>

                </div>
                <div className='rose-box animate__animated animate__heartBeat animate__infinite animate__delay-3s 3s infinite animate__slower 2s'>

                </div>
                <div className='color-box'>

                </div>


                {theme && <div>
                    <i class="fa-solid fa-star stars"></i>
                </div>}
                {theme && <div>
                    <i class="fa-solid fa-star stars1"></i>
                </div>}
                {theme && <div>
                    <i class="fa-solid fa-star stars2"></i>
                </div>}
                <div className='inside-section'>
                    <div className='home-left' style={{ color: colorName }}>
                        <div className='left-inside-home'>
                            <div className='web-text mb-2' style={{ color: colorName }} data-aos-easing="linear"
                                data-aos-duration="1500" data-aos="fade-down">
                                <span className='w-text animate__animated animate__bounce animate__repeat-3 	3 animate__slow 2s'> W</span>EB<span className='w-text animate__animated animate__bounce animate__repeat-2 	2 animate__slow 3s'>D</span>EVELOPER
                            </div>
                            <div className='myname-text' data-aos="fade-right"
                                data-aos-easing="linear"
                                data-aos-duration="1500">
                                Hello, My name is
                            </div>
                            <div className='myname-text'
                                data-aos="flip-left"
                                data-aos-easing="linear"
                                data-aos-duration="1500"
                            >
                                <span className='k-text'>K</span>alaisurya <span style={{ color: 'orange', fontWeight: 'bold', fontSize: "1rem" }}>(
                                    <Typewriter
                                        words={['Reactjs 😃', 'Nextjs 😃', 'ReactNative 😃', 'Nodejs 😃']}
                                        loop={5}
                                        cursor
                                        cursorStyle='_'
                                        typeSpeed={70}
                                        deleteSpeed={50}
                                        delaySpeed={1000}
                                        onLoopDone={handleDone}
                                        onType={handleType}
                                    /> )
                                </span>
                            </div>
                            <div className='build-text mt-3' data-aos="zoom-in-right"
                                data-aos-easing="linear"
                                data-aos-duration="1500"
                            >
                                A Building Applications with Front End Developer Operations.
                            </div>
                            <div className='home-social-icons mt-4 mb-2'>
                                <div data-aos="fade-right"
                                    data-aos-easing="linear"
                                    data-aos-duration="1500">
                                    <i class="fa-brands fa-facebook logo-icon"></i>
                                </div>
                                <div onClick={LinkedInPath} data-aos="fade-down"
                                    data-aos-easing="linear"
                                    data-aos-duration="1500">
                                    <i class="fa-brands fa-linkedin-in logo-icon"></i>
                                </div>
                                <div onClick={GithubPath} data-aos="fade-up"
                                    data-aos-easing="linear"
                                    data-aos-duration="1500">
                                    <i class="fa-brands fa-github logo-icon"></i>
                                </div>
                            </div>
                            <div className='home-button'>
                                <div data-aos="fade-up"
                                    data-aos-duration="3000">
                                    <button className='hireme'>
                                        <a href="mailto:kalaimca685@gmail.com">
                                            Hire Me
                                        </a>
                                    </button>
                                </div>
                                <div data-aos="fade-down"
                                    data-aos-easing="linear"
                                    data-aos-duration="1500">
                                    <button className='donwloadbutton'>
                                        <a href={pdf} download="Kalai-resume.pdf" className='pdf'>
                                            Download CV
                                        </a>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className='home-right'>
                        <Swiper
                            spaceBetween={50}
                            slidesPerView={1}
                            centeredSlides={true}
                            autoplay={{
                                delay: 4500,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            navigation={true}
                            modules={[Autoplay]}
                            className='main-swiper-box'
                        >


                            {datas?.map((item) => {
                                return (
                                    <SwiperSlide>
                                        <div className='swipper-box-cards'>
                                            <img src={item?.image} alt="no image" className='person-images' />
                                            <div className='empty-boxes'>

                                            </div>
                                            <div className='fade-box'>

                                            </div>
                                        </div>
                                    </SwiperSlide>

                                )
                            })}
                        </Swiper>

                        <div className='first-box' data-aos="fade-right"
                            data-aos-easing="linear"
                            data-aos-duration="1500">
                            <div className='icon-happy-client-logoss'>
                                <i class="fa-solid fa-briefcase icon-happy-client-logo"></i>
                            </div>
                            <div className='happy-client-text' >
                                <div className='text-years'>
                                    3+</div>
                                <div className='year-text'>
                                    Years of <br />Experience
                                </div>
                            </div>
                        </div>
                        <div className='second-box' data-aos="fade-up"
                            data-aos-easing="linear"
                            data-aos-duration="1500">
                            <div className='icon-happy-client-logoss'>
                                <i class="fa-solid fa-folder-minus icon-happy-client-logo"></i>
                            </div>
                            <div className='happy-client-text'>
                                <div className='text-years'>
                                    10+</div>
                                <div className='year-text'>
                                    Projects <br />Completed
                                </div>
                            </div>
                        </div>
                        <div className='third-box' data-aos="fade-down"
                            data-aos-easing="linear"
                            data-aos-duration="1500">
                            <div className='icon-happy-client-logoss'>

                                <i class="fa-solid fa-users icon-happy-client-logo"></i>
                            </div>
                            <div className='happy-client-text'>
                                <div className='text-years'>
                                    4+</div>
                                <div className='year-text'>
                                    Happy<br />Clients
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Aboutus /> */}
        </>

    )
}

export default Home