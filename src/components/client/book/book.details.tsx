import { Breadcrumb, Col, Divider, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from 'react-image-gallery';
import ModalGallery from "./modal.gallery";
import 'styles/book.scss';
import { Link } from "react-router-dom";

interface IProps {
    currentBook: IBookTable | null;
}

const BookDetails = (props: IProps) => {
    const { currentBook } = props;

    const [imageGallery, setImageGallery] = useState<{
        original: string;
        originalClass: string;
    }[]>([])

    const [isOpenModalGallery, setIsOpenModalGallery] = useState<boolean>(false);

    const refGallery = useRef<ImageGallery>(null);

    const handleOnClickImage = () => {
        setIsOpenModalGallery(true);
    }

    const handleAddToCart = (isBuy = false) => {
        console.log(isBuy);
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
                                            onClick={() => handleAddToCart(true)}
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