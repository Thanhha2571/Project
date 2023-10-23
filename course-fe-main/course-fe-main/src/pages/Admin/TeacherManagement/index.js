import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

import { useForm } from "react-hook-form"
import { toast } from 'react-toastify';
import { Space, Table, Button, Layout, Menu, theme, Modal, Radio, Badge, Avatar } from 'antd';
import { ApiClient } from '../../../interceptors/axios';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    TeamOutlined,
    HomeOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import Update_Information from '../../../components/Update-Information';
import axios from 'axios';
const { Header, Sider, Content } = Layout;


const EditTeacherForm = ({ parent2child, hiddenModalEdit, reloadPage }) => {
    const { register, handleSubmit } = useForm();
    const [status, setStatus] = useState();
    const [email, setEmail] = useState();
    const [fullname, setFullname] = useState();
    const [phone, setPhone] = useState();
    const [sex, setSex] = useState();
    const [dob, setDob] = useState();
    const [isActive, setActive] = useState(false);
    useEffect(() => {
        getProfile();
    }, [parent2child]);
    const getProfile = async () => {
        await ApiClient().get(`admin/update-getProfile/${parent2child}`).then(async res => {
            if (res.status === 200) {
                setEmail(res.data.data.email);
                setFullname(res.data.data.fullname);
                setPhone(res.data.data.phone);
                setDob(res.data.data.dob);
                setStatus(res.data.data.status);
                setSex(res.data.data.sex);
            }
        })
    }
    const onChange = (e) => {
        setActive(true);
        setSex(e.target.value);
    };
    const onChangeStatus = (e) => {
        setActive(true)
        setStatus(e.target.value);
    };
    const onInput = (e) => {
        if (e.target.value.length < 1) {
            setActive(false)
        } else {
            setActive(true)
        }
    };
    const onSubmitEdit = (data) => {
        const data_upload = {
            fullname: (data.fullname.length < 1) ? fullname : data.fullname,
            dob: (data.dob.length < 1) ? dob : data.dob,
            phone: (data.phone.length < 1) ? phone : data.phone,
            sex: sex,
            status: status
            // avatar: data.avatar
        }
        ApiClient().post(`admin/update-teacher/${parent2child}`, data_upload).then(async res => {
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
    const handleClick = () => {
        hiddenModalEdit();
        reloadPage();
    }
    return (
        <div>
            <form className="space-y-4 md:space-y-6 mt-4" onSubmit={handleSubmit(onSubmitEdit)}>
                <div>
                    <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Full Name</label>
                    <input type="text" {...register("fullname")} onInput={onInput} defaultValue={fullname} name="fullname" id="fullname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>
                <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
                    <input type="email" {...register("email")} defaultValue={email} name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-300 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" disabled />
                </div>
                <div>
                    <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phone</label>
                    <input type="text" {...register("phone")} onInput={onInput} defaultValue={phone} name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                </div>
                <div>
                    <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Day Of Birth</label>
                    <input {...register('dob')} onInput={onInput} type="date" id="dob" defaultValue={dob} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                </div>
                <div>
                    <label htmlFor="sex" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Sex</label>
                    <Radio.Group onChange={onChange} id="sex" value={sex}>
                        <Radio value={'male'}>Male</Radio>
                        <Radio value={'female'}>Female</Radio>
                        <Radio value={'other'}>Other</Radio>
                    </Radio.Group>
                </div>
                <div>
                    <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng Thái</label>
                    <Radio.Group onChange={onChangeStatus} id="status" value={status}>
                        <Radio value={true}>Active</Radio>
                        <Radio value={false}>Block</Radio>
                    </Radio.Group>
                </div>
                <button disabled={!isActive} onClick={handleClick} type="submit" className={isActive ? "w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800" : "w-full text-white bg-primary-200 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-200 dark:hover:bg-primary-200 dark:focus:ring-primary-800"}>Submit</button>
            </form>
        </div>
    )
}


const TeacherManagement = () => {
    const nav = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [state, setState] = useState([]);

    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        await ApiClient().get('admin/all-teacher').then(async res => {
            if (res.data.success == false) {
                nav('/login')
            } else {
                setState(res.data.data);
            }
        })
    }
    // MODAL ACTION DELETE
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState();
    const [_id, setId] = useState();
    const showModal = (event) => {
        const emailText = event.currentTarget.dataset.email;
        const data_id = event.currentTarget.dataset.id
        setEmail(emailText)
        setId(data_id)
        setOpen(true);
    };
    const handleOk = () => {
        setOpen(false);
        deleteAccount(_id);
    };
    const deleteAccount = (_id) => {
        ApiClient().get(`admin/delete-account/${_id}`).then(res => {
            if (res.status == 200) {
                getData();
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
    const handleCancel = () => {
        setOpen(false);
    };
    // END MODAL ACTION DELETE

    // MODAL ACTION EDIT
    const [editOpen, setEditOpen] = useState(false);
    const [data2child, setData2child] = useState();
    const showModalEdit = async (event) => {
        const profile_id = event.currentTarget.dataset.id;
        setData2child(profile_id);
        setEditOpen(true);
    };
    const handleEditOk = () => {
        setEditOpen(false);
    };
    const handleEditCancel = () => {
        setEditOpen(false);
    };

    const hiddenModalEdit = () => {
        handleEditOk();
    }
    const reloadPage = () => {
        getData();
    }
    // END MODAL EDIT


    // MODAL ADD TEACHER
    const [addOpen, setAddOpen] = useState(false);
    const showModalAddTeacher = () => {
        setAddOpen(true);
    };
    const handleAddOk = async () => {
        setAddOpen(false);
        getData();
    };
    const handleAddCancel = () => {
        setAddOpen(false);
    };
    const hiddenModal = (render) => {
        handleAddOk();
    }
    const { register, handleSubmit } = useForm();
    const [value, setValue] = useState('male');
    const [status, setStatus] = useState(true)
    const [file, setFile] = useState({ preview: '', fileData: '' });
    const onChange = (e) => {
        setValue(e.target.value);
    };
    const onChangeStatus = (e) => {
        setStatus(e.target.value);
    };
    const handleChangeFile = (e) => {
        const img = {
            preview: URL.createObjectURL(e.target.files[0]),
            fileData: e.target.files[0],
        }
        setFile(img);
    }
    const onAddSubmit = async (data) => {
        let formData = new FormData();
        formData.append('file', file.fileData);
        formData.append('email', data['email']);
        formData.append('fullname', data['fullname']);
        formData.append('password', data['password']);
        formData.append('phone', data['phone']);
        formData.append('dob', data['dob']);
        formData.append('sex', value);
        formData.append('status', status);
        axios.interceptors.request.use(
            (config) => {
                const email = localStorage.getItem("accessToken");
                if (email) {
                    config.headers.Authorization = email;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
        await axios.post('http://localhost:8081/api/admin/create-teacher', formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            }
        }).then((res) => {
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
                handleAddOk();
                getData();
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
    // END MODAL ACTION CREATE TEACHER
    const columns = [
        {
            title: 'Họ Và Tên',
            dataIndex: 'fullname',
            key: 'fullname',
        },
        {
            title: 'Email',
            // dataIndex: 'email',
            key: 'email',
            render: (record) => {
                // let image = `data:${record.avatar.contentType};base64,${record.avatar.toString('base64')}`;
                return (
                    <div>
                        <Avatar src={`http://localhost:8081/uploads/avatar/${record.email}/${record.avatar}`} />
                        <p className='inline ml-4'>{record.email}</p>
                    </div>
                );
            }
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Trạng Thái',
            key: 'status',
            render: (record) => {
                if (record.status == true) {
                    return <Badge status="success" text='Hoạt động' />
                } else {
                    return <Badge status="error" text='Đang bị khoá' />
                }
            }
        },
        {
            title: 'Action',
            key: 'Action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" style={{ backgroundColor: 'red' }} data-id={record._id} data-email={record.email} onClick={showModal}>Xoá</Button>
                    <Button type="primary" style={{ backgroundColor: 'green' }} data-id={record._id} data-email={record.email} onClick={showModalEdit}>Sửa</Button>
                    {/* <Button type="primary" style={{ backgroundColor: 'blue' }} onClick={showModal} >Xem Thông Tin</Button> */}
                </Space>
            ),
        },
    ];
    // SEARCH
    const onSearchSubmit = async (data) => {
        await ApiClient().get(`admin/search-teacher/${data.key}`).then(res => {
            setState(res.data.record);
            if (res.data.record.length == 0) {
                toast.error('Không tìm thấy tài khoản !', {
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
    const onInput = (e) => {
        if (e.target.value.length < 1) {
            getData();
        }
    }
    return (
        <div>
            <Layout className='h-screen'>
                <Sider trigger={null} collapsible collapsed={!collapsed}>
                    <Menu
                        theme="dark"
                        mode="inline"
                        className='mt-7'
                        defaultSelectedKeys={['3']}
                        items={[
                            {
                                key: '1',
                                icon: <HomeOutlined />,
                                label: <Link to="/admin" rel="noopener noreferrer">
                                    Dashboard
                                </Link>
                            },
                            {
                                key: '2',
                                icon: <TeamOutlined />,
                                label: <Link to="/student-management" rel="noopener noreferrer">
                                    Quản Lý Học Sinh
                                </Link>
                            },
                            {
                                key: '3',
                                icon: <TeamOutlined />,
                                label: <Link to="/teacher-management" rel="noopener noreferrer">
                                    Quản Lý Giảng Viên
                                </Link>
                            },
                            {
                                key: '4',
                                icon: <QuestionCircleOutlined />,
                                label: <Link to="/faqs-management" rel="noopener noreferrer">
                                    Quản Lý Câu Hỏi Thường Gặp
                                </Link>
                            },
                        ]}
                    />
                </Sider>
                <Layout>
                    <Header
                        style={{
                            padding: 0,
                            background: colorBgContainer,
                        }}
                    >
                        <Update_Information />
                        <Button
                            type="text"
                            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: colorBgContainer,
                        }}
                    >
                        <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onSearchSubmit)}>
                            <div className="relative mb-8">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" {...register("key")} onInput={onInput} id="default-search" className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm giảng viên" required />
                                <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                            </div>
                        </form>
                        <Space>
                            <Button className='mb-5' type="primary" style={{ backgroundColor: 'blue' }} onClick={showModalAddTeacher} >Thêm Giảng Viên</Button>
                        </Space>
                        <Table columns={columns} dataSource={state} rowKey={(record) => record.email} />
                    </Content>
                </Layout>
            </Layout>
            {/* DELETE */}
            <Modal
                title="Xoá Tài Khoản"

                open={open}
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{ style: { backgroundColor: 'red' } }}
            >
                <p>Tài khoản <strong>{email}</strong> bị xoá vĩnh viễn.
                    <br />
                    Bạn có muốn tiếp tục ?</p>
            </Modal>
            {/* ADD */}
            <Modal
                title="Thêm Tài Khoản"
                open={addOpen}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}

            >
                {/* <AddTeacherForm hiddenModal={hiddenModal} /> */}
                <div>
                    <form className="space-y-4 md:space-y-6 mt-4" onSubmit={handleSubmit(onAddSubmit)}>
                        <div>
                            <label htmlFor="fullname" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Full Name</label>
                            <input type="text" {...register('fullname')} placeholder="Enter Full Name" name="fullname" id="fullname" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
                            <input type="email" {...register('email')} placeholder="Enter Email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Password</label>
                            <input type="password" {...register('password')} placeholder="**********" name="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Phone</label>
                            <input type="text" {...register('phone')} placeholder="Enter Phone" name="phone" id="phone" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label htmlFor="dob" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Day Of Birth</label>
                            <input type="date" {...register('dob')} id="dob" name='dob' className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                        </div>
                        <div>
                            <label htmlFor="sex" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Sex</label>
                            <Radio.Group onChange={onChange} id="sex" name='sex'>
                                <Radio value={'male'}>Male</Radio>
                                <Radio value={'female'}>Female</Radio>
                                <Radio value={'other'}>Other</Radio>
                            </Radio.Group>
                        </div>
                        <div>
                            <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng Thái</label>
                            <Radio.Group id="status" name='status' onChange={onChangeStatus}>
                                <Radio value={true}>Active</Radio>
                                <Radio value={false}>Block</Radio>
                            </Radio.Group>
                        </div>
                        <div>
                            <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Avatar</label>
                            <input type="file" accept='image/*' name='file' onChange={handleChangeFile} />
                        </div>
                        <button type="submit" onClick={() => hiddenModal()} className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Submit</button>
                    </form>
                </div>
            </Modal>
            {/* EDIT */}
            <Modal
                open={editOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <EditTeacherForm parent2child={data2child} hiddenModalEdit={hiddenModalEdit} reloadPage={reloadPage} />
            </Modal>
        </div>
    );
};
export default TeacherManagement;