import { getAllUsersAPI } from '@/services/api';
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
        title: "Date of birth",
        dataIndex: "dateOfBirth",
        ellipsis: true,
        tooltip: "Date of birth"
    },

    {
        title: "Role",
        dataIndex: ["role","name"],
        ellipsis: true,
        tooltip: "Role"
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

const TableUser = () => {
    const actionRef = useRef<ActionType>();

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async () => {
                    const response = await getAllUsersAPI();
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
                rowKey="_id"
                pagination={{
                    current: meta.current,
                    pageSize: meta.pageSize ?? 5,
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