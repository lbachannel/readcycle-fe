import { getAllActivityLogAPI } from "@/services/api";
import { ProColumns, ProTable } from "@ant-design/pro-components";
import dayjs from "dayjs";
import { useState } from "react";

const TableDashBoard = () => {

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })
    
    // table: activity log
    const columns: ProColumns<IActivityLogTable>[] = [
        {
            title: "Active group",
            dataIndex: "",
            valueType: 'select',
            ellipsis: true,
            valueEnum: {
                book: { text: 'Book' },
                user: { text: 'User' }
            },
            fieldProps: {
                style: { marginLeft: 10 } // Tạo khoảng cách giữa label và input
            },
            hidden: true
        },
        {
            title: "Modified time",
            dataIndex: "executionTime",
            ellipsis: true,
            valueType: "date",
            hideInSearch: true,
            sorter: true,
            render: (_, record) => 
                record.executionTime
                    ? dayjs(record.executionTime).format("YYYY-MM-DD HH:mm")
                    : ""
        },
        {
            title: "Modified by",
            dataIndex: "username",
            ellipsis: true,
            hideInSearch: true
        },
        {
            title: "Active type",
            dataIndex: "activityType",
            valueType: 'select',
            ellipsis: true,
            valueEnum: {
                book: { text: 'Create book' },
                user: { text: 'Create user' }
            }, 
            fieldProps: {
                style: { marginLeft: 10 }
            }
        },
        {
            title: "Description",
            dataIndex: "description",
            ellipsis: true,
            hideInSearch: true,
            render: (_, entity) => {
                // check null
                if (!entity.description) {
                    return null;
                }
            
                let data;
                if (typeof entity.description === "string") {
                    try {
                        data = JSON.parse(entity.description);
                    } catch (error) {
                        return <span>Invalid JSON</span>;
                    }
                } else if (Array.isArray(entity.description)) {
                    data = entity.description;
                } else {
                    return <span>Invalid format</span>;
                }
            
                if (!Array.isArray(data)) {
                    return <span>Invalid format</span>;
                }
            
                return (
                    <ul style={{ whiteSpace: "normal" }}>
                        {data.map(e => (
                            <li key={e.key}>
                                <strong>{e.label}:</strong> {e.value}
                            </li>
                        ))}
                    </ul>
                );
            }
        },
    ]
    return (
        <>
            <ProTable<IActivityLogTable>
                columns={columns}
                cardBordered
                rowKey="id"
                request={async (params) => {
                    let query = "";
                    if (params) {
                        query += `page=${(params?.current ?? 1) - 1}&size=${params?.pageSize ?? 5}`;
                        query += '&sort=executionTime,desc';
                    }
                    const response = await getAllActivityLogAPI(query);
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
            >

            </ProTable>
        </>
    )
}

export default TableDashBoard;