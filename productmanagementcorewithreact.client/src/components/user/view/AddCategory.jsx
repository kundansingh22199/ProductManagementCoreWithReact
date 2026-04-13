import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from '../../../Api/Api';

export default function AddCategory() {
    const navigate = useNavigate();

    const [categoryName, setCategoryName] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!categoryName || !file) {
            alert("All fields required");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("CategoryName", categoryName);
        formData.append("Upload_CategoryImage", file);

        const res = await api("/api/addCategory", navigate, {
            method: "POST",
            body: formData
        });

        setLoading(false);

        if (res?.status) {
            alert(res.message);
            setCategoryName("");
            setFile(null);
        } else {
            alert(res?.message || "Failed to add category");
        }
    };

    return (

        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                    <div className="breadcrumb-main">
                        <h4 className="text-capitalize breadcrumb-title">Category</h4>
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
                                        Add Category
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
                                <h6>Add Category</h6>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="card-body">
                                    <div className="">
                                        <div className="form-basic">
                                            <div className="form-group mb-25" id="category">
                                                <label>Category Name</label>
                                                <input
                                                    type="text"
                                                    value={categoryName}
                                                    onChange={(e) => setCategoryName(e.target.value)}
                                                    placeholder="Category Name"
                                                    className="form-control form-control-lg"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label
                                                    htmlFor="formGroupExampleInput2"
                                                    className="color-dark fs-14 fw-500 align-center mb-10"
                                                >
                                                    Image
                                                </label>
                                                <input
                                                    type="file"
                                                    onChange={(e) => setFile(e.target.files[0])}
                                                    className="form-control"
                                                />
                                            </div>
                                            <div className="form-group mb-0">
                                                <button type="submit" className="btn btn-lg btn-primary btn-submit">
                                                    {loading ? "Saving..." : "Save"}
                                                </button>
                                                <br />
                                                <label id="errorLbl" className="text-danger"></label>
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
    );
}