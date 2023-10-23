/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { ApiClient } from '../../interceptors/axios';
import { Space, Table, Button, Modal, Alert } from 'antd';
import axios from 'axios';

function Following() {
    const [state, setState] = useState([]);
    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        await ApiClient().get('admin/all-student').then(async res => {
            console.log(res);
            setState(res.data.data)
        })
    }
    const columns = [
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            key: 'fullname'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email'
        },
        {
            title: 'Action',
            key: 'Action',
            render: (record) => (
                <Space size="middle">
                    <Button type="primary" style={{ backgroundColor: 'red' }} data-tag={record.id}>Remove</Button>
                    <Button type="primary" style={{ backgroundColor: 'green' }} >Update</Button>
                </Space>
            ),
        },
    ];

    return <Table columns={columns} dataSource={state} />;

}
export default Following;