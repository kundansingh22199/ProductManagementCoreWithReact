import { Link } from "react-router-dom";

export default function Header() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container">

                {/* Logo */}
                <Link className="navbar-brand fw-bold" to="/">
                    Kundan Singh
                </Link>

                {/* Toggle */}
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Menu */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">

                        <li className="nav-item">
                            <Link className="nav-link" to="/">Home</Link>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="#about">About</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="#services">Services</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="#products">Products</a>
                        </li>

                        <li className="nav-item">
                            <a className="nav-link" href="#contact">Contact</a>
                        </li>

                        <li className="nav-item">
                            <Link className="btn btn-warning ms-3" to="/login">
                                Login
                            </Link>
                        </li>

                    </ul>
                </div>

            </div>
        </nav>
    );
}