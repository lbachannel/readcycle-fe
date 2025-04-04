import { deleteUserAPI, getAllUsersV2API, toggleSoftDeleteUserAPI } from '@/services/api';
import { dateValidate } from '@/services/helper';
import { PlusOutlined } from '@ant-design/icons';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { App, Button, notification, Popconfirm, Switch } from 'antd';
import { useRef, useState } from 'react';
import DetailsUser from './details.user';
import CreateUser from './create.user';
import UpdateUser from './update.user';

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
    const [switchState, setSwitchState] = useState<Record<string, boolean>>({});

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    // reload table after create
    const refreshTable = () => {
        actionRef.current?.reload();
    }

    // soft deletes
    const handleSwitchChange = async(id: string, checked: boolean) => {
        setSwitchState((prev) => ({ ...prev, [id]: checked }));
        const response = await toggleSoftDeleteUserAPI(id);
        if (response && response.data) {
            message.success(response.data.active ? "On" : "Off");
        } else {
            setSwitchState((prev) => ({ ...prev, [id]: !checked }));
            const errorMessage = Array.isArray(response.message) ? (
                <ul style={{listStyle: 'inside ', textIndent: '-20px'}}>
                    {response.message.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            ) : (
                <div>{response.message}</div>
            );
            api.open({
                message: "Soft delete failed",
                description: errorMessage,
                type: 'error',
                showProgress: true,
                pauseOnHover: true,
            });
        }
        refreshTable();
    }

    // handle delete user
    const [isDeleteUser, setIsDeleteUser] = useState<boolean>(false);
    const { message } = App.useApp();
    const [api, contextHolder] = notification.useNotification();
    const handleDeleteUser = async (id: string) => {
        setIsDeleteUser(true);
        const response = await deleteUserAPI(id);
        if (response && response.data) {
            message.success("Delete user successfully");
            refreshTable();
        } else {
            api.open({
                message: "Unable to delete the account",
                description: "This account is linked to important data. Please review and delete the related data before trying again.",
                type: 'error',
                showProgress: true,
                pauseOnHover: true,
            });
        }
        setIsDeleteUser(false);
    }

    // open - close update user modal
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IUserTable | null>(null);

    // open - close create user modal
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    // open - close user details modal
    const [openViewDetails, setOpenViewDetails] = useState<boolean>(false);

    // set user data into Drawer
    const [dataViewDetails, setDataViewDetails] = useState<IUserTable | null>(null);

    // table: user list
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
            render(_, entity) {
                return (
                    <a onClick={() => {
                        setOpenViewDetails(true);
                        setDataViewDetails(entity);
                    }} href="#">{entity.id}</a>
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
            tooltip: "Date of birth"
        },

        {
            title: "Created at",
            dataIndex: "createdAt",
            valueType: "date",
            ellipsis: true,
            tooltip: "Created at",
            sorter: true,
            hideInSearch: true
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
            title: "Enable",
            dataIndex: "active",
            ellipsis: true,
            tooltip: "Active",
            hideInSearch: true,
            render: (_, record) => {
                return (
                    <Switch
                        checked={switchState[record.id] ?? record.active} 
                        onChange={(checked) => handleSwitchChange(record.id, checked)}
                    />
                );
            }
        },
    
        {
            title: 'Action',
            hideInSearch: true,
            render(_, entity, ) {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                                setOpenModalUpdate(true);
                                setDataUpdate(entity);
                            }}
                        />
                        <Popconfirm
                            placement="leftTop"
                            title={"Confirm delete user"}
                            description={"Are you sure you want to delete this user ?"}
                            onConfirm={() => handleDeleteUser(entity.id)}
                            okText="Confirm"
                            cancelText="Cancel"
                            okButtonProps={{ loading: isDeleteUser }}
                        >
                            <span style={{ cursor: "pointer", marginLeft: 20 }}>
                                <DeleteTwoTone
                                    twoToneColor="#ff4d4f"
                                    style={{ cursor: "pointer" }}
                                />
                            </span>
                            {contextHolder}
                        </Popconfirm>
                    </>
                )
            }
        }
    ];

    return (
        <>
            <ProTable<IUserTable, TSearch>
                columns={columns}
                actionRef={actionRef}
                cardBordered
                search={{
                    labelWidth: 100,
                    optionRender: ({ resetText }, { form }) => [
                        <Button onClick={() => form?.resetFields()} key="reset">
                            {resetText}
                        </Button>,
                        <Button type="primary" onClick={() => form?.submit()} key="search">
                            Search
                        </Button>
                    ]
                }}
                request={async (params, sort) => {
                    let query = "";
                    if (params) {
                        query += `page=${(params?.current ?? 1) - 1}&size=${params?.pageSize ?? 5}`;
                        
                        const filters = [];
                        if (params.name) {
                            filters.push(`&name.contains=${params.name}`)
                        }
                        if (params.email) {
                            filters.push(`&email.contains=${params.email}`);
                        }
                        if (params.dateOfBirth) {
                            const yob = dateValidate(params.dateOfBirth);
                            filters.push(`&dateOfBirth.equals=${yob}`);
                        }
                        if (params.role) {
                            const role = params.role.name;
                            filters.push(`&role.equals=${role}`);
                        }

                        if (sort && Object.keys(sort).length > 0) {
                            const sortParams = Object.entries(sort)
                                .map(([field, sort]) => `sort=${field},${sort === 'ascend' ? 'asc' : 'desc'}`)
                                .join("&");
                            query += `&${sortParams}`;
                        } else {
                            // default table is sorted by desc
                            query += '&sort=createdAt,desc';
                        }


                        if (filters.length > 0) {
                            query += `${filters.join("")}`;
                        }
                        
                    }
                    // const response = await getAllUsersAPI(query);
                    const response = await getAllUsersV2API(query);
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
                        key="button"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setOpenModalCreate(true);
                        }}
                        type="primary"
                    >
                        Add new
                    </Button>

                ]}
            />

            <DetailsUser
                openViewDetails={openViewDetails}
                setOpenViewDetails={setOpenViewDetails}
                dataViewDetails={dataViewDetails}
                setDataViewDetails={setDataViewDetails}
            />

            <CreateUser
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateUser
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    );
};

export default TableUser;