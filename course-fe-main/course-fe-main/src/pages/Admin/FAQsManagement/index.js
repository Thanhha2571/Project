/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    TeamOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Table, Space, Modal } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Update_Information from '../../../components/Update-Information';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ApiClient } from '../../../interceptors/axios';

const { Header, Sider, Content } = Layout;
const FAQsManagement = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [stateFaqs, setStateFaqs] = useState([]);
    const [addOpen, setAddOpen] = useState(false);
    useEffect(() => {
        getData();
    }, [])
    const getData = async () => {
        await ApiClient().get('admin/all-faqs').then(res => {
            setStateFaqs(res.data.faqs)
        })
    }

    // -----------------------------ADD MODAL--------------
    const { register, handleSubmit } = useForm();
    const showAddModal = () => {
        setAddOpen(true)
    }
    const handleAddOk = () => {
        setAddOpen(false)
    }
    const handleAddCancel = () => {
        setAddOpen(false)
    }
    const onAddSubmit = async (data) => {
        await ApiClient().post('admin/create-faq', data).then(res => {
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


    // ---------------------------DELETE MODAL-----------
    const [delOpen, setDelOpen] = useState(false);
    const [_id, setId] = useState();
    const showDeleteModal = (e) => {
        const _id = e.currentTarget.dataset.id;
        setId(_id);
        setDelOpen(true)
    }
    const handleDelOk = () => {
        setDelOpen(false);
        handleDelete(_id);
    }
    const handleDelCancel = () => {
        setDelOpen(false)
    }
    const handleDelete = async (_id) => {
        await ApiClient().get(`admin/delete-faq/${_id}`).then(res => {
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
    // ---------------------------EDIT MODAL-------------
    const [editOpen, setEditOpen] = useState(false);
    const [dataFaq, setDataFaq] = useState([]);
    const [faqID, setFaqID] = useState();
    const showEditModal = (e) => {
        const _id = e.currentTarget.dataset.id;
        const data = stateFaqs.filter(stateFaq => stateFaq._id == _id)
        const data_faq = {
            faq_question: data[0].faq_question,
            faq_answer: data[0].faq_answer
        }

        setDataFaq(data_faq);
        setEditOpen(true);
        setFaqID(_id)
    }
    const handleEditOk = () => {
        setEditOpen(false)
    }
    const handleEditCancel = () => {
        setEditOpen(false)
    }
    const onEditSubmit = async (data) => {
        await ApiClient().post(`admin/update-faq/${faqID}`, data).then(res => {
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
                handleEditOk();
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
    const onSearchSubmit = async (data) => {
        await ApiClient().get(`admin/search-faq/${data.key}`).then(res => {
            setStateFaqs(res.data.faqs);
            if (res.data.faqs.length == 0) {
                toast.error('Không tìm thấy FAQ !', {
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
    const columns = [
        {
            title: 'Tên Câu Hỏi',
            dataIndex: 'faq_question',
            key: 'faq_question',
        },
        {
            title: 'Câu Trả Lời',
            dataIndex: 'faq_answer',
            key: 'faq_answer',
        },
        {
            title: 'Action',
            key: 'Action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" style={{ backgroundColor: 'red' }} data-id={record._id} onClick={showDeleteModal} >Xoá</Button>
                    <Button type="primary" style={{ backgroundColor: 'green' }} data-id={record._id} onClick={showEditModal}>Sửa</Button>
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
                    defaultSelectedKeys={['4']}
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
                        position: 'relative'
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
                        minHeight: 280,
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
                    <Button className='mb-4' type='primary' style={{ backgroundColor: 'blue' }} onClick={showAddModal}>Thêm FAQs</Button>
                    <Table columns={columns} dataSource={stateFaqs} rowKey={(record) => record.email} />
                </Content>
            </Layout>
            {/* ADD */}
            <Modal
                title="Thêm FAQ"
                open={addOpen}
                onOk={handleAddOk}
                onCancel={handleAddCancel}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}

            >
                <div>
                    <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onAddSubmit)}>
                        <div>
                            <label htmlFor="faq_question" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">FAQ Question</label>
                            <input type="text" {...register('faq_question')} placeholder="Enter FAQ Question" name="faq_question" id="faq_question" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label htmlFor="faq_answer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">FAQ Answer</label>
                            <input type="text" {...register('faq_answer')} placeholder="Enter FAQ Answer" name="faq_answer" id="faq_answer" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Gửi</button>
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
                <p>Câu hỏi sẽ bị xoá vĩnh viễn.
                    <br />
                    Bạn có muốn tiếp tục ?</p>
            </Modal>
            {/* EDIT */}
            <Modal
                title="Sửa FAQ"
                open={editOpen}
                onOk={handleEditOk}
                onCancel={handleEditCancel}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <div>
                    <form className="space-y-1 md:space-y-6 mt-4 mb-10" onSubmit={handleSubmit(onEditSubmit)}>
                        <div>
                            <label htmlFor="faq_question" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">FAQ Question</label>
                            <input type="text" {...register('faq_question')} defaultValue={dataFaq.faq_question} name="faq_question" id="faq_question" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label htmlFor="faq_answer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">FAQ Answer</label>
                            <input type="text" {...register('faq_answer')} defaultValue={dataFaq.faq_answer} placeholder="Enter FAQ Answer" name="faq_answer" id="faq_answer" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Gửi</button>
                    </form>
                </div>
            </Modal>
        </Layout>
    );
};
export default FAQsManagement;