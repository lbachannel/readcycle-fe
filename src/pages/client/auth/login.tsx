import { Form, Divider, Input, Button, ConfigProvider, Space } from 'antd';
import { AntDesignOutlined } from '@ant-design/icons';
import { createStyles } from 'antd-style';
import type { FormProps } from 'antd';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import './login.scss';

type FieldType = {
    email: string;
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
    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log(values)
    };
    return (
        <div className="login-page">
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
                                name="email"
                                rules={[
                                    { required: true, message: 'Email is required!' },
                                    { type: "email", message: "Email không đúng định dạng!" }
                                ]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }}
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Password is required!' }]}
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
                                        <Button type="primary" htmlType="submit" loading={isSubmit} icon={<AntDesignOutlined />}>
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
    )
};

export default LoginPage;