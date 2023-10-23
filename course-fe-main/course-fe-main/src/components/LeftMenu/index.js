// /* eslint-disable jsx-a11y/anchor-is-valid */
// import React, { useState } from 'react';
// import { Link } from "react-router-dom";
// import {
//     MenuFoldOutlined,
//     MenuUnfoldOutlined,
//     UserOutlined,
//     VideoCameraOutlined,
// } from '@ant-design/icons';
// import { Layout, Menu, Button, theme, Sider } from 'antd';
// const LeftMenu = () => {
//     const [key, setKey] = useState('2')
//     return (
//         <Sider trigger={null} collapsible collapsed={collapsed}>
//             <Menu
//                 theme="dark"
//                 mode="inline"
//                 className='mt-7'
//                 defaultSelectedKeys={[2]}
//                 items={[
//                     {
//                         key: '1',
//                         icon: <UserOutlined />,
//                         label: <Link to="/admin" rel="noopener noreferrer">
//                             Quản Lý Học Sinh
//                         </Link>
//                     },
//                     {
//                         key: '2',
//                         icon: <VideoCameraOutlined />,
//                         label: <Link to="/student-management" rel="noopener noreferrer">
//                             Quản Lý Học Sinh
//                         </Link>
//                     },
//                 ]}
//             />
//         </Sider>
//     );
// };
// export default LeftMenu;