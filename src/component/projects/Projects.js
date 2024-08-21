import React, { useEffect } from 'react';
import './styles/Projects.scss';
import CommonHeader from './../../CommonHeader/CommonHeader';
import { ProjectDatas } from '../../commoncontent/ProjectData';
import AOS from 'aos';

function Projects() {
    // useEffect(() => {
    //     AOS.init();
    // }, []);

    const NavigatePath = (data) => {
        window.open(data);
    };

    return (
        <div className='projects-main-section'>
            <div className='inside-project-section'>

                <div className='empty-circle1'></div>
                <div className='empty-circle4'></div>
                <div className='empty-circle2'></div>
                <div className='empty-circle3'></div>

                <div>
                    <CommonHeader title={"Projects"} />
                </div>

                <div className='container'>
                    <div className='project-cards'>
                        {ProjectDatas?.map((item, index) => (
                            <div key={index} className='cards col-md-12 mt-2 mb-4'>
                                <div className='project-title' >
                                    {item?.name}
                                </div>
                                <div className='text-center mb-5 mt-2 desc' >
                                    {item?.des}
                                </div>
                                <div className='mt-4'>
                                    <button className='button-project' onClick={() => NavigatePath(item?.url)}>
                                        {item?.button}
                                    </button>
                                </div>
                                {/* <div className="card-emty-box"></div>
                                <div className="card-emty-box1"></div> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Projects;
