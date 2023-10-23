import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import { Space, Table, Button, Layout, Menu, theme, Modal } from 'antd';
import { ApiClient } from '../../../interceptors/axios';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    TeamOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import Update_Information from '../../../components/Update-Information';

const { Header, Sider, Content } = Layout;

const StudentManagement = () => {
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
        await ApiClient().get('admin/all-student').then(async res => {
            if (res.data.success == false) {
                nav('/login')
            } else {
                setState(res.data.data)
            }
        })
    }
    // MODAL ACTION
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
                toast.success('Xoá Tài Khoản Thành Công', {
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
    const columns = [
        {
            title: 'Họ Và Tên',
            dataIndex: 'fullname',
            key: 'fullname'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phone',
            key: 'phone'
        },
        {
            title: 'Action',
            key: 'Action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" style={{ backgroundColor: 'red' }} data-id={record._id} data-email={record.email} onClick={showModal}>Delete</Button>
                    <Button type="primary" style={{ backgroundColor: 'green' }} >Update</Button>
                </Space>
            ),
        },
    ];
    const { register, handleSubmit } = useForm();
    const onSubmit = async (data) => {
        await ApiClient().get(`admin/search/${data.key}`).then(res => {
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
                        defaultSelectedKeys={['2']}
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

                        <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onSubmit)}>
                            <div className="relative mb-8">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                    </svg>
                                </div>
                                <input type="search" {...register("key")} onInput={onInput} id="default-search" className="block w-full p-4 pl-10 text-sm border border-gray-300 rounded-lg text-black bg-gray-50 focus:ring-blue-500 focus:border-blue-50 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Tìm kiếm học sinh" required />
                                <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search</button>
                            </div>
                        </form>
                        <Table columns={columns} dataSource={state} />
                    </Content>
                </Layout>
            </Layout>
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
        </div>
    );
};
export default StudentManagement;