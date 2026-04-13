import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../Api/Api";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function CategoryList() {

    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr).token : null;
    const [loading, setLoading] = useState(true);
    const [categoryData, setCategoryData] = useState([]);
    const navigate = useNavigate();
    const hasFetched = useRef(false);

    const [editData, setEditData] = useState({
        id: 0, CategoryName: "", Status: 1, Upload_CategoryImage: null
    });

    const [preview, setPreview] = useState(null);

    const fetchCategory = async () => {
        setLoading(true);
        const res = await api("/api/categoryList", navigate);

        if (res?.status) {
            setCategoryData(res.data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchCategory();
    }, [navigate]);

    const handleEdit = (item) => {
        setEditData({
            id: item.id,
            CategoryName: item.categoryName,
            Status: item.status,
            Upload_CategoryImage: null
        });

        setPreview(item.categoryImage);

        const modal = new window.bootstrap.Modal(
            document.getElementById("editCategoryModal")
        );
        modal.show();
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "Upload_CategoryImage") {
            const file = files[0];
            setEditData({ ...editData, Upload_CategoryImage: file });

            if (file) {
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setEditData({ ...editData, [name]: value });
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("Id", editData.id);
            formData.append("CategoryName", editData.CategoryName);
            formData.append("Status", editData.Status);

            if (editData.Upload_CategoryImage) {
                formData.append("Upload_CategoryImage", editData.Upload_CategoryImage);
            }
            const res = await axios.post(
                `${API_URL}/api/categoryUpdate`,
                formData,
                {
                    headers: {
                        "X-Auth-Token": token
                    }
                }
            );

            if (res.data.status) {
                alert("Updated Successfully ");
                // close modal
                const modalEl = document.getElementById("editCategoryModal");
                const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
                modalInstance.hide();

                await fetchCategory();
            } else {
                alert(res.data.message);
            }

        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || "Error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete?")) return;

        try {
            const res = await axios.delete(
                `${API_URL}/api/delete/category/${id}`,
                {
                    headers: {
                        "X-Auth-Token": token
                    }
                }
            );
            if (res.data.status) {
                alert(res.data.message);
                fetchCategory();
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.log(err);
            if (err.response && err.response.status === 401) {
                sessionStorage.clear();
                navigate("/login", { replace: true });
            } else {
                alert(err.response?.data?.message || "Something went wrong");
            }
        }
    };
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12 mb-30">
                    <div className="card mt-30">
                        <div className="card-body">
                            <div className="global-shadow border-light-0 w-100">
                                <div className="table-responsive">

                                    <h4>Category List</h4>
                                    <br />

                                    <table className="table mb-0 table-bordered datatable1">
                                        <thead>
                                            <tr className="userDatatable-header">
                                                <th>Sl.No</th>
                                                <th>Category Name</th>
                                                <th>Category Image</th>
                                                <th>Status</th>
                                                <th>Create Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {categoryData.length > 0 ? (
                                                categoryData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>

                                                        <td>{item.categoryName}</td>

                                                        <td>
                                                            <img
                                                                src={item.categoryImage || "/no-image.png"}
                                                                width="50"
                                                                alt="category"
                                                            />
                                                        </td>

                                                        <td>
                                                            {item.status === "1" ? "Active" : "Inactive"}
                                                        </td>

                                                        <td>
                                                            {item.createDate}
                                                        </td>

                                                        <td>
                                                            <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(item)}>
                                                                Edit
                                                            </button>
                                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>
                                                                Delete
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="text-center">
                                                        No Data Found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>

                                    </table>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="editCategoryModal" tabIndex={-1} aria-labelledby="editCategoryLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <form onSubmit={handleUpdate}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editCategoryLabel">
                                    Edit Category
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <input type="hidden" name="Id" value={editData.id} id="editId" />
                                <div className="mb-3">
                                    <label htmlFor="CategoryName" className="form-label">
                                        Category Name
                                    </label>
                                    <input type="text" onChange={handleChange} name="CategoryName" value={editData.CategoryName} id="editCategoryName" className="form-control" required="" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="formGroupExampleInput2" className="color-dark fs-14 fw-500 align-center mb-10">
                                        Image
                                    </label>
                                    <input type="file" onChange={handleChange} id="FileUpload1" name="Upload_CategoryImage" className="form-control" />
                                    {preview && (
                                        <img src={preview} width="80" className="mb-2" />
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editStatus" className="form-label">
                                        Status
                                    </label>
                                    <select name="Status" onChange={handleChange} id="editStatus" value={editData.Status} className="form-control" required="" >
                                        <option value={1}>Active</option>
                                        <option value={0}>Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-success">
                                    Update
                                </button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default CategoryList;