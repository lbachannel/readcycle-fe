import { Result } from 'antd';

const VerifyFailedPage = () => {
    return (
        <>
            <Result
                status="error"
                title="Email verification failed"
                subTitle="The email verification period has expired"
            />
        </>
    )
}

export default VerifyFailedPage;
