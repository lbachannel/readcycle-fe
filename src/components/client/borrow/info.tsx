import { useCurrentApp } from "@/components/context/app.context";
import { RollbackOutlined } from "@ant-design/icons";
import { Button, Col, Empty, Form, Input, Row } from "antd";
import { useEffect, useState } from "react";

interface IProps {
    setCurrentStep: (v: number) => void;
}

type FieldType = {
    fullName: string;
    username: string;
};

const ConfirmInFo = (props: IProps) => {
    const { setCurrentStep } = props;
    const { carts, user } = useCurrentApp();
    const [form] = Form.useForm();
    const [isSubmit, setIsSubmit] = useState(false);

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                fullName: user.name,
                username: user.email
            })
        }
    }, [user])

    return (
        <div style={{ background: '#efefef' }}>
            
            <div className="borrow-container">
                {carts.length === 0 &&
                    <Empty
                        className="borrow-book__empty"
                        description="Empty book"
                    />
                }
                <Row gutter={[20, 0]}>
                    
                    <Col md={18} xs={24}>
                        {carts?.map((item, index) => {
                            return (
                                <div className='borrow-book' key={`index-${index}`} >
                                    <>
                                        <img src={`${import.meta.env.VITE_BACKEND_URL}/upload/${item?.details?.thumb}`} />
                                        

                                        <div className='borrow-book_content'>
                                            <div className="borrow-book_category">
                                                {item?.details?.category}
                                            </div>
                                            <div className="borrow-book_name">
                                                {item?.details?.title}
                                            </div>                       

                                            <div className="borrow-book__author">
                                                by {item?.details?.author} (Author)
                                            </div>

                                            <div className="borrow-book__desc">
                                                {item?.details?.description}
                                            </div>
                                        </div>
                                    </>
                                </div>
                            )
                        })}

                    </Col>
                    {carts.length !== 0 &&
                        <Col md={6} xs={24} >
                            <Form
                                form={form}
                                name="payment-form"

                                autoComplete="off"
                                layout='vertical'
                            >
                                <div className='order-sum'>


                                    <Form.Item<FieldType>
                                        label="Fullname"
                                        name="fullName"
                                    >
                                        <Input />
                                    </Form.Item>

                                    <Form.Item<FieldType>
                                        label="Email"
                                        name="username"
                                    >
                                        <Input />
                                    </Form.Item>

                                    <div className='borrow-book__sum'>
                                        <Button
                                            color="primary" variant="solid"
                                            htmlType='submit'
                                            loading={isSubmit}
                                        >
                                            Borrow ({carts?.length ?? 0})
                                        </Button>

                                    </div>
                                </div>
                            </Form>
                    
                            <div style={{padding: "20px",  marginTop: "20px", textAlign: "center" }}>
                                <span
                                    style={{ 
                                        cursor: "pointer", color: "#000", border: "1px solid #000",
                                        padding: "10px 20px", fontWeight: "500", borderRadius: "5px" }}
                                    onClick={() => props.setCurrentStep(0)}
                                >
                                    <RollbackOutlined /> Back to step 1
                                </span>
                            </div>
                        </Col>
                    }
                </Row>
            </div>
        </div>
    )

}

export default ConfirmInFo;