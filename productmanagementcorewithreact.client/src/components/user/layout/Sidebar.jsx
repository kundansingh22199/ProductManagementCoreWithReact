import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Sidebar() {

    const [openMenu, setOpenMenu] = useState(null);
    const navigate = useNavigate();

    const toggleMenu = (menu) => {
        setOpenMenu(openMenu === menu ? null : menu);
    };

    const handleLogout = () => {
        // Remove session
        sessionStorage.clear();
        sessionStorage.removeItem("user");
        // Update state
        navigate("/login", { replace: true });
    };

    // ✅ Common Icon Style Function
    const getIconStyle = (menu) => ({
        transform: openMenu === menu ? "rotate(360deg)" : "rotate(270deg)",
        transition: "0.3s"
    });

    return (
        <div className="sidebar-wrapper mt-4">
            <div className="sidebar sidebar-collapse">
                <div className="sidebar__menu-group">

                    <ul className="sidebar_nav">

                        {/* Dashboard */}
                        <li>
                            <Link to="/user/dashboard">
                                <span className="nav-icon uil uil-create-dashboard" />
                                <span className="menu-text">Dashboard</span>
                            </Link>
                        </li>

                        {/* Category */}
                        <li className={`has-child ${openMenu === "category" ? "open" : ""}`}>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleMenu("category"); }}>
                                <span className="nav-icon uil uil-bag" />
                                <span className="menu-text">Category</span>
                                <i className="uil uil-angle-down ms-auto" style={getIconStyle("category")} />
                            </a>
                            {openMenu === "category" && (
                                <ul>
                                    <li><Link to="/user/add-category">Add Category</Link></li>
                                    <li><Link to="/user/category-list">Category List</Link></li>
                                </ul>
                            )}
                        </li>

                        {/* Sub Category */}
                        <li className={`has-child ${openMenu === "subcat" ? "open" : ""}`}>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleMenu("subcat"); }}>
                                <span className="nav-icon uil uil-folder" />
                                <span className="menu-text">Sub Category</span>
                                <i className="uil uil-angle-down ms-auto" style={getIconStyle("subcat")} />
                            </a>
                            {openMenu === "subcat" && (
                                <ul>
                                    <li><Link to="/user/add-subcategory">Add Sub Category</Link></li>
                                    <li><Link to="/user/subcategory-list">Sub Category List</Link></li>
                                </ul>
                            )}
                        </li>

                        {/* Unit */}
                        <li className={`has-child ${openMenu === "unit" ? "open" : ""}`}>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleMenu("unit"); }}>
                                <span className="nav-icon uil uil-apps" />
                                <span className="menu-text">Unit</span>
                                <i className="uil uil-angle-down ms-auto" style={getIconStyle("unit")} />
                            </a>
                            {openMenu === "unit" && (
                                <ul>
                                    <li><Link to="/user/add-unit">Add Unit</Link></li>
                                    <li><Link to="/user/unit-list">Unit List</Link></li>
                                </ul>
                            )}
                        </li>

                        {/* Product */}
                        <li className={`has-child ${openMenu === "product" ? "open" : ""}`}>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleMenu("product"); }}>
                                <span className="nav-icon uil uil-books" />
                                <span className="menu-text">Product</span>
                                <i className="uil uil-angle-down ms-auto" style={getIconStyle("product")} />
                            </a>
                            {openMenu === "product" && (
                                <ul>
                                    <li><Link to="/user/add-product">Add Product</Link></li>
                                    <li><Link to="/user/product-list">Product List</Link></li>
                                </ul>
                            )}
                        </li>

                        {/* Slider */}
                        <li className={`has-child ${openMenu === "slider" ? "open" : ""}`}>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleMenu("slider"); }}>
                                <span className="nav-icon uil uil-search" />
                                <span className="menu-text">Slider</span>
                                <i className="uil uil-angle-down ms-auto" style={getIconStyle("slider")} />
                            </a>
                            {openMenu === "slider" && (
                                <ul>
                                    <li><Link to="/user/add-slider">Add Slider</Link></li>
                                    <li><Link to="/user/slider-list">Slider List</Link></li>
                                </ul>
                            )}
                        </li>

                        {/* Orders */}
                        <li className={`has-child ${openMenu === "order" ? "open" : ""}`}>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleMenu("order"); }}>
                                <span className="nav-icon uil uil-table" />
                                <span className="menu-text">Order</span>
                                <i className="uil uil-angle-down ms-auto" style={getIconStyle("order")} />
                            </a>
                            {openMenu === "order" && (
                                <ul>
                                    <li><Link to="/user/pending-orders">Pending</Link></li>
                                    <li><Link to="/user/confirm-orders">Confirm</Link></li>
                                    <li><Link to="/user/complete-orders">Complete</Link></li>
                                    <li><Link to="/user/cancel-orders">Cancel</Link></li>
                                </ul>
                            )}
                        </li>

                        {/* Support */}
                        <li className={`has-child ${openMenu === "support" ? "open" : ""}`}>
                            <a href="#" onClick={(e) => { e.preventDefault(); toggleMenu("support"); }}>
                                <span className="nav-icon uil uil-user" />
                                <span className="menu-text">Support</span>
                                <i className="uil uil-angle-down ms-auto" style={getIconStyle("support")} />
                            </a>
                            {openMenu === "support" && (
                                <ul>
                                    <li><Link to="/user/support">Support</Link></li>
                                    <li><Link to="/user/inbox">Inbox</Link></li>
                                    <li><Link to="/user/outbox">Outbox</Link></li>
                                </ul>
                            )}
                        </li>

                        <li>
                            {/*<Link to="" onClick={handleLogout}> <span className="nav-icon uil uil-signin" /> <span className="menu-text">Logout</span> </Link>*/}
                            <button onClick={handleLogout} className="btn btn-link text-start w-100">
                                <span className="nav-icon uil uil-signin" />
                                <span className="menu-text">Logout</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
