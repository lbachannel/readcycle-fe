import { Descriptions, Divider, Drawer, GetProp, Upload, UploadFile, UploadProps, Image } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

interface IProps {
    openViewDetails: boolean;
    setOpenViewDetails: (v: boolean) => void;
    dataViewDetails: IBookTable | null;
    setDataViewDetails: (v: IBookTable | null) => void;
}

const DetailsBook = (props: IProps) => {
    const { 
        openViewDetails, setOpenViewDetails, 
        dataViewDetails, setDataViewDetails 
    } = props;

    const onClose = () => {
        setOpenViewDetails(false);
        setDataViewDetails(null);
    }
    
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    useEffect(() => {
        if (dataViewDetails) {
            let imgThumbnail: any = {};
            if (dataViewDetails.thumb) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: dataViewDetails.thumb,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/upload/${dataViewDetails.thumb}`,
                }
            }

            setFileList([imgThumbnail])
        }
    }, [dataViewDetails])

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };
    
    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
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
                        {dataViewDetails?.updatedAt ? dayjs(dataViewDetails.updatedAt).format("YYYY-MM-DD HH:mm:ss") : "N/A"}
                    </Descriptions.Item>

                    <Descriptions.Item label="Updated by">
                        {dataViewDetails?.updatedBy}
                    </Descriptions.Item>
                </Descriptions>

                <Divider orientation="left" > Thumbnail </Divider>
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >

                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{ display: 'none' }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </Drawer>
        </>
    )
}

export default DetailsBook;