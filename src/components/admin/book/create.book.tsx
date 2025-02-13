import { createBookAPI, uploadFileAPI } from "@/services/api";
import { App, Col, Divider, 
    Form, FormProps, GetProp, 
    Input, InputNumber, Modal, 
    Row, Select, Upload, UploadFile, UploadProps, Image, 
    notification} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useState } from "react";
import { UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';
import { MAX_UPLOAD_IMAGE_SIZE } from "@/services/helper";
import { UploadChangeParam } from "antd/es/upload";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
type BookUploadType = "thumbnail";

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
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

const CreateBook = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message } = App.useApp();
    const [form] = Form.useForm();

    const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);

    const [previewOpen, setPreviewOpen] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>('');

    const [fileListThumbnail, setFileListThumbnail] = useState<UploadFile[]>([]);

    const [api, contextHolder] = notification.useNotification();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const {
            category = "", title = "", author = "", publisher = "", description = "", quantity = 0, status = ""
        } = values;

        const thumbnail = fileListThumbnail?.[0]?.name ?? "";

        const response = await createBookAPI(
            category, title, author, publisher, thumbnail, description, quantity, status
        )
        if (response && response.data) {
            message.success("Create a book successfully");
            form.resetFields();
            setFileListThumbnail([]);
            setOpenModalCreate(false);
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

    const handleChange = (info: UploadChangeParam, type: BookUploadType) => {
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
                url: `${import.meta.env.VITE_BACKEND_URL}/images/book/${response.data.fileUploaded}`
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
    }

    return (
        <>
            <Modal
                title="Create a book"
                open={openModalCreate}
                onOk={() => { form.submit()}}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields();
                    setFileListThumbnail([]);
                }}
                destroyOnClose={true}
                okText={"Create"}
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
                            <Form.Item<FieldType> label="Description" name="description" >
                                <TextArea />
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
                            <Form.Item<FieldType> label="Quantity" name="quantity" >
                                <InputNumber min={1} style={{ width: "100%" }} />
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

export default CreateBook;