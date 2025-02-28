import { getAllBooksHistoryAPI, returnBookAPI } from "@/services/api";
import { Col, Empty, message, Pagination, Row, Spin, Tabs } from "antd";
import { useEffect, useState } from "react";
import 'styles/home.scss';
import 'styles/borrow-book.scss';

const BooksHistoryPage = () => {
    const [current, setCurrent] = useState<number>(1);
    const [pageSize, setPageSize] = useState<number>(8);
    const [listBorrow, setListBorrow] = useState<IBorrowTable[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [tab, setTab] = useState<string>("");

    useEffect(() => {
        fetchBooks();
    }, [current, pageSize, tab])

    const fetchBooks = async () => {
        setIsLoading(true);
        let query = `page=${current - 1}&size=${pageSize}`;
        if (tab) {
            query += `${tab}`;
        } else {
            query += `&filter=${encodeURIComponent("status~'BORROWED'")}`;
        }
        console.log(query);

        const response = await getAllBooksHistoryAPI(query);
        if (response && response.data) {
            setListBorrow(response.data.result);
            setTotal(response.data.meta.total);
        }
        setIsLoading(false);
    }

    const handleReturnBook = async (id: string, book: IBook, status: string, user: IUser) => {
        const response = await returnBookAPI(id, book, status, user);
        if (response) {
            message.success("Return book successfully");
            fetchBooks();
        } else {
            message.success("Return book failed");
        }
    }

    const handleOnChangePage = (pagination: { current: number, pageSize: number}) => {
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
            label: `Borrowed`,
            children: <></>,
        },
        {
            key: `&filter=${encodeURIComponent("status~'RETURNED'")}`,
            label: `Returned`,
            children: <></>,
        },
    ];

    return (
        <>
            <div className="homepage-container">
                <Row gutter={[20, 20]}>
                    <Col xs={24} >
                        <Spin spinning={isLoading} tip="Loading" size="small">
                            <Row className="tabs">
                                <Tabs 
                                    defaultActiveKey="1" 
                                    items={items} 
                                    className="tabs__title"
                                    style={{ overflowX: "auto"}}
                                    onChange={ value => setTab(value) }
                                />
                            </Row>

                            <Row className='customize-row borrow-container'>
                                {listBorrow.length === 0 &&
                                    <div style={{width: "100%", height: "50vh", display: "flex", alignItems: "center", justifyContent: "center"}}>
                                        <Empty
                                            description="Empty book"
                                        />
                                    </div>
                                    
                                }
                                <Col xs={24}>
                                    {listBorrow?.map((item, index) => {
                                        return (
                                            <div className='borrow-book' key={`index-${index}`} >
                                                <>
                                                    <img src={`${import.meta.env.VITE_BACKEND_URL}/upload/${item.book.thumb}`} />
                                                    

                                                    <div className='borrow-book_content'>
                                                        <div className="borrow-book_category">
                                                            {item.book.category}
                                                        </div>
                                                        <div className="borrow-book_name">
                                                            {item?.book.title}
                                                        </div>                       

                                                        <div className="borrow-book__author">
                                                            by {item?.book.author} (Author)
                                                        </div>

                                                        <div className="borrow-book__desc">
                                                            {item?.book.description}
                                                        </div>

                                                        <div className='action' >
                                                            {item.status === "RETURNED" 
                                                            ?
                                                            `Return date: ${new Date(item.updatedAt).toISOString().slice(0, 16).replace("T", " ")}` 
                                                            :
                                                            <button className="borrow-book__btn" onClick={() => handleReturnBook(item.id, item.book, item.status, item.user)}>
                                                                Return
                                                            </button>}
                                                            
                                                        </div>
                                                    </div>
                                                </>
                                            </div>
                                        )
                                    })}
                                </Col>
                            </Row>

                            <Row style={{ display: "flex", justifyContent: "center", margin: "30px" }}>
                                {listBorrow.length !== 0 &&
                                    <Pagination
                                        current={current}
                                        total={total}
                                        pageSize={pageSize}
                                        responsive
                                        onChange={(page, size) => handleOnChangePage({
                                            current: page, pageSize: size
                                        })}
                                    />
                                }
                                
                            </Row>
                        </Spin>
                    </Col>
                </Row>
            </div>
        </>
    )
}

export default BooksHistoryPage;