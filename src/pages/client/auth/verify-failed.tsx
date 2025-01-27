import { Result } from 'antd';
import './verify-email.scss';
const VerifyFailedPage = () => {
    return (
        <>
            <div className="verify-email">
                <main className="main">
                    <div className="container">
                        <section className="wrapper">
                        <Result
                            status="error"
                            title="Email verification failed"
                            subTitle="The email verification period has expired"
                        />
                        </section>
                    </div>
                </main>
            </div>
        </>
    )
}

export default VerifyFailedPage;
