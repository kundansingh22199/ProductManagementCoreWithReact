import { useEffect } from 'react';   //  ADD THIS
import { useNavigate, useLocation, BrowserRouter } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '../src/App.css';
import '../src/Pluging.min.css';

import MainRouting from "./components/routes/MainRouting";
import UserRouting from "./components/routes/UserRouting";

function AppWrapper() {
    const location = useLocation();
    const navigate = useNavigate();
    const isUserRoute = location.pathname.startsWith("/user");
    const isLogin = sessionStorage.getItem("user");
    // Redirect properly
    useEffect(() => {
        if (!isLogin && isUserRoute) {
            navigate("/login", { replace: true });
        }
    }, [isLogin, isUserRoute, navigate]);

    if (!isLogin && isUserRoute) {
        return null;
    }

    return (
        <>
            {isUserRoute && isLogin ? <UserRouting /> : <MainRouting />}
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AppWrapper />
        </BrowserRouter>
    );
}