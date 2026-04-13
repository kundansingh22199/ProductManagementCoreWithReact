import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;

export default function Login() {

    const navigate = useNavigate();
    const [formData, setFormData] = useState({ userid: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            debugger
            if (data.status) {
                sessionStorage.setItem("user", JSON.stringify(data));

                navigate("/user/dashboard", { replace: true });
            } else {
                alert(data.message);
            }

        } catch (error) {
            console.error(error);
            alert("Server error");
        }

        setLoading(false);
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-5">
                        <div className="card shadow border-0">
                            <div className="card-body p-4">
                                <div className="mb-3">
                                    <Link to="/" className="text-decoration-none">← Back to Home</Link>
                                </div>
                                <h3 className="text-center fw-bold mb-3">Welcome Back 👋</h3>
                                <p className="text-center text-muted mb-4">Login to continue</p>

                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label>User ID</label>
                                        <input type="text" name="userid" className="form-control" onChange={handleChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label>Password</label>
                                        <input type="password" name="password" className="form-control" onChange={handleChange} required />
                                    </div>

                                    <button className="btn btn-warning w-100" disabled={loading}>
                                        {loading ? "Logging..." : "Login"}
                                    </button>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}