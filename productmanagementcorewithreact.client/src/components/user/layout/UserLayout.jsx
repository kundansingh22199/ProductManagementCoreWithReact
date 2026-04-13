import UserHeader from "./UserHeader";
import Sidebar from "./Sidebar";
import UserFooter from "./UserFooter";
import { Outlet } from "react-router-dom";

export default function UserLayout() {
    return (
        <>
            <UserHeader />

            <div className="main-content mb-4">
                <Sidebar />
                <div className="contents mt-4">
                    <div className="crm mb-4">
                        <Outlet />
                    </div>
                </div>
            </div>

            <UserFooter />
        </>
    );
}