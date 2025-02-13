import { createBookAPI } from "@/services/api";
import { App, Divider, Form, FormProps, Modal, notification } from "antd";
import { useState } from "react";

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
    thumb: string;
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
    const [api, contextHolder] = notification.useNotification();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const {
            category = "",
            title = "",
            author = "",
            publisher = "",
            thumb = "",
            description = "",
            quantity,
            status = ""
        } = values;
        setIsSubmit(true);
        const response = await createBookAPI(category, title, author, publisher, thumb, description, quantity, status);
        if (response && response.data) {
            message.success("Create book successfully");
            form.resetFields();
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

    return (
        <>
            <Modal
                title="Create a book"
                open={openModalCreate}
                onOk={() => { form.submit()}}
                onCancel={() => {
                    setOpenModalCreate(false);
                    form.resetFields();
                }}
                okText={"Create"}
                cancelText={"Cancel"}
                confirmLoading={isSubmit}
            >
                <Divider />

                <Form
                    {...formItemLayout}
                    form={form}
                    name="basic"
                    style={{ maxWidth: 600 }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    {contextHolder}
                </Form>
            </Modal>
        </>
    )
}

export default CreateBook;