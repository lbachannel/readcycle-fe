import { Result } from 'antd';
import './verify-email.scss';
const VerifySuccessPage = () => {
    return (
        <>
            <div className="verify-email">
                <main className="main">
                    <div className="container">
                        <section className="wrapper">
                            <Result
                                status="success"
                                title="Email Verified"
                                subTitle="Your account has been verified successfully"
                            />
                        </section>
                    </div>
                </main>
            </div>
        </>
    )
}

  export default VerifySuccessPage;