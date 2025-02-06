import { getAllUsersAPI } from '@/services/api';
import { PlusOutlined } from '@ant-design/icons';
import { CloudUploadOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { Button } from 'antd';
import { useRef } from 'react';

const columns: ProColumns<IUserTable>[] = [
    {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
    },

    {
        title: 'Id',
        dataIndex: 'id',
        copyable: true,
        ellipsis: true,
        tooltip: "User id"
    },

    {
        title: "Name",
        dataIndex: "name",
        copyable: true,
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
        copyable: true,
        ellipsis: true,
        tooltip: "Date of birth"
    },

    {
        title: "Role",
        dataIndex: ["role","name"],
        copyable: true,
        ellipsis: true,
        tooltip: "Role"
    }
];

const TableUser = () => {
    const actionRef = useRef<ActionType>();

    
    return (
        <>
            <ProTable<IUserTable>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                request={async () => {
                    const response = await getAllUsersAPI();
                    return {
                        data: response.data?.result,
                        page: 1,
                        success: true,
                        total: response.data?.meta.total
                    }

                }}
                rowKey="_id"
                pagination={{
                    pageSize: 5,
                    onChange: (page) => console.log(page),
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