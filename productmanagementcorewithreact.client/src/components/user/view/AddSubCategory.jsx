import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
const API_URL = import.meta.env.VITE_API_URL
function AddSubCategory() {
    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr)?.token : null;
    const [loading, setLoading] = useState(true);
    const hasFetched = useRef(false);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        SubCategoryName: "",
        CatId: "",
        Upload_SubCategoryImage: null
    });
    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;
        const fetchCategory = async () => {
            if (!token) {
                navigate("/login");
                return;
            }
            const res = await fetch(`${API_URL}/api/categoryList`, {
                method: "GET",
                headers: {
                    "X-Auth-Token": token
                }
            });
            if (res.status === 401) {
                sessionStorage.clear();
                setLoading(false)
                navigate("/login", { replace: true });
                return;
            }
            if (res.status) {
                const data = await res.json();
                if (data?.status) {
                    setCategories(data.data);
                }
                setLoading(false)
            }

        };
        fetchCategory();
    }, []);
    const handleChange = (e) => {

        const { name, value, files } = e.target;
        debugger;
        if (name === "Upload_SubCategoryImage") {
            setForm({ ...form, Upload_SubCategoryImage: files[0] })
        }
        else {
            setForm({ ...form, [name]: value });
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.SubCategoryName || !form.CatId) {
            alert("All fields required");
            return;
        }

        const formData = new FormData();
        formData.append("SubCategoryName", form.SubCategoryName);
        formData.append("CatId", form.CatId);
        formData.append("Upload_SubCategoryImage", form.Upload_SubCategoryImage);
        debugger;
        try {
            const res = await fetch(`${API_URL}/api/addSubCategory`, {
                method: "POST",
                headers: {
                    "X-Auth-Token": token
                },
                body: formData
            });
            debugger;
            if (res.status === 401) {
                sessionStorage.clear();
                setLoading(false)
                navigate("/login", { replace: true });
                return;
            }
            const data = await res.json();

            if (data?.status) {
                alert(data?.message);
            } else {
                alert(data?.message);
            }
        }
        catch (err) {
            console.error(err);
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
                        <h4 className="text-capitalize breadcrumb-title">SubCategory</h4>
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
                                        Add SubCategory
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
                                <h6>Add SubCategory</h6>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="">
                                        <div className="form-basic">
                                            <div className="form-group">
                                                <label htmlFor="formGroupExampleInput" className="color-dark fs-14 fw-500 align-center mb-10" >
                                                    Choose Category :
                                                </label>
                                                <select onChange={handleChange} className="form-control ih-medium ip-gray radius-xs b-light px-15" name="CatId" >
                                                    <option value="">Select</option>
                                                    {categories.map((c) => (
                                                        <option key={c.id} value={c.id}>
                                                            {c.categoryName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group mb-25" id="category">
                                                <label>SubCategory Name</label>
                                                <input type="text" onChange={handleChange} id="txtcategory" name="SubCategoryName"
                                                    className="form-control form-control-lg" placeholder="Enter SubCategory Name" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="formGroupExampleInput2" className="color-dark fs-14 fw-500 align-center mb-10" >
                                                    Image
                                                </label>
                                                <input type="file" onChange={handleChange} name="Upload_SubCategoryImage" className="form-control" />
                                            </div>
                                            <div className="form-group mb-0">
                                                <button
                                                    type="submit"
                                                    className="btn btn-lg btn-primary btn-submit"
                                                    value="rdomanually"
                                                >
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

export default AddSubCategory