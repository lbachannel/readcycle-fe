import { useCurrentApp } from "components/context/app.context";
import { Result } from 'antd';
import { Link, useLocation } from "react-router-dom";

interface IProps {
    children: React.ReactNode
}

const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();
    const location = useLocation();
    const isAdminRoute = location.pathname.includes("admin");

    if (isAuthenticated === false) {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={<Link style={{ background: "#1677ff" , padding: "10px 20px", color: "#fff", borderRadius: "5px"}} to='/'>Back Home</Link>}
            />
        )
    } else {
        if (isAdminRoute === true) {
            const role = user?.role?.name;
            if (role === "user") {
                return (
                    <Result
                        status="403"
                        title="403"
                        subTitle="Sorry, you are not authorized to access this page."
                        extra={<Link style={{ background: "#1677ff" , padding: "10px 20px", color: "#fff", borderRadius: "5px"}} to='/'>Back Home</Link>}
                        />
                        
                )
            }
        }
    }
    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute;