import { useCurrentApp } from "@/components/context/app.context";
import { deleteCartAPI } from "@/services/api";
import { Breadcrumb, Button, Col, Empty, Row } from "antd";
import { Link } from "react-router-dom";
import 'styles/borrow-book.scss';


const BorrowBookDetails = () => {
    const { carts, setCarts } = useCurrentApp();

    const handleRemoveBorrowBook = async (id: string) => {
        console.log(id)
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage) {
            const carts = JSON.parse(cartStorage) as ICart[];
            const isDeleteCart = carts.filter(item => item.id === id);
            console.log(isDeleteCart)

            await deleteCartAPI(id);
            const newCarts = carts.filter(item => item.id !== id);
            localStorage.setItem("carts", JSON.stringify(newCarts));
            setCarts(newCarts);
        }
    }


    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <Breadcrumb
                className="breadcrumb"
                separator=">"
                items={[
                    {
                        title: <Link to={"/"}>Home</Link>,
                    },
                    {
                        title: 'Borrow books',
                    }
                ]}
            />
            <div className="borrow-container">
                {carts.length === 0 &&
                    <Empty
                        className="borrow-book__empty"
                        description="Empty book"
                    />
                }
                <Row gutter={[20, 0]}>
                    <Col md={18} xs={24}>
                        {carts?.map((item, index) => {
                            return (
                                <div className='borrow-book' key={`index-${index}`} >
                                    <>
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/upload/${item?.details?.thumb}`} />
                                        

                                        <div className='borrow-book_content'>
                                            <div className="borrow-book_category">
                                                {item?.details?.category}
                                            </div>
                                            <div className="borrow-book_name">
                                                {item?.details?.title}
                                            </div>                       

                                            <div className="borrow-book__author">
                                                by {item?.details?.author} (Author)
                                            </div>

                                            <div className="borrow-book__desc">
                                                {item?.details?.description}
                                            </div>


                                            <div className='action' >
                                                <button className="borrow-book__btn" onClick={() => handleRemoveBorrowBook(item.id)}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                </div>
                            )
                        })}
                    </Col>
                    {carts.length !== 0 &&
                        <Col md={6} xs={24} >
                            <div className='borrow-book__sum'>
                                <Button
                                    color="primary" variant="solid"
                                >
                                    Borrow ({carts?.length ?? 0})
                                </Button>

                            </div>
                        </Col>
                    }
                    
                </Row>
            </div>
        </div>
    )
}

export default BorrowBookDetails;