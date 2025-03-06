import { getAllActivityLogAPI } from "@/services/api";
import { ActionType, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import dayjs from "dayjs";
import { useRef, useState } from "react";
type TSearch = {
    activityGroup: string;
    activityType: string[];
}
const TableActivity = () => {

    const [activityGroup, setActivityGroup] = useState<string>('');
    const [activityType, setActivityType] = useState<string[]>([]);

    const handleActivityGroupChange = (value: string) => {
        setActivityGroup(value);
        setActivityType([]);
    };

    const handleActivityTypeChange = (value: string[]) => {
        setActivityType(value);
        
    };

    const handleReset = () => {
        setActivityGroup("");
        setActivityType([]);
    };

    const [meta, setMeta] = useState({
        current: 1,
        pageSize: 5,
        pages: 0,
        total: 0
    })

    const actionRef = useRef<ActionType>();
    
    // table: activity log
    const columns: ProColumns<IActivityLogTable>[] = [
        {
            title: "Activity group",
            dataIndex: "activityGroup",
            valueType: 'select',
            ellipsis: true,
            valueEnum: {
                book: { text: 'Book' },
                user: { text: 'User' }
            },

            fieldProps: {
                style: { marginLeft: 10 },
                onChange: handleActivityGroupChange
            },
            hidden: true,
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
            title: "Activity type",
            dataIndex: "activityType",
            valueType: 'select',
            ellipsis: true,
            key: activityGroup,
            fieldProps: {
                key: activityGroup,
                style: { marginLeft: 10 },
                onChange: handleActivityTypeChange,
                mode: "multiple",
            },
            valueEnum: activityGroup === 'book'
            ? { 'Create book': { text: 'Create book' }, 'Update book': { text: 'Update book' }, 'Delete book': { text: 'Delete book' }, 'Toggle soft delete book': { text: 'Toggle soft delete book'} }
            : activityGroup === 'user'
                ? { 'Create user': { text: 'Create user' }, 'Update user': { text: 'Update user' }, 'Delete user': { text: 'Delete user' }, 'Toggle soft delete user': { text: 'Toggle soft delete user'} }
                : {},
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
            <ProTable<IActivityLogTable, TSearch>
                columns={columns}
                cardBordered
                onReset={handleReset}
                actionRef={actionRef}
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
                request={async (params) => {
                    let query = "";
                    if (params) {
                        query += `page=${(params?.current ?? 1) - 1}&size=${params?.pageSize ?? 5}`;
                        query += '&sort=executionTime,desc';
                        if (activityGroup) {
                            if (activityGroup === "book") {
                                query += `&activityGroup.equals=${activityGroup.charAt(0).toLocaleUpperCase() + activityGroup.slice(1)}`;
                            }
                            if (activityGroup === "user") {
                                query += `&activityGroup.equals=${activityGroup.charAt(0).toLocaleUpperCase() + activityGroup.slice(1)}`;
                            }
                        }

                        if (activityType && activityType.length > 0 ) {
                            const arrActivityType = Array.isArray(activityType) ? activityType : [activityType];
                            if (arrActivityType.length > 1) {
                                const filterValue = arrActivityType.map(type => `${type}`).join(",");
                                const filterParam = `&activityType.in=${filterValue}`;
                                query += `${filterParam}`;
                            } else {
                                const filterValue = activityType;
                                const filterParam = `&activityType.equals=${encodeURIComponent(filterValue.toString())}`;
                                query += `${filterParam}`;
                            }
                        }
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
            >

            </ProTable>
        </>
    )
}

export default TableActivity;