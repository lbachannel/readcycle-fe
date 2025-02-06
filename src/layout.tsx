import { Outlet } from "react-router-dom";
import AppHeader from "components/layout/app.header";
import { useState } from "react";

function Layout() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    return (
        <>
            <AppHeader 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}/>
            <Outlet />
        </>
    )
}

export default Layout;
