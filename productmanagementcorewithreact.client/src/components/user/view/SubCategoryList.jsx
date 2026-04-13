import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function SubCategoryList() {

    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr)?.token : null;

    const [loading, setLoading] = useState(true);
    const [subcatogeries, setSubCategories] = useState([]);
    const [categoryData, setCategoryData] = useState([]);

    const navigate = useNavigate();
    const hasFetched = useRef(false);

    const [editData, setEditData] = useState({
        Id: 0, CatId: "", SubCategoryName: "", Status: 1, Upload_SubCategoryImage: null
    });

    const [preview, setPreview] = useState(null);

    // FETCH SUBCATEGORY
    const fetchSubCategory = async () => {
        try {
            const res = await fetch(`${API_URL}/api/subCategoryList`, {
                headers: { "X-Auth-Token": token }
            });

            if (res.status === 401) {
                sessionStorage.clear();
                navigate("/login", { replace: true });
                return;
            }

            const data = await res.json();
            if (data?.status) {
                setSubCategories(data.data || []);
                setLoading(false);
            }

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // FETCH CATEGORY
    const fetchCategory = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categoryList`, {
                headers: { "X-Auth-Token": token }
            });

            const data = await res.json();
            if (data?.status) {
                setCategoryData(data.data || []);
            }

        } catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        fetchSubCategory();
    }, []);

    // OPEN MODAL AFTER STATE UPDATE
    useEffect(() => {
        if (editData.Id !== 0) {
            const modal = new window.bootstrap.Modal(
                document.getElementById("editSubCategoryModal")
            );
            modal.show();
        }
    }, [editData]);

    // EDIT CLICK
    const handleEdit = async (item) => {
        await fetchCategory(); // load dropdown first

        setEditData({
            Id: item.id,
            CatId: item.catId,
            SubCategoryName: item.subCategoryName,
            Status: item.status,
            Upload_SubCategoryImage: null
        });

        setPreview(item.subCategoryImage);
    };

    // CHANGE
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (name === "Upload_SubCategoryImage") {
            const file = files[0];
            setEditData({ ...editData, Upload_SubCategoryImage: file });

            if (file) {
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setEditData({ ...editData, [name]: value });
        }
    };

    // UPDATE
    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("Id", editData.Id);
            formData.append("CatId", editData.CatId);
            formData.append("SubCategoryName", editData.SubCategoryName);
            formData.append("Status", editData.Status);

            if (editData.Upload_SubCategoryImage) {
                formData.append("Upload_SubCategoryImage", editData.Upload_SubCategoryImage);
            }

            const res = await axios.post(
                `${API_URL}/api/updateSubCategory`,
                formData,
                {
                    headers: {
                        "X-Auth-Token": token
                    }
                }
            );

            if (res.data.status) {
                // close modal
                const modalEl = document.getElementById("editSubCategoryModal");
                const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
                modalInstance.hide();
                
                // refresh list
                setLoading(false);
                alert(res.data.message);
                fetchSubCategory();
                
                
            } else {
                setLoading(false);
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

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure to delete?")) return;

        try {
            const res = await axios.delete(
                `${API_URL}/api/delete/subcategory/${id}`,
                { headers: { "X-Auth-Token": token } }
            );

            if (res.data.status) {
                alert(res.data.message);
                fetchSubCategory();
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

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12 mb-30">
                    <div className="card mt-30">
                        <div className="card-body">
                            <div className="adv-table-table global-shadow border-light-0 w-100 adv-table">
                                <div className="table-responsive">
                                    <div className="adv-table-table__header">
                                        <h4>Sub Category List</h4>
                                        <br />
                                    </div>
                                    <table
                                        className="table mb-0 table-bordered datatable1"
                                        style={{ width: "100%" }}>
                                        <thead>
                                            <tr className="userDatatable-header">
                                                <th>Sl.No</th>
                                                <th>SubCategory Name</th>
                                                <th>Category Name</th>
                                                <th>SubCategory Image</th>
                                                <th>Status</th>
                                                <th>Create Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                subcatogeries.length > 0 ? (
                                                    subcatogeries.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.subCategoryName || ""}</td>
                                                            <td>{item.categoryName || ""}</td>
                                                            <td>
                                                                <img src={item.subCategoryImage || "/no-image.png"} width="50" alt="subcategory" />
                                                            </td>
                                                            <td>{item.status === "1" ? "Active" : "Inactive"}</td>
                                                            <td>{item.createDate}</td>
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
                                                )
                                                    :
                                                    (
                                                        <tr>
                                                            <td colSpan="7" className="text-center">
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
            <div className="modal fade" id="editSubCategoryModal" tabIndex={-1}
                aria-labelledby="editSubCategoryLabel" aria-hidden="true" >
                <div className="modal-dialog">
                    <form onSubmit={handleUpdate}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editSubCategoryLabel">
                                    Edit Sub Category
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <input type="hidden" name="Id" value={editData.Id} id="editId" />
                                <div className="mb-3">
                                    <label htmlFor="formGroupExampleInput" className="color-dark fs-14 fw-500 align-center mb-10" >
                                        Choose Category :
                                    </label>
                                    <select className="form-control ih-medium ip-gray radius-xs b-light px-15" onChange={handleChange} value={editData.CatId} name="CatId">
                                        <option value="">Select</option>
                                        {categoryData.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.categoryName}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="SubCategoryName" className="form-label">
                                        Sub Category Name
                                    </label>
                                    <input type="text" name="SubCategoryName" value={editData.SubCategoryName} onChange={handleChange} id="editSubCategoryName" className="form-control" required="" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="formGroupExampleInput2" className="color-dark fs-14 fw-500 align-center mb-10" >
                                        Image
                                    </label>
                                    <input type="file" id="FileUpload1" onChange={handleChange} name="Upload_SubCategoryImage" className="form-control" />
                                    {preview && (
                                        <img src={preview} width="80" className="mt-2" />
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editStatus" className="form-label">
                                        Status
                                    </label>
                                    <select name="Status" id="editStatus" value={editData.Status} onChange={handleChange} className="form-control" required="" >
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

    )
}

export default SubCategoryList