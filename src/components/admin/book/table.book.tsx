import { getAllBooksAPI, toggleSoftDeleteAPI } from '@/services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { App, Button, notification, Popconfirm, Switch } from 'antd';
import { useRef, useState } from 'react';
import DetailsBook from './details.book';
import CreateBook from './create.book';
import UpdateBook from './upload.book';

type TSearch = {
    title: string;
}

const TableBook = () => {

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    // open - close update book modal
    const [openModalUpdate, setOpenModalUpdate] = useState<boolean>(false);
    const [dataUpdate, setDataUpdate] = useState<IBookTable | null>(null);

    // open - close create book modal
    const [openModalCreate, setOpenModalCreate] = useState<boolean>(false);

    // open - close book details modal
    const [openViewDetails, setOpenViewDetails] = useState<boolean>(false)

    // set book data into Drawer
    const [dataViewDetails, setDataViewDetails] = useState<IBookTable | null>(null)

    const actionRef = useRef<ActionType>();
    const { message } = App.useApp();
    const [api, contextHolder] = notification.useNotification();
    const [switchState, setSwitchState] = useState<Record<string, boolean>>({});

    // reload table after create
    const refreshTable = () => {
        actionRef.current?.reload();
    }

    // soft deletes
    const handleSwitchChange = async (id: string, checked: boolean) => {
        setSwitchState((prev) => ({ ...prev, [id]: checked }));
        const response = await toggleSoftDeleteAPI(id);
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
    };

    // table: user list
    const columns: ProColumns<IBookTable>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            hideInSearch: true,
            ellipsis: true,
            tooltip: "Book id",
            render(_, entity) {
                return (
                    <a onClick={() => {
                        setOpenViewDetails(true);
                        setDataViewDetails(entity);
                    }} href="#">{entity.id}</a>
                )
            }
        },
    
        {
            title: "Title",
            dataIndex: "title",
            ellipsis: true,
            tooltip: "Title"
        },
    
        {
            title: "Author",
            dataIndex: "author",
            copyable: true,
            ellipsis: true,
            tooltip: "Author",
            hideInSearch: true
        },
    
        {
            title: "Publisher",
            dataIndex: "publisher",
            ellipsis: true,
            tooltip: "Publisher",
            hideInSearch: true
        },
        {
            title: "Soft delete (on/off)",
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
            title: "Created at",
            dataIndex: "createdAt",
            valueType: "date",
            ellipsis: true,
            tooltip: "Created at",
            sorter: true,
            hideInSearch: true
        },

        {
            title: 'Action',
            hideInSearch: true,
            render(dom, entity) {
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
                            title={"Confirm delete book"}
                            description={"Are you sure you want to delete this book ?"}
                            okText="Confirm"
                            cancelText="Cancel"
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
            <ProTable<IBookTable, TSearch>
                columns={columns}
                cardBordered
                actionRef={actionRef}
                request={async (params) => {
                    let query = "";
                    if (params) {
                        query += `page=${(params?.current ?? 1) - 1}&size=${params?.pageSize ?? 5}`;
                        
                        if (params.title) {
                            query += `&filter=title~'${params.title}'`;
                        }

                        query += '&sort=createdAt,desc';
                        
                    }
                    const response = await getAllBooksAPI(query);
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

                headerTitle="Table book"
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

            <DetailsBook 
                openViewDetails={openViewDetails}
                setOpenViewDetails={setOpenViewDetails}
                dataViewDetails={dataViewDetails}
                setDataViewDetails={setDataViewDetails}
            />

            <CreateBook
                openModalCreate={openModalCreate}
                setOpenModalCreate={setOpenModalCreate}
                refreshTable={refreshTable}
            />

            <UpdateBook 
                openModalUpdate={openModalUpdate}
                setOpenModalUpdate={setOpenModalUpdate}
                refreshTable={refreshTable}
                setDataUpdate={setDataUpdate}
                dataUpdate={dataUpdate}
            />
        </>
    );
};

export default TableBook;