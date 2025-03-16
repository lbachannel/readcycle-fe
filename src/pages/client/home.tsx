import { getAllBooksClientV2API } from "@/services/api";
import { FilterTwoTone, ReloadOutlined } from "@ant-design/icons";
import { Carousel, Checkbox, Col, Divider, Form, FormProps, Pagination, Row, Spin, Tabs } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import 'styles/home.scss';

type FieldType = {
    range: {
        from: number;
        to: number
    }
    category: string[]
};

const HomePage = () => {
    const [searchTerm] = useOutletContext() as any;
    const [form] = Form.useForm();
    const navigate = useNavigate();

    // handle filter books
    const [sortQuery, setSortQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("");

    // handle show books
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(8);
    const [listBook, setListBook] = useState<IBookTable[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsloading] = useState<boolean>(false);

    useEffect(() => {
        fetchBooks();
    }, [current, pageSize, sortQuery, filter, searchTerm])

    const fetchBooks = async () => {
        setIsloading(true);
        let query = `page=${current - 1}&size=${pageSize}`;
        let flag = true;
        if (sortQuery) {
            query += `${sortQuery}`;
            flag = false;
        }

        if (filter) {
            query += `${filter}`;
            flag = false;
        }

        if (searchTerm) {
            if (flag) {
                query += `&title.contains=${searchTerm}`;
            } else {
                query += `&title.contains=${searchTerm}`;
            }
        }
        const response = await getAllBooksClientV2API(query);
        if (response && response.data) {
            setListBook(response.data.result);
            setTotal(response.data.meta.total);
        } else if (response.statusCode === 503) {
            navigate("/maintenance")
        }
        setIsloading(false);
    }

    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current);
        }

        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize);
            setCurrent(1);
        }
    }

    const items = [
        {
            key: "",
            label: `Popular`,
            children: <></>,
        },
        {
            key: '&sort=createdAt,desc',
            label: `New releases`,
            children: <></>,
        },
    ];



    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log(values);
    }

    const previousFilter = useRef<string>("");

    const handleChangeFilter = () => {
        let filterParts: string[] = [];
        setCurrent(0);

        const values = form.getFieldsValue();

        if (values.category?.length) {
            const filterCateParam = `category.in=${encodeURIComponent(values.category.join(","))}`;
            filterParts.push(filterCateParam);
        }

        if (values.author?.length) {
            const filterAuthorParam = `author.in=${encodeURIComponent(values.author.join(","))}`;
            filterParts.push(filterAuthorParam);
        }

        const newFilter = filterParts.length ? `&${filterParts.join("&")}` : "";

        setFilter(newFilter);

        previousFilter.current = newFilter;
    };


    const images = [
        "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3886.jpg?v=1&w=1920&h=600",
        "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3922.jpg?v=1&w=1920&h=600",
        "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3877.jpg?v=1&w=1920&h=600",
        "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3889.jpg?v=1&w=1920&h=600",
        "https://307a0e78.vws.vegacdn.vn/view/v2/image/img.banner_web_v2/0/0/0/3895.jpg?v=1&w=1920&h=600"
    ];

    return (
        <>
            <div className="homepage-container">
                <Carousel autoplay autoplaySpeed={5000} style={{marginBottom: "20px"}}>
                    {images.map((src, index) => (
                        <div key={index}>
                            <img src={src} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
                        </div>
                    ))}
                </Carousel>
                <Row gutter={[20, 20]}>
                    <Col md={6} sm={0} xs={0}>
                        <div className="filter">
                            <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                <span> <FilterTwoTone />
                                    <span style={{ fontWeight: 500, color: "#000" }}> Filter</span>
                                </span>
                                <ReloadOutlined 
                                    title="Reset"
                                    onClick={() => {
                                        form.resetFields();
                                        setFilter("");
                                    }}
                                />
                            </div>
                            <Divider style={{background: "rgb(76 72 72)"}} />
                            <Form
                                onFinish={onFinish}
                                form={form}
                                onValuesChange={() => handleChangeFilter()}
                            >
                                <Form.Item
                                    name="category"
                                    label="Category"
                                    labelCol={{ span: 24 }}
                                    className="category"
                                >
                                    <Checkbox.Group>
                                        <Row>
                                            <Col span={24}>
                                                <Checkbox value="Computers & Technology" className="checkbox">
                                                    Computers & Technology
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Romantic Fantasy" className="checkbox">
                                                    Romantic Fantasy
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Travel" className="checkbox">
                                                    Travel
                                                </Checkbox>
                                            </Col>
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                                <Divider style={{background: "rgb(76 72 72)"}} />
                                <Form.Item
                                    name="author"
                                    label="Author"
                                    labelCol={{ span: 24 }}
                                    className="author"
                                >
                                    <Checkbox.Group>
                                        <Row>
                                            <Col span={24}>
                                                <Checkbox value="Joshua Bloch" className="checkbox">
                                                    Joshua Bloch
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Cay Horstmann" className="checkbox">
                                                    Cay Horstmann
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Dr. Edward Lavieri Jr." className="checkbox">
                                                    Dr. Edward Lavieri Jr.
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Alan Mycroft" className="checkbox">
                                                    Alan Mycroft
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Rebecca Yarros" className="checkbox">
                                                    Rebecca Yarros
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Alexandre Dumas" className="checkbox">
                                                    Alexandre Dumas
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Jon Krakauer" className="checkbox">
                                                    Jon Krakauer
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="L. K. Pettigrew" className="checkbox">
                                                    L. K. Pettigrew
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Rick Steves" className="checkbox">
                                                    Rick Steves
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Joan M Griffin" className="checkbox">
                                                    Joan M Griffin
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Elle Kennedy" className="checkbox">
                                                    Elle Kennedy
                                                </Checkbox>
                                            </Col>
                                            <Col span={24}>
                                                <Checkbox value="Abby Jimenez" className="checkbox">
                                                    Abby Jimenez
                                                </Checkbox>
                                            </Col>
                                        </Row>
                                    </Checkbox.Group>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>

                    <Col md={18} xs={24} >
                        <Spin spinning={isLoading} tip="Loading" size="small">
                            <Row className="tabs">
                                <Tabs 
                                    defaultActiveKey="1" 
                                    items={items} 
                                    className="tabs__title"
                                    style={{ overflowX: "auto"}}
                                    onChange={ value => setSortQuery(value) } />
                            </Row>
                            <Row className='customize-row'>
                                {listBook?.map((item, index) => {
                                    return (
                                        <div className="column" key={`book-${index}`} onClick={() => navigate(`/book/${item.id}`)}>
                                            <div className='wrapper'>
                                                <div className='thumbnail'>
                                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/upload/${item.thumb}`} alt="thumbnail book" />
                                                </div>
                                                <div className='text'>{item.title}</div>
                                            </div>
                                        </div>    
                                    )
                                })}
                            </Row>

                            <Row style={{ display: "flex", justifyContent: "center", margin: "30px" }}>
                                <Pagination
                                    current={current}
                                    total={total}
                                    pageSize={pageSize}
                                    responsive
                                    onChange={(page, size) => handleOnchangePage({
                                        current: page, pageSize: size
                                    })}
                                />
                            </Row>
                        </Spin>
                    </Col>
                </Row>
            </div>
        </>
    )
};

export default HomePage;