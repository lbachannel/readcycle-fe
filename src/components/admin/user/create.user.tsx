import { createUserAPI } from "@/services/api";
import { App, DatePicker, Divider, Form, FormProps, Input, Modal, notification, Select } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import '../../../styles/create.user.scss';

interface IProps {
    openModalCreate: boolean;
    setOpenModalCreate: (v: boolean) => void;
    refreshTable: () => void;
}

type FieldType = {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    role: string;
}

const formItemLayout = {
    labelCol: {
        xs: { span: 7 }
    },
    wrapperCol: {
        xs: { span: 24 }
    },
};

const CreateUser = (props: IProps) => {
    const { openModalCreate, setOpenModalCreate, refreshTable } = props;

    const [isSubmit, setIsSubmit] = useState<boolean>(false);

    const { message } = App.useApp();

    const [form] = Form.useForm();

    const [api, contextHolder] = notification.useNotification();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { firstName = "", lastName = "", email = "", dateOfBirth = "", role = ""} = values;
        setIsSubmit(true);
        let yob = "";
        if (!dateOfBirth) {
            yob = "";
        } else if (dayjs(dateOfBirth).format('YYYY-MM-DD') >= dayjs().format('YYYY-MM-DD')) {
            yob = dayjs().format('YYYY-MM-DD');
        } else {
            yob = dayjs(dateOfBirth).format('YYYY-MM-DD');
        }
        const response = await createUserAPI(firstName, lastName, email, yob, role);
        if (response && response.data) {
            message.success("Create user successfully");
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
    };

    return (
        <>
            <Modal
                title="Create a user"
                open={openModalCreate}
                onOk={() => { form.submit() }}
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
                    <Form.Item<FieldType>
                        label="Date of birth"
                        name="dateOfBirth"
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="First name"
                        name="firstName"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Last name"
                        name="lastName"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Role"
                        name="role"
                    >
                        <Select>
                            <Select.Option value="admin">Admin</Select.Option>
                            <Select.Option value="user">User</Select.Option>
                        </Select>
                    </Form.Item>
                    {contextHolder}
                </Form>
            </Modal>
        </>
    )
}

export default CreateUser;