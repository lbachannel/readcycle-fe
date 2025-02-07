import { getAllUsersAPI } from '@/services/api';
import { dateValidate } from '@/services/helper';
import { PlusOutlined } from '@ant-design/icons';
import { CloudUploadOutlined, EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';
import { useRef, useState } from 'react';

const columns: ProColumns<IUserTable>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },

    {
        title: 'Id',
        dataIndex: 'id',
        hideInSearch: true,
        ellipsis: true,
        tooltip: "User id",
        render(dom, entity, index, action, schema) {
            return (
                <a href="#">{entity.id}</a>
            )
        },
    },

    {
        title: "Name",
        dataIndex: "name",
        ellipsis: true,
        tooltip: "User name"
    },

    {
        title: "Email",
        dataIndex: "email",
        copyable: true,
        ellipsis: true,
        tooltip: "Email"
    },

    {
        title: "Birthday",
        dataIndex: "dateOfBirth",
        valueType: "date",
        ellipsis: true,
        tooltip: "Date of birth",
        sorter: true
    },

    {
        title: "Role",
        dataIndex: ["role","name"],
        ellipsis: true,
        tooltip: "Role",
        valueType: 'select',
        valueEnum: {
            admin: { text: 'Admin' },
            user: { text: 'User' }
        }, 
    },

    {
        title: 'Action',
        hideInSearch: true,
        render() {
            return (
                <>
                    <EditTwoTone
                        twoToneColor="#f57800"
                        style={{ cursor: "pointer" }}
                    />
                    <Popconfirm
                        placement="leftTop"
                        title={"Confirm delete user"}
                        description={"Are you sure you want to delete this user ?"}
                        okText="Confirm"
                        cancelText="Cancel"
                    >
                        <span style={{ cursor: "pointer", marginLeft: 20 }}>
                            <DeleteTwoTone
                                twoToneColor="#ff4d4f"
                                style={{ cursor: "pointer" }}
                            />
                        </span>
                    </Popconfirm>
                </>
            )
        }
    }
];

type TSearch = {
    name: string;
    email: string;
    dateOfBirth: string;
    role: {
        name: string;
    }
}

const TableUser = () => {
    const actionRef = useRef<ActionType>();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 1,
        pages: 0,
        total: 0
    })

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async (params, sort) => {
                    let query = "";
                    if (params) {
                        query += `page=${(params?.current ?? 1) - 1}&size=${params?.pageSize ?? 5}`;
                        
                        const filters = [];
                        if (params.name) {
                            filters.push(`name~'${params.name}'`)
                        }
                        if (params.email) {
                            filters.push(`email~'${params.email}'`);
                        }
                        if (params.dateOfBirth) {
                            const yob = dateValidate(params.dateOfBirth);
                            filters.push(`dateOfBirth:'${yob}'`);
                        }
                        if (params.role) {
                            const role = params.role.name;
                            filters.push(`role.name~'${role}'`);
                        }
                        if (sort && Object.keys(sort).length > 0) {
                            const sortParams = Object.entries(sort)
                                .map(([field, sort]) => `sort=${field},${sort === 'ascend' ? 'asc' : 'desc'}`)
                                .join("&");
                            query += `&${sortParams}`;
                        }
                        if (filters.length > 0) {
                            query += `&filter=${filters.join(" or ")}`;
                        }
                        
                    }
                    const response = await getAllUsersAPI(query);
                    if (response.data) {
                        setMeta(response.data.meta);
                    }
                    return {
                        data: response.data?.result,
                        page: 1,
                        success: true,
                        total: response.data?.meta.total
                    }

                }}
                rowKey="id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize,
                    showSizeChanger: true,
                    total: meta.total,
                    pageSizeOptions: ["5", "10", "20", "50", "100"],
                    showTotal: (total, range) => {
                        return (
                            <div> 
                                {range[0]}-{range[1]} on {total} rows
                            </div>
                        )
                    }
                }}

                headerTitle="Table user"
                toolBarRender={() => [

                    <Button
                        icon={<CloudUploadOutlined />}
                        type="primary"
                    >
                        Import
                    </Button>,

                    <Button
                        key="button"
                        icon={<PlusOutlined />}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />
        </>
    );
};

export default TableUser;