import React, { useState, useEffect } from 'react'
import './styles/Contact.scss';
import CommonHeader from './../../CommonHeader/CommonHeader';
import contactimg from '../../assests/images/Contact us-amico 1.png';
import { ContactDatas } from '../../commoncontent/ContactData';
import Form from 'react-bootstrap/Form';
import emailjs from '@emailjs/browser';
import AOS from 'aos';

function Contact({ colorName }) {


    useEffect(() => {
        AOS.init();
    }, [])

    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [loader, setLoader] = useState(false);
    const [sendmails, setSendMail] = useState({
        user_name: "",
        user_email: "",
        user_message: ""
    });

    const { user_email, user_name, user_message } = sendmails;
    const handleChange = (e) => {
        setSendMail({ ...sendmails, [e.target.name]: e.target.value });
    }
    const SubmitContactDetails = (e) => {
        e.preventDefault();

        if (user_email?.length === 0 || user_message?.length === 0 || user_name?.length === 0) {
            setError(true);
        }

        if (user_email && user_name && user_message) {
            setLoader(true);
            setTimeout(() => {
                setLoader(false);
                setSuccess(true);
                setError(false);
                setSendMail({
                    user_email: "",
                    user_name: "",
                    user_message: ""
                })
            }, 1000);
        }

    }
    return (
        <div className='main-contact-section'>
            <div className='inside-contact-section'>
                <CommonHeader title={"Contact Me"} colorName={colorName} />
                <div className='contact-box'>
                    <div className='left-contact-box'>
                        <div className='getin' data-aos="fade-down"
                            data-aos-duration="3000">
                            Get in touch
                        </div>
                        <div className='we-texts' data-aos="fade-up"
                            data-aos-duration="3000">
                            We are here for you!
                            {/* How can we help? */}
                        </div>
                        <div className='mt-4' data-aos="flip-left"
                            data-aos-easing="ease-out-cubic"
                            data-aos-duration="2000">
                            <Form onSubmit={SubmitContactDetails}>
                                <div className='mb-3'>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="label-texts">Name</Form.Label>
                                        <Form.Control type="text" placeholder="Enter Name" className='form-section' onChange={handleChange} value={user_name} name="user_name" />
                                        <Form.Text className="text-muted">
                                            {error && user_name?.length <= 0 ? <span className='text-danger'>Name is Required</span> : null}
                                        </Form.Text>
                                    </Form.Group>
                                </div>
                                <div className='mb-3'>
                                    <Form.Group className="mb-3">
                                        <Form.Label className="label-texts">Email</Form.Label>
                                        <Form.Control type="email" placeholder="Enter Email" className='form-section' onChange={handleChange} value={user_email} name="user_email" />
                                        <Form.Text className="text-muted">
                                            {error && user_email?.length <= 0 ? <span className='text-danger'>Email is Required</span> : null}

                                        </Form.Text>
                                    </Form.Group>
                                </div>

                                <div className='mb-2'>
                                    <Form.Group className="mb-1">
                                        <Form.Label className="label-texts">Message</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            placeholder="Leave a comment here"
                                            style={{ height: '100px' }}
                                            className='form-section'
                                            onChange={handleChange} value={user_message}
                                            name="user_message"
                                        />
                                        <Form.Text className="text-muted">
                                            {error && user_message?.length <= 0 ? <span className='text-danger'>Message is Required</span> : null}

                                        </Form.Text>
                                    </Form.Group>
                                </div>

                                <div>
                                    {success && <div className='text-success'>Message Send Successfully!</div>}
                                </div>

                                <div className='mt-1'>
                                    <button variant="primary" type="submit" className='buttonsubmit mt-3'>
                                        {loader ? <>Loading...</> : <>Submit</>}
                                    </button>
                                </div>
                            </Form>
                        </div>
                    </div>

                    <div className='right-contact-box'>
                        <div data-aos="fade-right"
                            data-aos-offset="500"
                        >
                            <img src={contactimg} alt="no image" className='contactimage' />

                        </div>
                        <div >
                            {ContactDatas?.conntactList?.map((item, index) => {
                                return (
                                    <div>
                                        <div className='box-forms mb-3 mt-2'>
                                            <div>
                                                {item?.image}
                                            </div>
                                            <div className='contactname'>
                                                {item?.name}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>


                    </div>
                </div>
            </div>

        </div>
    )
}

export default Contact