import { Outlet } from "react-router-dom";
import AppHeader from "./components/layout/app.header";
import { useEffect } from "react";
import { getAccountAPI } from "services/api";
import { useCurrentApp } from "./components/context/app.context";

function Layout() {
    const {setUser, setIsAuthenticated} = useCurrentApp();
    useEffect(() => {
        const getAccount = async() => {
            const response = await getAccountAPI();
            if (response.data) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            }
        }
        getAccount();
    }, [])
    return (
        <>
            <AppHeader />
            <Outlet />
        </>
    )
}

export default Layout;
