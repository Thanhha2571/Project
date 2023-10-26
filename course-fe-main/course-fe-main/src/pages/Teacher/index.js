import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form"
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, theme, Table, Space, Modal, Radio, Badge } from 'antd';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Update_Information from '../../components/Update-Information';
import { ApiClient } from '../../interceptors/axios';
import axios from 'axios';
const { Header, Sider, Content } = Layout;



const Teacher = () => {
    const [collapsed, setCollapsed] = useState(false);
    const nav = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [state, setState] = useState([]);
    const getData = async () => {
        await ApiClient().get('teacher/all-course').then(res => {
            if (res.status == 200) {
                setState(res.data.data)
                // console.log(res.data);
            } else {
                nav('/login')
            }
        })
    }
    useEffect(() => {
        getData();
    }, []);
    // ------------------------------------------------ADD MODAL--------------------------------
    const [addOpen, setAddOpen] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [subId, setSubId] = useState();
    const [file, setFile] = useState({ preview: '', fileData: '' });
    const showAddModal = async () => {
        await ApiClient().get('teacher/all-subject').then(res => {
            if (res.status == 200) {
                setSubjects(res.data.data)
                setAddOpen(true);
            } else {
                nav('/login');
            }
        });
    };
    const arrayDataItems = subjects.map(subject =>
        <option key={subject.sub_id} value={subject.sub_id}>
            {subject.sub_name}
        </option>
    )
    const onSubjectChange = (e) => {
        if (e.target.value == 'add') {
            nav('/teacher/subject')
        } else {
            setSubId(e.target.value);
        }
    }
    const handleAddOk = async () => {
        setAddOpen(false);
    };
    const handleAddCancel = () => {
        setAddOpen(false);
    };
    const [status, setStatus] = useState(true);
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
        if (!file.fileData) {
            return toast.error('Vui Lòng Nhập Hình Ảnh', {
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

        const formData = new FormData();
        formData.append('image', file.fileData);
        formData.append('sub_id', subId);
        formData.append('course_id', data['course_id']);
        formData.append('course_name', data['course_name']);
        formData.append('course_description', data['course_description']);
        formData.append('course_price', data['course_price']);
        formData.append('dateStart', data['dateStart']);
        formData.append('dateEnd', data['dateEnd']);
        formData.append('course_status', status);
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
        await axios.post('http://localhost:8081/api/teacher/create-course', formData, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
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
                handleAddOk();
                getData();
            }
        })
    }
    // ---------------------------------------------DELETE MODAL--------------------------
    const [courseName, setCourseName] = useState();
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [courseId, setCourseId] = useState();
    const showDeleteModal = (event) => {
        const name = event.currentTarget.dataset.name;
        const data_id = event.currentTarget.dataset.id;
        setCourseId(data_id);
        setCourseName(name);
        setDeleteOpen(true);
    };
    const handleDeleteOk = async () => {
        deleteCourse(courseId)
        setDeleteOpen(false)
    }
    const handleDeleteCancel = () => {
        setDeleteOpen(false)
    }
    const deleteCourse = (courseId) => {
        ApiClient().get(`teacher/delete-course/${courseId}`).then(res => {
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
                getData();
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
    // ---------------------------------------------EDIT MODAL------------------------------------
    const [editOpen, setEditOpen] = useState(false);
    const [editStatus, setEditStatus] = useState();
    const [courseEdit, setCourseEdit] = useState([]);
    const showEditModal = async (event) => {
        const _id = event.currentTarget.dataset.id;
        await ApiClient().get(`teacher/course/${_id}`).then(async res => {
            await setCourseEdit(res.data.course);
        });
        setEditOpen(true);
    };
    const handleEditCancel = () => {
        setEditOpen(false);
    };
    const onEditSubmit = async (data) => {
        const data_upload = {
            course_id: data['course_id'],
            course_name: data['course_name'],
            course_price: data['course_price'],
            course_description: data['course_description'],
            dateStart: data['dateStart'],
            dateEnd: data['dateEnd'],
            course_status: editStatus
        }
        await ApiClient().post('teacher/edit-course', data_upload).then(res => {
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
                setEditOpen(false);
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
    const onEditChangeStatus = (e) => {
        setEditStatus(e.target.value)
    }
    // ---------------------------------------------SEARCH----------------------------
    const { register, handleSubmit } = useForm();
    const onSearchSubmit = async (data) => {
        await ApiClient().get(`teacher/search-course/${data.key}`).then(res => {
            // console.log(res);
            setState(res.data.record);
            if (res.data.record.length == 0) {
                toast.error('Không tìm thấy khoá học !', {
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
            title: 'ID Khoá Học',
            dataIndex: 'course_id',
            key: 'course_id'
        },
        {
            title: 'Tên Khoá Học',
            // dataIndex: 'course_name',
            // dataSource: 'course_slug',
            // key: 'course_name',
            render: (record) => <Link to={`/teacher/course/${record.course_slug}`}>{record.course_name}</Link>

        },
        {
            title: 'Giá Khoá Học',
            dataIndex: 'course_price',
            key: 'course_price'
        },
        {
            title: 'Mô Tả',
            dataIndex: 'course_description',
            key: 'course_description'
        },
        {
            title: 'Thời Gian Bắt Đầu',
            dataIndex: 'dateStart',
            key: 'dateStart'
        },
        {
            title: 'Thời Gian Kết Thúc',
            dataIndex: 'dateEnd',
            key: 'dateEnd'
        },
        {
            title: 'Trạng Thái',
            key: 'course_status',
            render: (record) => {
                if (record.course_status == true) {
                    return <Badge status="success" text='Public' />
                } else {
                    return <Badge status="error" text='Private' />
                }
            }
        },
        {
            title: 'Action',
            key: 'Action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" style={{ backgroundColor: 'red' }} data-id={record._id} data-name={record.course_name} onClick={showDeleteModal}>Xoá</Button>
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
                    defaultSelectedKeys={['1']}
                    className='mt-7'
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
                    <Space>
                        <Button className='mb-5' type="primary" style={{ backgroundColor: 'blue' }} onClick={showAddModal} >Thêm Khoá Học</Button>
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
                                <label htmlFor="sub_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Môn Học</label>
                                <select
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    name="subject"
                                    id="subject"
                                    onChange={onSubjectChange}>
                                    <option value="">Chọn Thể Loại Môn Học</option>
                                    {arrayDataItems}
                                    <option value={'add'}>Thêm Thể Loại</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="course_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">ID Khoá Học</label>
                                <input type="text" {...register("course_id")} placeholder="Nhập ID Khoá Học" name="course_id" id="course_id" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div>
                                <label htmlFor="course_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Khoá Học</label>
                                <input type="text" {...register("course_name")} placeholder="Nhập Tên Khoá Học" name="course_name" id="course_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div>
                                <label htmlFor="course_description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô Tả Khoá Học</label>
                                <textarea type="text" {...register("course_description")} placeholder="Nhập Mô Tả" name="course_description" id="course_description" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div>
                                <label htmlFor="course_price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Giá Khoá Học</label>
                                <input type="text" {...register("course_price")} placeholder="Nhập Giá Khoá Học" name="course_price" id="course_price" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>

                            <div>
                                <label htmlFor="dateStart" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ngày Bắt Đầu</label>
                                <input {...register('dateStart')} type="date" id="dateStart" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="dateEnd" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ngày Kết Thúc</label>
                                <input {...register('dateEnd')} type="date" id="dob" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="course_status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng Thái</label>
                                <Radio.Group onChange={onChangeStatus} id="course_status">
                                    <Radio value={true}>Public</Radio>
                                    <Radio value={false}>Private</Radio>
                                </Radio.Group>
                            </div>
                            <div>
                                <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Chọn Hình Ảnh</label>
                                <input type="file" onChange={handleChangeFile} accept='image/*' name="image" id="image" required="" multiple />
                            </div>
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Submit</button>
                        </form>
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
                </Modal>
                {/* DELETE */}
                <Modal
                    open={deleteOpen}
                    onOk={handleDeleteOk}
                    onCancel={handleDeleteCancel}
                    okButtonProps={{ style: { backgroundColor: 'red' } }}
                >
                    <p>Khoá học <strong>{courseName}</strong> sẽ bị xoá vĩnh viễn.
                        <br />
                        Bạn có muốn tiếp tục ?</p>
                </Modal>
                {/* EDIT */}
                <Modal
                    open={editOpen}
                    onCancel={handleEditCancel}
                    okButtonProps={{ style: { display: 'none' } }}
                    cancelButtonProps={{ style: { display: 'none' } }}
                >
                    <div>
                        <form className="space-y-4 md:space-y-6 mt-4" onSubmit={handleSubmit(onEditSubmit)}>
                            <div>
                                <label htmlFor="course_id" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">ID Khoá Học</label>
                                <input type="text" {...register("course_id")} defaultValue={courseEdit.course_id} placeholder="Nhập ID Khoá Học" name="course_id" id="course_id" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div>
                                <label htmlFor="course_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Khoá Học</label>
                                <input type="text" {...register("course_name")} defaultValue={courseEdit.course_name} placeholder="Nhập Tên Khoá Học" name="course_name" id="course_name" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div>
                                <label htmlFor="course_description" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Mô Tả Khoá Học</label>
                                <textarea type="text" {...register("course_description")} defaultValue={courseEdit.course_description} placeholder="Nhập Mô Tả" name="course_description" id="course_description" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div>
                                <label htmlFor="course_price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Tên Khoá Học</label>
                                <input type="text" {...register("course_price")} defaultValue={courseEdit.course_price} placeholder="Nhập Giá Khoá Học" name="course_price" id="course_price" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                            </div>
                            <div>
                                <label htmlFor="dateStart" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ngày Bắt Đầu</label>
                                <input {...register('dateStart')} defaultValue={courseEdit.dateStart} type="date" id="dateStart" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="dateEnd" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Ngày Kết Thúc</label>
                                <input {...register('dateEnd')} defaultValue={courseEdit.dateEnd} type="date" id="dob" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5  dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                            </div>
                            <div>
                                <label htmlFor="course_status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Trạng Thái</label>
                                <Radio.Group onChange={onEditChangeStatus} defaultValue={courseEdit.course_status} id="course_status">
                                    <Radio value={true}>Public</Radio>
                                    <Radio value={false}>Private</Radio>
                                </Radio.Group>
                            </div>
                            {/* <div>
                    <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Avatar</label>
                    <input type="file" {...register("image")} name="image" id="image" required="" />
                </div> */}
                            <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Submit</button>
                        </form>
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
                </Modal>
            </Layout>
        </Layout>
    );
};
export default Teacher;