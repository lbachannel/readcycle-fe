import { Result } from 'antd';
import './verify-email.scss';
import { Link } from 'react-router-dom';
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
                            <Link
                                style={{padding: "10px 20px", background: "#f2f5f9", display: "block", textAlign: "center"}}
                                to={"/change-password"}>Change your password</Link>
                        </section>
                    </div>
                </main>
            </div>
        </>
    )
}

  export default VerifySuccessPage;