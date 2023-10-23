/* eslint-disable jsx-a11y/anchor-is-valid */
import { ApiClient } from "../../interceptors/axios";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import React, { useEffect, useState } from 'react';
import { Avatar, Dropdown, Modal, Radio } from 'antd';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form = ({ childToParent }) => {
    const { register, handleSubmit } = useForm();
    const [isActive, setActive] = useState(false);
    const [email, setEmail] = useState();
    const [fullname, setFullname] = useState();
    const [phone, setPhone] = useState();
    const [sex, setSex] = useState();
    const [dob, setDob] = useState();
    const [password, setPassword] = useState();
    useEffect(() => {
        getProfile();
    }, []);
    const getProfile = async () => {
        await ApiClient().get('account/get-profile').then(async res => {
            if (res.status == 200) {
                setEmail(res.data.data.email);
                setFullname(res.data.data.fullname);
                setPhone(res.data.data.phone);
                setSex(res.data.data.sex);
                setDob(res.data.data.dob);
                setPassword(res.data.data.password);
            } else {
                toast.error(`${res.data.msg}`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        })
    }
    const onChange = (e) => {
        setActive(true);
        setSex(e.target.value);
    };
    const onInput = (e) => {
        if (e.target.value.length < 1) {
            setActive(false)
        } else {
            setActive(true)
        }
    };
    const onSubmit = (data) => {
        if (data.password.length < 6) {
            return toast.error("Mật Khẩu Phải Lớn Hơn 6 Ký Tự", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        }
        if (data.password != data.confirmPassword) {
            return toast.error("Mật Khẩu Không Trùng Khớp", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });
        }
        const data_upload = {
            fullname: (data.fullname.length < 1) ? fullname : data.fullname,
            email: data.email,
            dob: (data.dob.length < 1) ? dob : data.dob,
            phone: (data.phone.length < 1) ? phone : data.phone,
            password: (data.password.length < 1) ? password : data.password,
            sex: sex,
            // avatar: data.avatar
        }
        ApiClient().post('account/update-information', data_upload).then(async res => {
            if (res.status == 200) {
                toast.success(`${res.data.msg}`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            } else {
                toast.error(`${res.data.msg}`, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
            }
        })
    }
    return (
        <form className="space-y-4 md:space-y-6 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Họ Và Tên</label>
                <input type="text" {...register("fullname")} onInput={onInput} defaultValue={fullname} placeholder="Enter Your Full Name" name="fullname" id="fullname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
            </div>
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
                <input type="text" {...register("email")} defaultValue={email} placeholder="Enter Your Email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" disabled />
            </div>
            <div>
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Số Điện Thoại</label>
                <input type="text" defaultValue={phone} {...register("phone")} onInput={onInput} placeholder="Enter Your Phone" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mật Khẩu Mới</label>
                <input type="password" defaultValue={password} {...register("password")} name="password" onInput={onInput} placeholder="Enter Your New Password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
            </div>
            <div>
                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Xác Nhận Mật Khẩu</label>
                <input type="password" defaultValue={password} {...register("confirmPassword")} name="confirmPassword" placeholder="Confirm New Password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
            </div>
            <div>
                <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ngày Sinh</label>
                <input {...register('dob')} defaultValue={dob} type="date" id="dob" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
            </div>
            <div>
                <label htmlFor="sex" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Giới Tính</label>
                <Radio.Group onChange={onChange} value={sex} id="sex">
                    <Radio value={'male'}>Male</Radio>
                    <Radio value={'female'}>Female</Radio>
                    <Radio value={'other'}>Other</Radio>
                </Radio.Group>
            </div>
            {/* <div>
                <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Avatar</label>
                <input type="file" {...register("avatar")} name="avatar" id="avatar" required="" />
            </div> */}

            <button disabled={!isActive} type="submit" onClick={() => childToParent()} className={isActive ? "w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" : "w-full text-white bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-200 dark:hover:bg-primary-200 dark:focus:ring-primary-800"}>Submit</button>
        </form>
    )
}






const Update_Information = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false)
    }
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const childToParent = () => {
        handleOk();
    }
    const items = [
        {
            label: <p onClick={showModal}>Cập Nhật Thông Tin</p>,
            key: '0',
        },
        {
            type: 'divider',
        },
        {
            label: <Link to="/logout" rel="noopener noreferrer">Đăng Xuất</Link>,
            key: '3',
        },
    ];
    return (
        <div>
            <Dropdown
                menu={{
                    items,
                }}
                trigger={['click']}

            >
                <a style={{
                    verticalAlign: 'middle',
                    position: 'absolute',
                    right: '0',
                    marginRight: '24px'
                }} onClick={(e) => e.preventDefault()}>
                    <Avatar
                        size="large"
                        src="img/avatar-dog.jpeg"
                    >
                    </Avatar>
                </a>
            </Dropdown>
            <Modal
                title="Cập Nhật Thông Tin Cá Nhân"
                open={isModalOpen}
                onCancel={handleCancel}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}>
                <Form childToParent={childToParent} />
            </Modal>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
    )
}
export default Update_Information;