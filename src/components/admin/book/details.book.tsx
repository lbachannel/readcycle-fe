import { Descriptions, Drawer } from "antd";
import dayjs from "dayjs";

interface IProps {
    openViewDetails: boolean;
    setOpenViewDetails: (v: boolean) => void;
    dataViewDetails: IBookTable | null;
    setDataViewDetails: (v: IBookTable | null) => void;
}

const DetailsBook = (props: IProps) => {
    const { openViewDetails, setOpenViewDetails, dataViewDetails, setDataViewDetails } = props;
    const onClose = () => {
        setOpenViewDetails(false);
        setDataViewDetails(null);
    }
    return (
        <>
            <Drawer
                title="Book details"
                width={"50vw"}
                open={openViewDetails}
                onClose={onClose}
            >
                <Descriptions
                    title="Book info"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="Id">
                        {dataViewDetails?.id}
                    </Descriptions.Item>

                    <Descriptions.Item label="Title">
                        {dataViewDetails?.title}
                    </Descriptions.Item>

                    <Descriptions.Item label="Author">
                        {dataViewDetails?.author}
                    </Descriptions.Item>

                    <Descriptions.Item label="Publisher">
                        {dataViewDetails?.publisher}
                    </Descriptions.Item>

                    <Descriptions.Item label="Active">
                        {dataViewDetails?.active ? "On" : "Off"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Description">
                        {dataViewDetails?.description}
                    </Descriptions.Item>

                    <Descriptions.Item label="Quantity">
                        {dataViewDetails?.quantity}
                    </Descriptions.Item>

                    <Descriptions.Item label="Status">
                        {dataViewDetails?.status}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created at">
                        {dataViewDetails?.createdAt ? dayjs(dataViewDetails.createdAt).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Created by">
                        {dataViewDetails?.createdBy}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated at">
                        {dataViewDetails?.updatedAt ? dayjs(dataViewDetails.createdAt).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated by">
                        {dataViewDetails?.updatedBy}
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    )
}

export default DetailsBook;