import { Form, Divider, Input, Button, ConfigProvider, Space, App } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import type { FormProps } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './change-password.scss';
import { changePasswordAPI } from '@/services/api';

type FieldType = {
    username: string;
    password: string;
    newPassword: string;
    confirmNewPassword: string;
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

const ChangePasswordPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { styles } = useStyle();
    const { message } = App.useApp();
    const navigate = useNavigate();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        const { username = "", password = "", newPassword = "", confirmNewPassword = "" } = values;
        setIsSubmit(true);
        await changePasswordAPI(username, password, newPassword, confirmNewPassword);
        message.success("Change password successfully")
        setIsSubmit(false);
        navigate('/login');
    };
    
    return (
        <>
            <div className="change-password-page">
                <main className="main">
                    <div className="container">
                        <section className="wrapper">
                            <div className="heading"></div>
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

                                <Form.Item<FieldType>
                                    labelCol={{ span: 24 }}
                                    label="New password"
                                    name="newPassword"
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item<FieldType>
                                    labelCol={{ span: 24 }}
                                    label="Confirm password"
                                    name="confirmNewPassword"
                                >
                                    <Input.Password />
                                </Form.Item>
                                
                                <ConfigProvider
                                    button={{
                                        className: styles.linearGradientButton,
                                    }}
                                >
                                    <Space>
                                        <Form.Item>
                                            <Button 
                                                type="primary" 
                                                htmlType="submit" 
                                                loading={isSubmit} 
                                                icon={<AntDesignOutlined />}>
                                                Change
                                            </Button>
                                        </Form.Item>
                                    </Space>
                                </ConfigProvider>
                                

                                <Divider>Or</Divider>
                                <p className="text text-normal" style={{ textAlign: "center" }}>
                                    Back to
                                    <span>
                                        <Link to='/' > Home page </Link>
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

export default ChangePasswordPage;