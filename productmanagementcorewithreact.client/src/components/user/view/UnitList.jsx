import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL
function UnitList() {
    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr)?.token : null;
    const [loading, setLoading] = useState(true);
    const [unitlists, setUnitLists] = useState([]);
    const hasFetch = useRef(false);
    const navigate = useNavigate();
    const [editData, setEditData] = useState({
        Id: 0, UnitName: "", Unit: "", Status: 1
    });
    const fetchUnit = async () => {
        try {
            if (!token) {
                sessionStorage.clear();
                setLoading(false);
                navigate("/login", { replace: true });
                return;
            }
            const res = await axios.get(`${API_URL}/api/unitList`, {
                headers: {
                    "X-Auth-Token": token
                }
            });
            const data = res.data;

            if (data?.status) {
                setUnitLists(data.data || []);
            }
        }
        catch (e) {
            console.error("Error:", e);

            if (e.response?.status === 401) {
                sessionStorage.clear();
                navigate("/login", { replace: true });
            }
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (hasFetch.current) return
        hasFetch.current = true;
        fetchUnit();
    }, [navigate, token]);
    const handleEdit = (item) => {
        setEditData({
            Id: item.id,
            UnitName: item.unitName,
            Unit: item.unit,
            Status: item.status
        });
        const modal = new window.bootstrap.Modal(
            document.getElementById("editUnitModal")
        );
        modal.show();
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    }
    const handleUpdate = (e) => {
        debugger
        e.preventDefault();
        axios.post(`${API_URL}/api/updateUnit`, editData, {
            headers: {
                "X-Auth-Token": token
            }
        }).then(res => {
            if (res.data.status) {
                const modalEl = document.getElementById("editUnitModal");
                const modalInstance = window.bootstrap.Modal.getInstance(modalEl);
                modalInstance.hide();
                alert(res.data.message);
                fetchUnit();
            }
            else {
                alert(res.data.message);
            }
        }).catch(err => {
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
        setLoading(true);
        if (!window.confirm("Are you sure to delete?")) return;
        axios.delete(`${API_URL}/api/delete/unit/${id}`,
            {
                headers: { "X-Auth-Token": token }
            }).then(res => {
                if (res.data.status) {
                    alert(res.data.message);
                    fetchUnit();
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
            });
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
                                <h4>Unit List</h4>
                            </div>
                            <div className="userDatatable adv-table-table global-shadow border-light-0 w-100 adv-table">
                                <div className="table-responsive">
                                    <table
                                        className="table mb-0 table-bordered datatable1"
                                        style={{ width: "100%" }}
                                    >
                                        <thead>
                                            <tr className="userDatatable-header">
                                                <th>Sl.No</th>
                                                <th>UnitName</th>
                                                <th>Unit</th>
                                                <th>Status</th>
                                                <th>Create Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {unitlists.length > 0 ? (unitlists.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.unitName}</td>
                                                    <td>{item.unit}</td>
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
            <div className="modal fade" id="editUnitModal" tabIndex={-1} aria-labelledby="editUnitLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <form onSubmit={handleUpdate}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editUnitLabel">
                                    Edit Category
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                            </div>
                            <div className="modal-body">
                                <input type="hidden" name="Id" onChange={handleChange} value={editData.Id} id="editId" />
                                <div className="mb-3">
                                    <label htmlFor="UnitName" className="form-label">
                                        Unit Name
                                    </label>
                                    <input type="text" name="UnitName" onChange={handleChange} value={editData.UnitName} id="editUnitName" className="form-control" required="" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="Unit" className="form-label">
                                        Unit
                                    </label>
                                    <input type="text" name="Unit" onChange={handleChange} value={editData.Unit} id="editUnit" className="form-control" required="" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="editStatus" className="form-label">
                                        Status
                                    </label>
                                    <select name="Status" onChange={handleChange} value={editData.Status} id="editStatus" className="form-control" required="" >
                                        <option value={1}>Active</option>
                                        <option value={0}>Inactive</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-success">
                                    Update
                                </button>
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
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

export default UnitList