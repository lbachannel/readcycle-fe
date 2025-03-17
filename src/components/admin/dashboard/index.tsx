import { getDashboardStatsAPI, getStatsBooksAPI } from "@/services/api";
import { Card, Col, Row, Statistic, Table, TableColumnsType } from "antd";
import { useEffect, useState } from "react"
import CountUp from 'react-countup';

const AdminDashBoard = () => {
    const [booksData, setBooksData] = useState<IStatsBooks[]>([]);
    const [loading, setLoading] = useState(false);
    const [dataDashboard, setDataDashboard] = useState({
        countUser: 0,
        countAdmin: 0,
        countBook: 0
    })

    useEffect(() => {
        const initDashboard = async () => {
            const response = await getDashboardStatsAPI();
            if (response && response.data) {
                setDataDashboard(response.data);
            }
        }
        initDashboard();
    }, []);

    useEffect(() => {
        const fetchBooksData = async () => {
            setLoading(true);
            try {
                const response = await getStatsBooksAPI();
                if (Array.isArray(response.data?.books)) {
                    setBooksData(response.data.books);
                }
            } catch (error) {
                console.error("Error fetching books data:", error);
            }
            setLoading(false);
        };
        fetchBooksData();
    }, []);

    const formatter = (value: any) => <CountUp end={value} separator="," />;

    // table: books stats
    const columns: TableColumnsType<IStatsBooks> = [
        {
            title: 'Category',
            dataIndex: 'category'
        },
        {
            title: 'Title',
            dataIndex: 'title'
        },
        {
            title: 'Total quantity',
            dataIndex: 'totalQty'
        },
        {
            title: 'Current quantity',
            dataIndex: 'currentQty'
        },
        {
            title: 'Borrow quantity',
            dataIndex: 'borrowQty'
        },
    ];
    return (
        <>
            <Row gutter={[24, 24]}>
                <Col span={8}>
                    <Card title="" bordered={false} >
                        <Statistic
                            title="Total Users"
                            value={dataDashboard.countUser}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="" bordered={false} >
                        <Statistic
                            title="Total Admin"
                            value={dataDashboard.countAdmin}
                            formatter={formatter}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="" bordered={false} >
                        <Statistic title="Total Books" value={dataDashboard.countBook} precision={2} formatter={formatter} />
                    </Card>
                </Col>
            </Row>
            <Row gutter={[24, 24]} style={{marginTop: "24px"}}>
                <Col span={24}>
                    <Table<IStatsBooks> 
                        columns={columns}
                        dataSource={booksData}
                        rowKey="title"
                        loading={loading}
                    />
                </Col>
            </Row>
        </>
    )
}

export default AdminDashBoard;