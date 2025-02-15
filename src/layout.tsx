import { Outlet } from "react-router-dom";
import AppHeader from "components/layout/app.header";
import { useState } from "react";
import AppFooter from "components/layout/app.footer";

function Layout() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    return (
        <>
            <AppHeader 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}/>
            <Outlet />

            <AppFooter />
        </>
    )
}

export default Layout;
