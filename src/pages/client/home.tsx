import { Outlet } from "react-router-dom";
import AppHeader from "../../components/layout/app.header";

const HomePage = () => {
    return (
        <div>
            <AppHeader />
            <Outlet />
        </div>
    )
};

export default HomePage;