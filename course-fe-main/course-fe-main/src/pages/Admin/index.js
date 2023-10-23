/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    HomeOutlined,
    TeamOutlined,
    QuestionCircleOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, theme } from 'antd';
import Update_Information from '../../components/Update-Information';
const { Header, Sider, Content } = Layout;
const Admin = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const [key, setKey] = useState('1')
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
                    Dashboard
                </Content>
            </Layout>
        </Layout>
    );
};
export default Admin;