import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

function SliderList() {
    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr)?.token : null;
    const [loading, setLoading] = useState(true);
    const [sliserlists, setSliderLists] = useState([]);
    const hashFetch = useRef(false);
    const navigate = useNavigate();
    const [categoryData, setCategoryData] = useState([]);
    const [editData, setEditData] = useState({
        Id: 0, CatId: "", SliderName: "", Upload_SliderImage: null, Status: 1
    });
    const [preview, setPreview] = useState(null);
    useEffect(() => {
        if (hashFetch.current) return
        hashFetch.current = true;
        fetchSlider();
    }, []);
    const fetchSlider = async () => {
        try {
            if (!token) {
                sessionStorage.clear();
                setLoading(false);
                navigate("/login", { replace: true })
                return;
            }
            const res = await axios.get(`${API_URL}/api/sliderList`, {
                headers: {
                    "X-Auth-Token": token
                }
            });
            debugger
            const data = res.data;
            if (data.status) {
                setSliderLists(data.data || []);
            }
        } catch (e) {
            if (e.response?.status === 401) {
                sessionStorage.clear();
                navigate("/login", { replace: true });
            }
        }
        finally {
            setLoading(false);
        }
    }
    const fetchCategory = () => {
        axios.get(`${API_URL}/api/categoryList`, {
            headers: { "X-Auth-Token": token }
        }).then(res => {
            setCategoryData(res.data.data || []);
        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setLoading(false);
        })
    };
    const handleEdit = (item) => {
        fetchCategory();
        setEditData({
            Id: item.id,
            CatId: item.catId,
            SliderName: item.sliderName,
            Status: item.status
        })
        setPreview(item.sliderImage);
        const modal = new window.bootstrap.Modal(document.getElementById("editSliderModal"));
        modal.show();
    }
    const handleChange = (e) => {
        debugger
        const { name, value, files } = e.target;
        if (name === "Upload_SliderImage") {
            const file = files[0];
            setEditData({ ...editData, Upload_SliderImage: file });

            if (file) {
                setPreview(URL.createObjectURL(file));
            }
        } else {
            setEditData({ ...editData, [name]: value });
        }
        
    }
    const handleUpdate = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("Id", editData.Id);
        formData.append("CatId", editData.CatId);
        formData.append("SliderName", editData.SliderName);
        formData.append("Status", editData.Status);
        if (editData.Upload_SliderImage) {
            formData.append("Upload_SliderImage", editData.Upload_SliderImage);
        }
        axios.post(`${API_URL}/api/updateSlider`,
            formData,
            {
                headers: { "X-Auth-Token": token }
            }
        ).then(res => {
            if (res.data.status) {
                const modalEl = document.getElementById("editSliderModal");
                const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
                modalInstance.hide();
                setLoading(false);
                alert(res.data.message);
                fetchSlider();
            } else {
                setLoading(false);
                alert(res.data.message);
            }
        }).catch(res => {
            console.log(err);
            if (err.response && err.response.status === 401) {
                sessionStorage.clear();
                navigate("/login", { replace: true });
            } else {
                alert(err.response?.data?.message || "Something went wrong");
            }
        }).finally(() => {
            setLoading(false);
        })
    }
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure to delete?")) return;
        setLoading(true);
        axios.delete(`${API_URL}/api/delete/slider/${id}`, {
            headers: { "X-Auth-Token": token }
        }).then(res => {
            if (res.data.status) {
                alert(res.data.message);
                fetchSlider();
                setLoading(false);
            }
            else {
                alert(res.data.message);
            }
        }).catch(err => {
            console.log(err);
            if (err.response && err.response.status === 401) {
                sessionStorage.clear();
                navigate("/login");
            } else {
                alert(err.response?.data?.message || "Something went wrong");
            }
        }).finally(() => {
            setLoading(false);
        })
    }
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12 mb-30">
                    <div className="card mt-30">
                        <div className="card-body">
                            <div className="adv-table-table__header">
                                <h4>Slider List</h4>
                            </div>
                            <div className="userDatatable adv-table-table global-shadow border-light-0 w-100 adv-table">
                                <div className="table-responsive">
                                    <table className="table mb-0 table-bordered datatable1" style={{ width: "100%" }}>
                                        <thead>
                                            <tr className="userDatatable-header">
                                                <th>Sl.No</th>
                                                <th>Category Name</th>
                                                <th>Slider Name</th>
                                                <th>Slider Image</th>
                                                <th>Status</th>
                                                <th>Create Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                sliserlists.length > 0 ? (
                                                    sliserlists.map((item, index) => (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{item.categoryName}</td>
                                                            <td>{item.sliderName}</td>
                                                            <td>
                                                                <img
                                                                    src={item.sliderImage || "/no-image.png"}
                                                                    width="60"
                                                                    alt="slider"
                                                                />
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
                                                    ))) : (
                                                    <tr>
                                                        <td colSpan="7" className="text-center">
                                                            No Data Found
                                                        </td>
                                                    </tr>
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="editSliderModal" tabIndex={-1} aria-labelledby="editSliderLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <form onSubmit={handleUpdate}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editSliderLabel">
                                    Edit Slider
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <input type="hidden" name="Id" value={editData.Id} id="editId" />
                                <div className="mb-3">
                                    <label htmlFor="formGroupExampleInput" className="color-dark fs-14 fw-500 align-center mb-10" >
                                        Choose Category :
                                    </label>
                                    <select className="form-control ih-medium ip-gray radius-xs b-light px-15" onChange={ handleChange} value={editData.CatId} name="CatId">
                                        <option value="">Select Category</option>
                                        {categoryData.length > 0 && categoryData.map((item, index) => (
                                            <option value={item.id}>{item.categoryName }</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="SliderName" className="form-label">
                                        Slider Name
                                    </label>
                                    <input type="text" name="SliderName" id="editSliderName" onChange={handleChange} value={editData.SliderName} className="form-control" required="" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="formGroupExampleInput2" className="color-dark fs-14 fw-500 align-center mb-10" >
                                        Image
                                    </label>
                                    <input type="file" id="FileUpload1" name="Upload_SliderImage" onChange={handleChange} className="form-control" />
                                    {preview && (
                                        <img src={preview} width="80" className="mt-2" />
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editStatus" className="form-label">
                                        Status
                                    </label>
                                    <select name="Status" id="editStatus" onChange={handleChange} value={editData.Status } className="form-control" required="" >
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

export default SliderList