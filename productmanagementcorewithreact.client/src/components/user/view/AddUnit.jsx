import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL;

function AddUnit() {
    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr)?.token : null;
    const [loading, setLoading] = useState(true);
    const hasFetch = useRef(false);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        UnitName: "",
        Unit: ""
    });
    useEffect(() => {
        if (hasFetch.current) return
        hasFetch.current = true;
        const fetchCategory = async () => {
            try {
                if (!token) {
                    sessionStorage.clear();
                    navigate("/login", { replace: true });
                    return;
                }
                debugger
                const res = await axios.get(`${API_URL}/api/categoryList`, {
                    headers: {
                        "X-Auth-Token": token
                    }
                });
                const data = res.data;
                if (data.status) {
                    setCategories(data.data || []);
                }
            } catch (e) {
                if (e.response.status == 401) {
                    sessionStorage.clear();
                    setLoading(false);
                    navigate("/login", { replace: true });
                    return;
                }
            }
            finally {
                setLoading(false)
            }
        }
        fetchCategory();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    }
    const handleSubmit = async (e) => {
        debugger
        e.preventDefault();
        if (!form.UnitName || !form.Unit) {
            alert("All fields required");
            return;
        }
        try {
            const res = await axios.post(`${API_URL}/api/addUnit`,form,
                {
                    headers: {
                        "X-Auth-Token": token
                    }
                }
            );
            debugger
            if (res.status === 200 || res.status === 201) {
                alert(res.data.message);
            }
        } catch (e) {
            if (e.response.status == 401) {
                sessionStorage.clear();
                setLoading(false);
                navigate("/login", { replace: true });
                return;
            }
            else {
                alert(res.data.message);
            }
        }
        finally {
            setLoading(false);
        }
    }
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                    <div className="breadcrumb-main">
                        <h4 className="text-capitalize breadcrumb-title">Add Unit</h4>
                        <div className="breadcrumb-action justify-content-center flex-wrap">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item">
                                        <a href="#">
                                            <i className="uil uil-estate" />
                                            Home
                                        </a>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        Add Unit
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-element">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="card card-default card-md mb-4">
                            <div className="card-header">
                                <h6>Add Unit</h6>
                            </div>
                            <form onSubmit={handleSubmit }>
                                <div className="card-body">
                                    <div className="">
                                        <div className="form-basic">
                                            <div className="form-group" style={{ display: "none" }}>
                                                <label htmlFor="formGroupExampleInput" className="color-dark fs-14 fw-500 align-center mb-10">
                                                    Choose Category :
                                                </label>
                                                <select className="form-control ih-medium ip-gray radius-xs b-light px-15" name="CatId" >
                                                    <option value="">Select</option>
                                                    {categories.map((c) => (
                                                        <option value={c.id}>{c.categoryName}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group mb-25" id="category">
                                                <label>Unit Full Name</label>
                                                <input type="text" id="txtcategory" onChange={handleChange} name="UnitName"
                                                    className="form-control form-control-lg" placeholder="Enter Unit Name" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="formGroupExampleInput2" className="color-dark fs-14 fw-500 align-center mb-10" >
                                                    Unit Prefix
                                                </label>
                                                <input type="text" name="Unit" onChange={handleChange} className="form-control form-control-lg" placeholder="Enter Unit" />
                                            </div>
                                            <div className="form-group mb-0">
                                                <button type="submit" className="btn btn-lg btn-primary btn-submit" value="rdomanually" >
                                                    Save
                                                </button>
                                                <br />
                                                <label id="errorLbl" className="text-danger">

                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default AddUnit