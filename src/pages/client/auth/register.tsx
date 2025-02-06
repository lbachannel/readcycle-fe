import { Form, Divider, Input, DatePicker, Button, ConfigProvider, Space, App, notification } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import type { FormProps } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './register.scss';
import { registerAPI } from '@/services/api';

type FieldType = {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
    password: string;
    confirmPassword: string;
};

// button linear-gradient
const useStyle = createStyles(({ prefixCls, css }) => ({
    linearGradientButton: css`
        &.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
            > span {
                position: relative;
            }

        &::before {
            content: '';
            background: linear-gradient(135deg, #6253e1, #04befe);
            position: absolute;
            inset: -1px;
            opacity: 1;
            transition: all 0.3s;
            border-radius: inherit;
        }

        &:hover::before {
            opacity: 0;
        }
    }
    `,
}));

const formItemLayout = {
    labelCol: {
        xs: { span: 7 }
    },
    wrapperCol: {
        xs: { span: 24 }
    },
};

const RegisterPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { message } = App.useApp();
    const { styles } = useStyle();
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { firstName = "", lastName = "", email = "", dateOfBirth = "", password = "", confirmPassword = ""} = values;
        let yob = "";
        if (!dateOfBirth) {
            yob = "";
        } else if (dayjs(dateOfBirth).format('YYYY-MM-DD') >= dayjs().format('YYYY-MM-DD')) {
            yob = dayjs().format('YYYY-MM-DD');
        } else {
            yob = dayjs(dateOfBirth).format('YYYY-MM-DD');
        }
        const response = await registerAPI(firstName, lastName, email, yob, password, confirmPassword);
        if (response.data) {
            localStorage.setItem('registerSuccess', 'Please check email to verify your account before login.');
            message.success('Register member successfully');
            navigate("/login");
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
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading"></div>
                        <Form
                            {...formItemLayout}
                            name="form-register"
                            onFinish={onFinish}
                            autoComplete="off"
                            labelAlign="left"
                        >
                            <Form.Item<FieldType>
                                label="Firstname"
                                name="firstName"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Lastname"
                                name="lastName"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Date of birth"
                                name="dateOfBirth"
                            >
                                <DatePicker style={{ width: "100%" }} />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Email"
                                name="email"
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Password"
                                name="password"
                            >
                                <Input.Password />
                            </Form.Item>

                            <Form.Item<FieldType>
                                label="Confirm password"
                                name="confirmPassword"
                            >
                                <Input.Password />
                            </Form.Item>
                            
                            <ConfigProvider
                                button={{
                                    className: styles.linearGradientButton,
                                }}
                            >
                                {contextHolder}
                                <Space>
                                    <Form.Item>
                                        <Button 
                                            type="primary" 
                                            htmlType="submit" 
                                            loading={isSubmit} 
                                            icon={<AntDesignOutlined />} >
                                            Register
                                        </Button>
                                    </Form.Item>
                                </Space>
                            </ConfigProvider>
                            

                            <Divider>Or</Divider>
                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                Already have an account?
                                <span>
                                    <Link to='/login' > Login </Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>

            </main>
        </div>
    );
}

export default RegisterPage;