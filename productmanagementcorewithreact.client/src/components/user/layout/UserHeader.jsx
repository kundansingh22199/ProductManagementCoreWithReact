import { Link, useNavigate } from "react-router-dom";

export default function UserHeader() {
    const navigate = useNavigate(); //  REQUIRED

    const handleLogout = () => {
        //  Clear session
        sessionStorage.clear();

        //  Redirect without reload
        navigate("/login", { replace: true });
    };
    return (
        <header className="header-top">
            <nav className="navbar navbar-light">
                <div className="navbar-left">
                    <div className="logo-area">
                        <Link className="navbar-brand" to="/user/dashboard">
                            {/* <img className="dark" src="/images/kundan.jpg" alt="logo" />
          <img className="light" src="/images/kundan.jpg" alt="logo" /> */}
                            <h2>Kundan</h2>
                        </Link>
                        <a href="#" className="sidebar-toggle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="svg replaced-svg"
                            >
                                <path
                                    fill="#525768"
                                    d="M5,8H19a1,1,0,0,0,0-2H5A1,1,0,0,0,5,8Zm16,3H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Zm-2,5H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z"
                                />
                            </svg>
                        </a>
                    </div>
                    <a href="#" className="customizer-trigger">
                        <i className="uil uil-edit-alt" />
                        <span>Customize...</span>
                    </a>
                    <div className="top-menu">
                        <div className="hexadash-top-menu position-relative">

                        </div>
                    </div>
                </div>
                {/* ends: navbar-left */}
                <div className="navbar-right">
                    {/* ends: .navbar-right__menu */}

                    <ul className="navbar-right__menu">
                        <li className="nav-search">
                            <a href="#" className="search-toggle">
                                <i className="uil uil-search" />
                                <i className="uil uil-times" />
                            </a>
                            <form action="/" className="search-form-topMenu">
                                <span className="search-icon uil uil-search" />
                                <input
                                    className="form-control me-sm-2 box-shadow-none"
                                    type="search"
                                    placeholder="Search..."
                                    aria-label="Search"
                                />
                            </form>
                        </li>
                        <li className="nav-message">
                            <div className="dropdown-custom">
                                <a href="javascript:;" className="nav-item-toggle icon-active">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width={20}
                                        height={16}
                                        viewBox="0 0 20 16"
                                        className="svg replaced-svg"
                                    >
                                        <path
                                            id="envelope"
                                            d="M19,4H5A3,3,0,0,0,2,7V17a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7a3,3,0,0,0-3-3Zm-.41,2-5.88,5.88a1,1,0,0,1-1.42,0L5.41,6ZM20,17a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V7.41l5.88,5.88a3,3,0,0,0,4.24,0L20,7.41Z"
                                            transform="translate(-2 -4)"
                                            fill="#a0a0a0"
                                        />
                                    </svg>
                                </a>
                                <div className="dropdown-parent-wrapper">
                                    <div className="dropdown-wrapper">

                                    </div>
                                </div>
                            </div>
                        </li>
                        {/* ends: nav-message */}
                        <li className="nav-notification">
                            <div className="dropdown-custom">
                                <a href="javascript:;" className="nav-item-toggle icon-active">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16.041"
                                        height="20.001"
                                        viewBox="0 0 16.041 20.001"
                                        className="svg replaced-svg"
                                    >
                                        <path
                                            id="bell"
                                            d="M18.035,13.208V10.02A6.015,6.015,0,0,0,13.023,4.1V3a1,1,0,1,0-2.005,0V4.1A6.015,6.015,0,0,0,6.005,10.02v3.188A3.008,3.008,0,0,0,4,16.035V18.04a1,1,0,0,0,1,1H8.15a4.01,4.01,0,0,0,7.74,0h3.148a1,1,0,0,0,1-1V16.035a3.008,3.008,0,0,0-2.005-2.827ZM8.01,10.02a4.01,4.01,0,0,1,8.02,0v3.008H8.01Zm4.01,10.025a2.005,2.005,0,0,1-1.724-1h3.449A2.005,2.005,0,0,1,12.02,20.046Zm6.015-3.008H6.005v-1a1,1,0,0,1,1-1H17.033a1,1,0,0,1,1,1Z"
                                            transform="translate(-4 -2)"
                                            fill="#a0a0a0"
                                        />
                                    </svg>
                                </a>
                            </div>
                        </li>
                        {/* ends: .nav-flag-select */}
                        <li className="nav-author">
                            <div className="dropdown-custom">
                                <a href="javascript:;" className="nav-item-toggle">
                                    <img src="/images/UserImage.jpg" alt="" className="rounded-circle" />
                                    <span className="nav-item__title">
                                        Danial
                                        <i className="las la-angle-down nav-item__arrow" />
                                    </span>
                                </a>
                                <div className="dropdown-parent-wrapper">
                                    <div className="dropdown-wrapper">
                                        <div className="nav-author__info">
                                            <div className="author-img">
                                                <img
                                                    src="/images/UserImage.jpg"
                                                    alt=""
                                                    className="rounded-circle"
                                                />
                                            </div>
                                            <div>
                                                <h6>Rabbi Islam Rony</h6>
                                                <span>UI Designer</span>
                                            </div>
                                        </div>
                                        <div className="nav-author__options">
                                            <ul>
                                                <li>
                                                    <Link to="/user/profile">
                                                        <i className="uil uil-user" /> Profile
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/user/setting">
                                                        <i className="uil uil-setting" />
                                                        Settings
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/user/killing">
                                                        <i className="uil uil-key-skeleton" /> Billing
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/user/activity">
                                                        <i className="uil uil-users-alt" /> Activity
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/user/help">
                                                        <i className="uil uil-bell" /> Help
                                                    </Link>
                                                </li>
                                            </ul>
                                            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="nav-author__signout" >
                                                <i className="uil uil-sign-out-alt" /> Sign Out
                                            </a>
                                        </div>
                                    </div>
                                    {/* ends: .dropdown-wrapper */}
                                </div>
                            </div>
                        </li>
                        {/* ends: .nav-author */}
                    </ul>
                </div>
                {/* ends: .navbar-right */}
            </nav>
        </header>

    );
}