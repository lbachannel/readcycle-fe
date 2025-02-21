import BorrowBookDetails from "@/components/client/borrow";
import ConfirmInFo from "@/components/client/borrow/info";
import { useCurrentApp } from "@/components/context/app.context";
import { Breadcrumb, Button, Result, Row, Steps } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";

const BorrowBookPage = () => {

    const [currentStep, setCurrentStep] = useState<number>(0);
    const { carts } = useCurrentApp();
    
    return (
        <>
            <div style={{ background: '#efefef', padding: "20px 0" }}>
                <Breadcrumb
                    className="breadcrumb"
                    separator=">"
                    items={[
                        {
                            title: <Link to={"/"}>Home</Link>,
                        },
                        {
                            title: 'Borrow books',
                        }
                    ]}
                />

                <div className="borrow-container">
                    <Row gutter={[20, 0]}>
                        {carts.length !== 0 && 
                            <Steps
                                className="steps"
                                size="small"
                                current={currentStep}
                                items={[
                                    {
                                        title: "Borrow books",
                                    },
                                    {
                                        title: "Confirm info",
                                    },
                                    {
                                        title: "Done",
                                    },
                                ]}
                            />
                        }

                        {currentStep === 2 && 
                            <Steps
                                className="steps"
                                size="small"
                                current={currentStep}
                                items={[
                                    {
                                        title: "Borrow books",
                                    },
                                    {
                                        title: "Confirm info",
                                    },
                                    {
                                        title: "Done",
                                    },
                                ]}
                            />
                        }
                    </Row>
                </div>
                
                {currentStep === 0 &&
                    <BorrowBookDetails setCurrentStep={setCurrentStep} />
                }

                {currentStep === 1 &&
                    <ConfirmInFo setCurrentStep={setCurrentStep} />
                }

                {currentStep === 2 &&
                    <Result
                        status="success"
                        title="Borrow books successfully"
                        subTitle="The system has recorded your book borrowing information."
                        style={{ height: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                        extra={[
                            <Button key="home">
                                <Link to={"/"} type="primary">
                                    Home
                                </Link>
                            </Button>,

                            <Button key="history">
                                <Link to={"/"} type="primary">
                                    Borrow history
                                </Link>
                            </Button>,
                        ]}
                    />
                }
            </div>
        </>
    )
}

export default BorrowBookPage;