import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Form, FormProps, Pagination, Rate, Row, Spin, Tabs } from "antd";
import 'styles/home.scss';

type FieldType = {
    range: {
        from: number;
        to: number
    }
    category: string[]
};

const HomePage = () => {
    const [form] = Form.useForm();
    const items = [
        {
            key: "sort=-sold",
            label: `Popular`,
            children: <></>,
        },
        {
            key: 'sort=-updatedAt',
            label: `New book`,
            children: <></>,
        },
    ];

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log(values);
    }

    const handleChangeFilter = (changedValues: any, values: any) => {
        console.log(changedValues, values);
    }

    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        console.log(pagination)
    }

    return (
        <>
                <div className="homepage-container">
                    <Row gutter={[20, 20]}>
                        <Col md={6} sm={0} xs={0}>
                            <div className="filter">
                                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                    <span> <FilterTwoTone />
                                        <span style={{ fontWeight: 500, color: "#000" }}> Filter</span>
                                    </span>
                                    <ReloadOutlined title="Reset"/>
                                </div>
                                <Divider style={{background: "rgb(76 72 72)"}} />
                                <Form
                                    onFinish={onFinish}
                                    form={form}
                                    onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                                >
                                    <Form.Item
                                        style={{}}
                                        name="category"
                                        label="Category"
                                        labelCol={{ span: 24 }}
                                        className="category"
                                    >
                                        <Checkbox.Group>
                                            <Row>
                                                <Col span={24}>
                                                    <Checkbox value="A" className="checkbox">
                                                        A
                                                    </Checkbox>
                                                </Col>
                                                <Col span={24}>
                                                    <Checkbox value="B" className="checkbox">
                                                        B
                                                    </Checkbox>
                                                </Col>
                                                <Col span={24}>
                                                    <Checkbox value="C" className="checkbox">
                                                        C
                                                    </Checkbox>
                                                </Col>
                                                <Col span={24}>
                                                    <Checkbox value="D" className="checkbox">
                                                        D
                                                    </Checkbox>
                                                </Col>
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                    <Divider style={{background: "rgb(76 72 72)"}} />
                                    <Form.Item
                                        style={{}}
                                        name="author"
                                        label="Author"
                                        labelCol={{ span: 24 }}
                                        className="author"
                                    >
                                        <Checkbox.Group>
                                            <Row>
                                                <Col span={24}>
                                                    <Checkbox value="A" className="checkbox">
                                                        A
                                                    </Checkbox>
                                                </Col>
                                                <Col span={24}>
                                                    <Checkbox value="B" className="checkbox">
                                                        B
                                                    </Checkbox>
                                                </Col>
                                                <Col span={24}>
                                                    <Checkbox value="C" className="checkbox">
                                                        C
                                                    </Checkbox>
                                                </Col>
                                                <Col span={24}>
                                                    <Checkbox value="D" className="checkbox">
                                                        D
                                                    </Checkbox>
                                                </Col>
                                            </Row>
                                        </Checkbox.Group>
                                    </Form.Item>
                                    <Divider style={{background: "rgb(76 72 72)"}} />
                                    <div>
                                        <Button 
                                            onClick={() => form.submit()} 
                                            className="filter__btn" 
                                            type='primary'
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>

                        <Col md={18} xs={24} >
                            <Row className="tabs">
                                <Tabs defaultActiveKey="1"
                                    items={items} className="tabs__title" />
                            </Row>
                            <Row className='customize-row'>
                                <div className="column">
                                    <div className='wrapper'>
                                        <div className='thumbnail'>
                                            <img src="https://m.media-amazon.com/images/I/81r5OJ+ZZHL._SY466_.jpg" alt="thumbnail book" />
                                        </div>
                                        <div className='text'>Lorem ipsum dolors dolors dolors dolors dolors dolors dolors dolors dolors</div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className='wrapper'>
                                        <div className='thumbnail'>
                                            <img src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/50809.jpg?v=1&w=350&h=510" alt="thumbnail book" />
                                        </div>
                                        <div className='text'>Course</div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className='wrapper'>
                                        <div className='thumbnail'>
                                            <img src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/50809.jpg?v=1&w=350&h=510" alt="thumbnail book" />
                                        </div>
                                        <div className='text'>Course</div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className='wrapper'>
                                        <div className='thumbnail'>
                                            <img src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/50809.jpg?v=1&w=350&h=510" alt="thumbnail book" />
                                        </div>
                                        <div className='text'>Course</div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className='wrapper'>
                                        <div className='thumbnail'>
                                            <img src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/50809.jpg?v=1&w=350&h=510" alt="thumbnail book" />
                                        </div>
                                        <div className='text'>Course</div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className='wrapper'>
                                        <div className='thumbnail'>
                                            <img src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/50809.jpg?v=1&w=350&h=510" alt="thumbnail book" />
                                        </div>
                                        <div className='text'>Lorem ipsum dolor sit amet.</div>
                                    </div>
                                </div>
                                <div className="column">
                                    <div className='wrapper'>
                                        <div className='thumbnail'>
                                            <img src="https://307a0e78.vws.vegacdn.vn/view/v2/image/img.book/0/0/1/50809.jpg?v=1&w=350&h=510" alt="thumbnail book" />
                                        </div>
                                        <div className='text'>Course</div>
                                    </div>
                                </div>



                            </Row>

                            <Row style={{ display: "flex", justifyContent: "center" }}>
                                <Pagination
                                    defaultCurrent={6}
                                    total={500}
                                    responsive
                                />
                            </Row>
                        </Col>
                    </Row>
                </div>
        </>
    )
};

export default HomePage;