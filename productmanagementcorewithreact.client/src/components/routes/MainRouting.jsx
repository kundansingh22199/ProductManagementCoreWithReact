import { Routes, Route, useLocation } from "react-router-dom";

import Header from "../main/layout/Header";
import Footer from "../main/layout/Footer";

import Home from "../main/Home";
import Login from "../main/view/Login";
import NotFound from "../main/view/NotFound";

function Layout() {
    const location = useLocation();

    const hideLayout = location.pathname === "/login";

    return (
        <>
            {!hideLayout && <Header />}

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
            </Routes>

            {!hideLayout && <Footer />}
        </>
    );
}

export default function MainRouting() {
    return <Layout />;
}