import { Col, Modal, Row } from "antd";
import { useRef } from "react";
import ImageGallery from 'react-image-gallery';

interface IProps {
    isOpen: boolean;
    setIsOpen: (v: boolean) => void;
    items: {
        original: string;
        originalClass: string;
    }[];
}

const ModalGallery = (props: IProps) => {
    const {
        isOpen, setIsOpen,
        items
    } = props;

    const refGallery = useRef<ImageGallery>(null);

    return (
        <Modal
            width={'60vw'}
            open={isOpen}
            onCancel={() => setIsOpen(false)}
            footer={null} //hide footer
            closable={false} //hide close button
            className="modal-gallery"
        >
            <Row>
                <Col span={24}>
                    <ImageGallery
                        ref={refGallery}
                        items={items}
                        showPlayButton={false} //hide play button
                        showFullscreenButton={false} //hide fullscreen button
                        showThumbnails={false} //hide thumbnail
                        slideDuration={0} //duration between slices
                    />
                </Col>
            </Row>
        </Modal>
    )
}

export default ModalGallery;