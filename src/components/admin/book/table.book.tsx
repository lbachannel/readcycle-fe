import { getAllBooksAPI } from '@/services/api';
import { DeleteTwoTone, EditTwoTone, PlusOutlined } from '@ant-design/icons';
import { ActionType, ProColumns, ProTable } from '@ant-design/pro-components';
import { App, Button, notification, Popconfirm, Switch } from 'antd';
import { useRef, useState } from 'react';

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

    // table: user list
    const columns: ProColumns<IBookTable>[] = [
        {
            title: 'Id',
            dataIndex: 'id',
            hideInSearch: true,
            ellipsis: true,
            tooltip: "Book id"
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
            render() {
                return (
                    <>
                        <EditTwoTone
                            twoToneColor="#f57800"
                            style={{ cursor: "pointer" }}
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
                        type="primary"
                    >
                        Add new
                    </Button>
                ]}
            />
        </>
    );
};

export default TableBook;