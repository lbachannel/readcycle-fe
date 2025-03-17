import { getDashboardStatsAPI } from "@/services/api";
import { Card, Col, Row, Statistic } from "antd";
import { useEffect, useState } from "react"
import CountUp from 'react-countup';

const AdminDashBoard = () => {
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

    const formatter = (value: any) => <CountUp end={value} separator="," />;
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
        </>
    )
}

export default AdminDashBoard;