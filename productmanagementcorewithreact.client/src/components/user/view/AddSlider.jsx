import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

function AddSlider() {
    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr).token : null;
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const hashFetch = useRef(false);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        CatId: "",
        SliderName: "",
        Upload_SliderImage: null
    });
    useEffect(() => {
        if (hashFetch.current) return
        hashFetch.current = true;
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/categoryList`, {
                    headers: {
                        "X-Auth-Token": token
                    }
                });
                const data = res.data;
                if (res.status === 200 || res.status === 201) {
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
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "Upload_SliderImage") {
            setForm({ ...form, Upload_SliderImage: files[0] })
        }
        else {
            setForm({ ...form, [name]: value });
        }
    }
    const handleSubmit = async (e) => {
        debugger
        e.preventDefault();
        if (!form.CatId || !form.SliderName) {
            alert("All fields required");
            return;
        }
        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("CatId", form.CatId);
            formData.append("SliderName", form.SliderName);
            formData.append("Upload_SliderImage", form.Upload_SliderImage);
            const res = await axios.post(`${API_URL}/api/addSlider`, formData, {
                headers: {
                    "X-Auth-Token": token
                }
            });
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
                        <h4 className="text-capitalize breadcrumb-title">Slider</h4>
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
                                        Add Slider
                                    </li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            <div className="form-element">
                <div className="row">
                    <form onSubmit={handleSubmit}>
                        <div className="col-lg-6">
                            <div className="card card-Vertical card-default card-md mb-4">
                                <div className="card-header">
                                    <h6>Add Slider</h6>
                                </div>
                                <div className="card-body pb-md-30">
                                    <div className="Vertical-form">
                                        <div className="form-group">
                                            <label htmlFor="formGroupExampleInput" className="color-dark fs-14 fw-500 align-center mb-10">
                                                Choose Slider Category:
                                            </label>
                                            <select onChange={handleChange} className="form-control ih-medium ip-gray radius-xs b-light px-15" name="CatId" >
                                                <option value="">Select</option>
                                                {categories.map((c) => (
                                                    <option value={c.id}>{c.categoryName}</option>
                                                ))};
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="formGroupExampleInput" className="color-dark fs-14 fw-500 align-center mb-10" >
                                                Slider Name
                                            </label>
                                            <input type="text" onChange={handleChange} id="txtslider" name="SliderName" className="form-control form-control-lg"
                                                placeholder="Enter Slider Name" />
                                        </div>
                                        <div className="form-group" style={{ display: "none" }}>
                                            <label
                                                htmlFor="formGroupExampleInput"
                                                className="color-dark fs-14 fw-500 align-center mb-10"
                                            >
                                                Choose Sub Category :
                                            </label>
                                            <select
                                                className="form-control ih-medium ip-gray radius-xs b-light px-15"
                                                name="subcategoryid"
                                            ></select>
                                        </div>
                                        <div className="form-group">
                                            <label
                                                htmlFor="formGroupExampleInput2" className="color-dark fs-14 fw-500 align-center mb-10"  >
                                                Image{" "}
                                            </label>
                                            <input type="file" onChange={handleChange} id="FileUpload1" name="Upload_SliderImage"
                                                className="form-control ih-medium ip-gray radius-xs b-light px-15" />
                                        </div>
                                        <div className="form-group">
                                            <button
                                                type="submit"
                                                className="btn btn-primary btn-default btn-squared px-30"
                                                value="rdomanually"
                                            >
                                                Submit
                                            </button>
                                            <br />
                                            <label id="Label3" className="text-danger" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default AddSlider