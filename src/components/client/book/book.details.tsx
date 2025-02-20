import { App, Breadcrumb, Col, Divider, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from 'react-image-gallery';
import ModalGallery from "./modal.gallery";
import 'styles/book.scss';
import { Link } from "react-router-dom";
import { PlusCircleOutlined } from "@ant-design/icons";
import { useCurrentApp } from "@/components/context/app.context";
import { addToCartAPI } from "@/services/api";

interface IProps {
    currentBook: IBookTable | null;
}

const BookDetails = (props: IProps) => {
    const { currentBook } = props;
    const [imageGallery, setImageGallery] = useState<{
        original: string;
        originalClass: string;
    }[]>([])

    const [currentQuantity] = useState<number>(1);
    const { setCarts, user } = useCurrentApp();
    const { message } = App.useApp();
    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);
    const refGallery = useRef<ImageGallery>(null);


    // handle add to cart
    const handleOnClickImage = () => {
        setIsOpenModalGallery(true);
    }

    const handleAddToCart = async () => {
        if (!user) {
            message.error("You have to login to add to cart");
            return;
        }
        // update localStorage
        const cartStorage = localStorage.getItem("carts");
        if (cartStorage && currentBook) {
            const carts = JSON.parse(cartStorage) as ICart[];
            // check exist
            let isExistIndex = carts.findIndex(c => c.id === currentBook.id);
            const isExistCategory = carts.find(c => c.details.category === currentBook.category);
            if (isExistIndex > -1 || isExistCategory) {
                message.warning("You are only allowed to borrow one type of book.");
                return;
            } else {
                carts.push({
                    id: currentBook.id,
                    quantity: currentQuantity,
                    details: currentBook,
                    user: user
                })
            }

            localStorage.setItem("carts", JSON.stringify(carts));
            setCarts(carts);
        } else {
            // create
            const data = [{
                id: currentBook?.id!,
                quantity: currentQuantity,
                details: currentBook!,
                user: user
            }]

            localStorage.setItem("carts", JSON.stringify(data))

            // sync React Context
            setCarts(data);
        }

        const repsonse = await addToCartAPI(
            currentBook!.id, currentBook!.category, currentBook!.title,
            currentBook!.author, currentBook!.publisher, currentBook!.thumb,
            currentBook!.description, currentBook!.quantity, currentBook!.status,
            currentBook!.active
        );
        if (!(repsonse && repsonse.data)) {
            message.error("Add to cart failed");
            return;
        }
        message.success("Add to cart successfully");
    }

    useEffect(() => {
        if (currentBook) {
            const images = [];
            if (currentBook.thumb) {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/upload/${currentBook.thumb}`,
                        originalClass: "original-image"
                    }
                )
            }
            setImageGallery(images);
        }
    }, [currentBook])


    
    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                    <Breadcrumb
                        className="breadcrumb"
                        separator=">"
                        items={[
                            {
                                title: <Link to={"/"}>Home</Link>,
                            },

                            {
                                title: 'Book details',
                            },
                        ]}
                    />
                    <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                        <Row gutter={[20, 20]}>
                            <Col md={10} sm={0} xs={0}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    slideOnThumbnailOver={true}  //onHover => auto scroll images
                                    onClick={() => handleOnClickImage()}
                                />
                            </Col>
                            <Col md={14} sm={24}>
                                <Col md={0} sm={24} xs={24}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={imageGallery}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>}//right arrow === <> </>
                                        showThumbnails={false}
                                    />
                                </Col>
                                <Col span={24}>
                                    <div className='title'>
                                        {currentBook?.title}
                                    </div>
                                    <div className='category'>
                                        Category: {currentBook?.category}
                                    </div>
                                    <div className='author'>
                                        by <a href=''>{currentBook?.author}</a> (Author) - publisher: {currentBook?.publisher}
                                    </div>

                                    <Divider />

                                    <div className='description'>
                                        {currentBook?.description}
                                    </div>

                                    <div className='qty-status'>
                                        <div>
                                            <span className='left'>
                                                Quantity: {currentBook?.quantity !== 0
                                                ? <span style={{color: "green", fontWeight: 500 }}>{currentBook?.quantity}</span>
                                                : <span style={{color: "red", fontWeight: 500 }}>{currentBook?.quantity}</span> }
                                            </span>
                                            <span className='right'>
                                                Status: {currentBook?.status === "AVAILABLE" 
                                                    ? <span style={{color: "green", fontWeight: 500 }}>AVAILABLE</span> 
                                                    : <span style={{color: "red", fontWeight: 500 }}>UNAVAILABLE</span>}
                                            </span>
                                        </div>
                                    </div>
                                    <div className='borrow'>
                                        <button
                                            onClick={() => handleAddToCart()}
                                            className='now'
                                            style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "5px"}}>
                                            <PlusCircleOutlined />Add to cart
                                        </button>
                                        <button
                                            // onClick={() => handleAddToCart(true)}
                                            className='now'>Borrow book</button>
                                    </div>
                                </Col>
                            </Col>
                        </Row>
                    </div>
                </div>
                <ModalGallery
                    isOpen={isOpenModalGallery}
                    setIsOpen={setIsOpenModalGallery}
                    items={imageGallery}
                />
            </div>
        </>
    )
}

export default BookDetails;