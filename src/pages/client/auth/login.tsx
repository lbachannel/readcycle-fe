import { Form, Divider, Input, Button, ConfigProvider, Space, App, notification } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import type { FormProps } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './login.scss';
import { Alert } from 'antd';
import { loginAPI } from '@/services/api';

type FieldType = {
    username: string;
    password: string;
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

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { styles } = useStyle();
    const [alertMessage, setAlertMessage] = useState("");
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        const message = localStorage.getItem('registerSuccess');
        if (message) {
            setAlertMessage(message);
            localStorage.removeItem('registerSuccess');
        }
    }, []);
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { username = "", password = "" } = values;
        setIsSubmit(true);
        const response = await loginAPI(username, password);
        setIsSubmit(false);
        if (response?.data) {
            console.log(response.data.access_token);
            localStorage.setItem('access_token', response.data.access_token);
            message.success("Login successfully");
            navigate('/');
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
    };
    
    return (
        <>
            <div className="login-page">
                <main className="main">
                    <div className="container">
                        <section className="wrapper">
                            <div className="heading"></div>
                            {alertMessage && <Alert message={alertMessage} type="success" showIcon />}
                            <Form
                                name="form-register"
                                onFinish={onFinish}
                                autoComplete="off"
                                labelAlign="left"
                                >
                                <Form.Item<FieldType>
                                    labelCol={{ span: 24 }}
                                    label="Email"
                                    name="username"
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    labelCol={{ span: 24 }}
                                    label="Password"
                                    name="password"
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
                                                icon={<AntDesignOutlined />}>
                                                Login
                                            </Button>
                                        </Form.Item>
                                    </Space>
                                </ConfigProvider>
                                

                                <Divider>Or</Divider>
                                <p className="text text-normal" style={{ textAlign: "center" }}>
                                    Don't have an account?
                                    <span>
                                        <Link to='/register' > Register </Link>
                                    </span>
                                </p>
                            </Form>
                        </section>
                    </div>

                </main>
            </div>
        </>
    )
};

export default LoginPage;