import { updateUserAPI } from "@/services/api";
import { App, Form, FormProps, notification, Divider, Modal, Input, DatePicker, Select } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

interface IProps {
    openModalUpdate: boolean;
    setOpenModalUpdate: (v: boolean) => void;
    refreshTable: () => void;
    setDataUpdate: (v: IUserTable | null) => void;
    dataUpdate: IUserTable | null;
}

type FieldType = {
    id: string;
    name: string;
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


const UpdateUser = (props: IProps) => {
    const { openModalUpdate, setOpenModalUpdate, refreshTable, setDataUpdate, dataUpdate } = props;
    const [isSubmit, setIsSubmit] = useState<boolean>(false);
    const { message } = App.useApp();

    const [form] = Form.useForm();

    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        if (dataUpdate) {
            form.setFieldsValue({
                id: dataUpdate.id,
                name: dataUpdate.name,
                email: dataUpdate.email,
                dateOfBirth: dataUpdate.dateOfBirth ? dayjs(dataUpdate.dateOfBirth) : "",
                role: dataUpdate.role.name === "admin" ? "admin" : "user"
            })
        }
    }, [dataUpdate])

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { id = "", name = "", email = "", dateOfBirth = "", role = "" } = values;
        setIsSubmit(true);
        let yob = "";
        if (!dateOfBirth) {
            yob = "";
        } else if (dayjs(dateOfBirth).format('YYYY-MM-DD') >= dayjs().format('YYYY-MM-DD')) {
            yob = dayjs().format('YYYY-MM-DD');
        } else {
            yob = dayjs(dateOfBirth).format('YYYY-MM-DD');
        }
        const response = await updateUserAPI(id, name, email, yob, role);
        if (response && response.data) {
            message.success("Update user successfully");
            form.resetFields();
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
    };

    return (
        <>
            <Modal
                title="Update a user"
                open={openModalUpdate}
                onOk={() => { form.submit() }}
                onCancel={() => {
                    setOpenModalUpdate(false);
                    setDataUpdate(null);
                    form.resetFields();
                }}
                okText={"Update"}
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
                        hidden
                        label="id"
                        name="id"
                    >
                        <Input disabled/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                    >
                        <Input disabled/>
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Date of birth"
                        name="dateOfBirth"
                    >
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Name"
                        name="name"
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
    );
};

export default UpdateUser;