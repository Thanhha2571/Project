/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Table, Badge, Space, Modal } from 'antd';
import Update_Information from '../../../components/Update-Information';
import { ApiClient } from '../../../interceptors/axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
const { Header, Sider, Content } = Layout;
const Subject = () => {
    const [collapsed, setCollapsed] = useState(false);
    const nav = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [state, setState] = useState();
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        await ApiClient().get('teacher/all-subject').then(res => {
            if (res.status != 200) {
                nav('/login')
            } else if (res.data.data.length < 1) {
                toast.error('Chưa Có Môn Học Được Tạo !!!', {
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
                setState(res.data.data)
            }
        })
    }

    // ---------------------------------------- ADD MODAL ------------------------
    const [addOpen, setAddModal] = useState(false);
    const { register, handleSubmit } = useForm();
    const showAddModal = () => {
        setAddModal(true);
    }
    const handleAddOk = () => {
        setAddModal(false);
    }
    const handleAddCancel = () => {
        setAddModal(false);
    }
    const onAddSubmit = async (data) => {
        await ApiClient().post('teacher/create-subject', data).then(res => {
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
                handleAddOk();
            } else {
                nav('/login')
            }
        })
    }
    // ----------------------------------------DELETE MODAL --------------------------
    const [delOpen, setDelOpen] = useState(false);
    const [subjectData, setSubjectData] = useState([]);
    const showDeleteModal = (e) => {
        setDelOpen(true)
        const data =
        {
            name: e.currentTarget.dataset.name,
            _id: e.currentTarget.dataset.id
        }
        setSubjectData(data)
    }
    const handleDelCancel = () => {
        setDelOpen(false)
    }
    const handleDelOk = () => {
        deleteSubject(subjectData);
        setDelOpen(false)
    }
    const deleteSubject = async (subjectData) => {
        await ApiClient().get(`teacher/delete-subject/${subjectData._id}`).then(res => {
            if (res.status != 200) {
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
            } else {
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
                getData();
            }
        })
    }
    // ----------------------------------------EDIT MODAL-------------------
    const [editOpen, setEditOpen] = useState(false);
    const showEditModal = (e) => {
        const data =
        {
            name: e.currentTarget.dataset.name,
            _id: e.currentTarget.dataset.id,
        }
        setEditOpen(true)
        setSubjectData(data)
    }
    const handleEditOk = () => {
        setEditOpen(false)
    }
    const handleEditCancel = () => {
        setEditOpen(false)
    }
    const onEditSubmit = async (data) => {
        await ApiClient().post(`teacher/edit-subject/${subjectData._id}`, data).then(res => {
            if (res.status != 200) {
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
            } else {
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
                handleEditOk();
                getData();
            }
        })
    }
    const columns = [
        {
            title: 'ID Môn Học',
            dataIndex: 'sub_id',
            key: 'sub_id'
        },
        {
            title: 'Tên Môn Học',
            dataIndex: 'sub_name',
            key: 'sub_name'
        },
        {
            title: 'Giảng Viên',
            dataIndex: 'teacher_email',
            key: 'teacher_email'
        },
        {
            title: 'Action',
            key: 'Action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" style={{ backgroundColor: 'red' }} data-id={record._id} data-name={record.sub_name} onClick={showDeleteModal}>Xoá</Button>
                    <Button type="primary" style={{ backgroundColor: 'green' }} data-id={record._id} data-name={record.sub_name} onClick={showEditModal} >Sửa</Button>
                </Space>
            ),
        },
    ];
    return (
        <Layout className='h-screen'>
            <Sider trigger={null} collapsible collapsed={!collapsed}>
                <Menu
                    theme="dark"
                    mode="inline"
                    className='mt-7'
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: <Link to="/teacher" rel="noopener noreferrer">
                                Quản Lý Khoá Học
                            </Link>,
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                        position: 'relative'
                    }}
                >
                    {/* <Update_Information /> */}
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
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    <Space>
                        <Button className='mb-5' type="primary" style={{ backgroundColor: 'blue' }} onClick={showAddModal} >Thêm Môn Học</Button>
                    </Space>
                    <Table columns={columns} dataSource={state} rowKey={(record) => record.course_id} />
                </Content>
                {/* ADD */}
                <Modal
                    open={addOpen}
                    onOk={handleAddOk}
                    onCancel={handleAddCancel}
                    okButtonProps={{ style: { display: 'none' } }}
                    cancelButtonProps={{ style: { display: 'none' } }}
                >
                    <div>
                        <form className="space-y-4 md:space-y-6 mt-4" onSubmit={handleSubmit(onAddSubmit)}>
                            <div>
                                <label htmlFor="sub_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">ID Môn Học</label>
                                <input type="text" {...register("sub_id")} placeholder="Nhập ID Môn Học" name="sub_id" id="sub_id" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div>
                                <label htmlFor="sub_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Khoá Học</label>
                                <input type="text" {...register("sub_name")} placeholder="Nhập Tên Môn Học" name="sub_name" id="course_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Submit</button>
                        </form>
                    </div>
                </Modal>
                {/* DELETE */}
                <Modal
                    open={delOpen}
                    onOk={handleDelOk}
                    onCancel={handleDelCancel}
                    okButtonProps={{ style: { backgroundColor: 'red' } }}
                >
                    <p><strong>{subjectData.name}</strong> sẽ bị xoá vĩnh viễn.
                        <br />
                        Bạn có muốn tiếp tục ?</p>
                </Modal>
                {/* EDIT */}
                <Modal
                    open={editOpen}
                    onOk={handleEditOk}
                    onCancel={handleEditCancel}
                    okButtonProps={{ style: { display: 'none' } }}
                    cancelButtonProps={{ style: { display: 'none' } }}
                >
                    <div>
                        <form className="space-y-4 md:space-y-6 mt-4" onSubmit={handleSubmit(onEditSubmit)}>
                            <div>
                                <label htmlFor="sub_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Khoá Học</label>
                                <input type="text" {...register("sub_name")} defaultValue={subjectData.name} placeholder="Nhập Tên Môn Học" name="sub_name" id="course_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Submit</button>
                        </form>
                    </div>
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
            </Layout>
        </Layout>
    );
};
export default Subject;