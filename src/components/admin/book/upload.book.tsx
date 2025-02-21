import { deleteThumbAPI, updateBookAPI, uploadFileAPI } from "@/services/api";
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { App, Col, Divider, Form, FormProps, GetProp, Input, InputNumber, Modal, notification, Row, Select, Upload, UploadFile, UploadProps, Image } from "antd";
import TextArea from "antd/es/input/TextArea";
import { UploadChangeParam } from "antd/es/upload";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type BookUploadType = "thumbnail";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IBookTable | null) => void;
    dataUpdate: IBookTable | null;
}

type FieldType = {
    id: string;
    category: string;
    title: string;
    author: string;
    publisher: string;
    thumb: any;
    description: string;
    quantity: number;
    status: string;
}

const formItemLayout = {
    labelCol: {
        xs: { span: 7 }
    },
    wrapperCol: {
        xs: { span: 24 }
    },
};

const UpdateBook = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable, setDataUpdate, dataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message } = App.useApp();

    const [form] = Form.useForm();

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
    
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);

    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (dataUpdate) {
            const arrThumb = [
                {
                    uid: uuidv4(),
                    name: dataUpdate.thumb,
                    status: 'done',
                    url: `${import.meta.env.VITE_BACKEND_URL}/upload/${dataUpdate.thumb}`
                }
            ];

            form.setFieldsValue({
                id: dataUpdate.id,
                category: dataUpdate.category,
                title: dataUpdate.title,
                author: dataUpdate.author,
                publisher: dataUpdate.publisher,
                thumb: arrThumb,
                description: dataUpdate.description,
                quantity: dataUpdate.quantity,
                status: dataUpdate.status
            });

            setFileListThumbnail(arrThumb as any);
        }
    }, [dataUpdate])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const {
            id = "", category = "", title = "", author = "", publisher = "", description = "", quantity = 0, status = ""
        } = values;
        setIsSubmit(true);
        const thumbnail = fileListThumbnail?.[0]?.name ?? "";

        const response = await updateBookAPI(
            id, category, title, author, publisher, thumbnail, description, quantity, status
        )

        if (response && response.data) {
            message.success("Update book successfully");
            form.resetFields();
            setFileListThumbnail([]);
            setOpenModalUpdate(false);
            setDataUpdate(null);
            refreshTable();
        } else {
            const errorMessage = Array.isArray(response.message) ? (
                <ul style={{listStyle: 'inside ', textIndent: '-20px'}}>
                    {response.message.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            ) : (
                <div>{response.message}</div>
            );
            api.open({
                message: response.error,
                description: errorMessage,
                type: 'error',
                showProgress: true,
                pauseOnHover: true,
            });
        }
        setIsSubmit(false);
    }

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < MAX_UPLOAD_IMAGE_SIZE;
        if (!isLt2M) {
            message.error(`Image must smaller than ${MAX_UPLOAD_IMAGE_SIZE}MB!`);
        }
    
        return isJpgOrPng && isLt2M || Upload.LIST_IGNORE;
    };

    const handleRemove = async (type: BookUploadType) => {
        if (type === 'thumbnail') {
            const file = fileListThumbnail?.[0]?.name;
            await deleteThumbAPI(file);
            setFileListThumbnail([])
        }
    };

    const getBase64 = (file: FileType): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
    };

    const handleChange = async (info: UploadChangeParam, type: BookUploadType) => {
        const file = fileListThumbnail?.[0]?.name;
        await deleteThumbAPI(file);
        if (info.file.status === 'uploading') {
            if (type === "thumbnail") {
                setLoadingThumbnail(true);
            }
            return;
        }

        if (info.file.status === 'done') {
            // Get this url from response in real world.
            if (type === "thumbnail") {
                setLoadingThumbnail(false);
            }
        }
    };

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };

    const handleUploadFile = async (options: RcCustomRequestOptions, type: BookUploadType) => {
        const { onSuccess } = options;
        const file = options.file as UploadFile;
        const response = await uploadFileAPI(file);

        if (response && response.data) {
            const uploadedFile: any = {
                uid: file.uid,
                name: response.data.fileUploaded, // get file name from backend
                status: "done",
                url: `${import.meta.env.VITE_BACKEND_URL}/upload/${response.data.fileUploaded}`
            }
            if (type === "thumbnail") {
                setFileListThumbnail([{ ...uploadedFile }])
            }

            if (onSuccess) {
                onSuccess("ok");
            }
        } else {
            message.error(response.message);
        }
    };

    return (
        <>
            <Modal
                title="Update a book"
                open={openModalUpdate}
                onOk={() => {form.submit()}}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    form.resetFields();
                    setFileListThumbnail([]);
                    setDataUpdate(null)
                }}
                destroyOnClose={true}
                okText={"Update"}
                cancelText={"Cancel"}
                confirmLoading={isSubmit}
                width={900}
                maskClosable={false}
            >
                <Divider />

                <Form
                    {...formItemLayout}
                    form={form}
                    name="basic"
                    style={{ maxWidth: "100%" }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        hidden
                        label="Id"
                        name="id"
                    >
                        <Input disabled/>
                    </Form.Item>
                    <Row gutter={16}> 
                        <Col span={12}>
                            <Form.Item<FieldType> label="Category" name="category">
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType> label="Title" name="title">
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}> 
                        <Col span={12}>
                            <Form.Item<FieldType> label="Author" name="author" >
                                <Input />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType> label="Publisher" name="publisher" >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Row gutter={16}> 
                        <Col span={12}>
                            <Form.Item<FieldType> label="Quantity" name="quantity" >
                                <InputNumber min={0} style={{ width: "100%" }} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType> label="Status" name="status" >
                                <Select>
                                    <Select.Option value="AVAILABLE">Available</Select.Option>
                                    <Select.Option value="UNAVAILABLE">Unavailable</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item<FieldType> label="Description" name="description" >
                                <TextArea />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Thumbnail"
                                name="thumb"

                                //convert value from Upload => form
                                valuePropName="fileList"
                                getValueFromEvent={normFile}
                            >
                                <Upload
                                    listType="picture-card"
                                    className="avatar-uploader"
                                    maxCount={1}
                                    multiple={false}
                                    customRequest={(options) => handleUploadFile(options, 'thumbnail')}
                                    beforeUpload={beforeUpload}
                                    onChange={(info) => handleChange(info, 'thumbnail')}
                                    onPreview={handlePreview}
                                    onRemove={() => handleRemove('thumbnail')}
                                    fileList={fileListThumbnail}
                                >
                                    <div>
                                        {loadingThumbnail ? <LoadingOutlined /> : <PlusOutlined />}
                                        <div style={{ marginTop: 8 }}>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>

                        </Col>
                    </Row>
                </Form>

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

                {contextHolder}
            </Modal>
        </>
    )
}

export default UpdateBook;