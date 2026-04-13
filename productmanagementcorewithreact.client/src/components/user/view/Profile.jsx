import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

function Profile() {

    const navigate = useNavigate();
    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr).token : null;

    const hashFetch = useRef(false);

    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("profile");

    // ✅ PROFILE STATE
    const [profile, setProfile] = useState({
        name: "", mobile: "", email: "", country: "", state: "", city: "", address: "", pincode: ""
    });

    // ✅ PASSWORD STATE
    const [passwordData, setPasswordData] = useState({
        oldPassword: "", password: ""
    });

    const [image, setImage] = useState("/images/kundan.png");

    // ================= FETCH PROFILE =================
    useEffect(() => {
        if (hashFetch.current) return;
        hashFetch.current = true;

        axios.get(`${API_URL}/api/getProfile`, {
            headers: { "X-Auth-Token": token }
        })
            .then(res => {
                setProfile(res.data.data);
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    sessionStorage.clear();
                    navigate("/login");
                } else {
                    alert(err.response?.data?.message || "Error");
                }
            })
            .finally(() => setLoading(false));

    }, []);

    // ================= HANDLE CHANGE =================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    // ================= UPDATE PROFILE =================
    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${API_URL}/api/updateProfile`, profile, {
            headers: { "X-Auth-Token": token }
        })
            .then(res => {
                alert(res.data.message);
            })
            .catch(err => {
                if (err.response?.status === 401) {
                    sessionStorage.clear();
                    navigate("/login");
                } else {
                    alert(err.response?.data?.message || "Error");
                }
            });
    };

    // ================= UPDATE PASSWORD =================
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        debugger;

        axios.post(`${API_URL}/api/updatePassword`, {
            OldPassword: passwordData.oldPassword,
            password: passwordData.password
        }, {
            headers: { "X-Auth-Token": token }
        }).then(res => {
            debugger;
            if (res.data.status) {
                alert(res.data.message);
                setPasswordData({ oldPassword: "", password: "" });
                sessionStorage.clear();
                navigate("/login");
            }
            else {
                alert(res.data.message);
            }
        }).catch(err => {
            if (err.response?.status === 401) {
                debugger;
                sessionStorage.clear();
                navigate("/login");
            } else {
                alert(err.response?.data?.message || "Error");
            }
        });
    };

    // ================= IMAGE =================
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Only image allowed");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert("Max 2MB allowed");
                return;
            }
            setImage(URL.createObjectURL(file));
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container-fluid mt-4">
            <div className="row g-4">

                {/* ================= LEFT PANEL ================= */}
                <div className="col-lg-3">
                    <div className="card shadow-sm border-0 text-center p-4">

                        {/* Image */}
                        <div className="position-relative mb-3">
                            <input type="file" hidden id="file" onChange={handleImageChange} />
                            <label htmlFor="file">
                                <img
                                    src={image}
                                    className="rounded-circle border"
                                    width="120"
                                    height="120"
                                    style={{ objectFit: "cover", cursor: "pointer" }}
                                />
                            </label>
                        </div>

                        <h5 className="mb-1">{profile.name || "User Name"}</h5>
                        <small className="text-muted">{profile.user_Type}</small>

                        <hr />

                        {/* Tabs */}
                        <div className="d-grid gap-2">
                            <button
                                className={`btn ${activeTab === "profile" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => setActiveTab("profile")}
                            >
                                Edit Profile
                            </button>

                            <button
                                className={`btn ${activeTab === "password" ? "btn-warning" : "btn-outline-warning"}`}
                                onClick={() => setActiveTab("password")}
                            >
                                Change Password
                            </button>
                        </div>

                    </div>
                </div>

                {/* ================= RIGHT PANEL ================= */}
                <div className="col-lg-9">

                    {/* ================= PROFILE ================= */}
                    {activeTab === "profile" && (
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">Edit Profile</h5>
                            </div>

                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">

                                        <div className="col-md-6">
                                            <label className="form-label">Full Name</label>
                                            <input name="name" value={profile.name} onChange={handleChange} className="form-control" />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Mobile</label>
                                            <input value={profile.mobile} readOnly className="form-control bg-light" />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input value={profile.email} readOnly className="form-control bg-light" />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Date of Birth</label>
                                            <input type="date" name="dob" value={profile.dob} onChange={handleChange} className="form-control" />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Country</label>
                                            <input name="country" value={profile.country} onChange={handleChange} className="form-control" />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">State</label>
                                            <input name="state" value={profile.state} onChange={handleChange} className="form-control" />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">City</label>
                                            <input name="city" value={profile.city} onChange={handleChange} className="form-control" />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Pincode</label>
                                            <input name="pincode" value={profile.pincode} onChange={handleChange} className="form-control" maxLength={6} />
                                        </div>

                                        <div className="col-md-12">
                                            <label className="form-label">Address</label>
                                            <textarea name="address" value={profile.address} onChange={handleChange} className="form-control" rows="2"></textarea>
                                        </div>

                                        <div className="col-12 text-end mt-3">
                                            <button className="btn btn-primary px-4">
                                                Update Profile
                                            </button>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* ================= PASSWORD ================= */}
                    {activeTab === "password" && (
                        <div className="card shadow-sm border-0">
                            <div className="card-header bg-white border-0">
                                <h5 className="mb-0">Change Password</h5>
                            </div>

                            <div className="card-body">
                                <form onSubmit={handlePasswordSubmit}>

                                    <div className="mb-3">
                                        <label className="form-label">Old Password</label>
                                        <input
                                            name="oldPassword"
                                            value={passwordData.oldPassword}
                                            onChange={handlePasswordChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={passwordData.password}
                                            onChange={handlePasswordChange}
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="text-end">
                                        <button className="btn btn-warning px-4">
                                            Update Password
                                        </button>
                                    </div>

                                </form>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default Profile;