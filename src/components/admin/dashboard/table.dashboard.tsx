import { ProColumns, ProTable } from "@ant-design/pro-components";

const TableDashBoard = () => {
    // table: activity log
    const columns: ProColumns<IActivityLogTable>[] = [
        {
            title: "Active group",
            dataIndex: ["role","name"],
            valueType: 'select',
            ellipsis: true,
            valueEnum: {
                admin: { text: 'Admin' },
                user: { text: 'User' }
            },
            fieldProps: {
                style: { marginLeft: 10 } // Tạo khoảng cách giữa label và input
            },
            hidden: true
        },
        {
            title: "Modified time",
            dataIndex: "modifiedTime",
            ellipsis: true,
            hideInSearch: true
        },
        {
            title: "Modified by",
            dataIndex: "modifiedBy",
            ellipsis: true,
            hideInSearch: true
        },
        {
            title: "Active type",
            dataIndex: ["role","name"],
            valueType: 'select',
            ellipsis: true,
            valueEnum: {
                admin: { text: 'Admin' },
                user: { text: 'User' }
            }, 
            fieldProps: {
                style: { marginLeft: 10 }
            }
        },
        {
            title: "Description",
            dataIndex: "description",
            ellipsis: true,
            hideInSearch: true
        },
    ]
    return (
        <>
            <ProTable<IActivityLogTable>
                columns={columns}
                cardBordered
                rowKey="id"
            >

            </ProTable>
        </>
    )
}

export default TableDashBoard;