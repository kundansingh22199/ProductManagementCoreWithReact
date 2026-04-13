import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL
function PendingOrder() {
    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr).token : null;
    const [loading, setLoading] = useState(true);
    const [pendingorders, setPendingOrders] = useState([]);
    const navigate = useNavigate();
    const hashFetch = useRef(false);
    useEffect(() => {
        if (hashFetch.current) return;
        hashFetch.current = true;
        const fetchOrder = async () => {
            axios.get(`${API_URL}/api/orderList/Pending`, {
                headers: {
                    "X-Auth-Token": token
                }
            }).then(res => {
                console.log(res);
                setPendingOrders(res.data.data);
            }).catch(err => {
                console.log("Category Err:" + err);
                if (err.response && err.response.status === 401) {
                    sessionStorage.clear();
                    navigate("/login");
                }
                else {
                    alert(err.response?.data?.message || "Something went wrong");
                }
            }).finally(() => {
                setLoading(false);
            })
        }
        fetchOrder();
    }, []);
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }
    let srNo = 1;
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12 mb-30">
                    <div className="card mt-30">
                        <div className="card-body">
                            <div className="userDatatable adv-table-table global-shadow border-light-0 w-100 adv-table">
                                <div className="table-responsive">
                                    <div className="adv-table-table__header d-flex justify-content-between align-items-center">
                                        <h4>Pending Order List</h4>
                                        <div className="adv-table-table__button">
                                            <div className="dropdown">
                                                <a className="btn btn-primary dropdown-toggle dm-select" href="#" role="button"
                                                    id="dropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                    Export
                                                </a>
                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuLink" >
                                                    <a className="dropdown-item" href="#">
                                                        Copy
                                                    </a>
                                                    <a className="dropdown-item" href="#">
                                                        CSV
                                                    </a>
                                                    <a className="dropdown-item" href="#">
                                                        Print
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="filter-form-container" className="mb-3" />
                                    
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>#No</th>
                                                <th>Order ID</th>
                                                <th>Full Name</th>
                                                <th>Mobile No</th>
                                                <th>Total Item</th>
                                                <th>Total Amount</th>
                                                <th>Order Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingorders.length > 0 && pendingorders.map((e) => (
                                                <tr>
                                                    <td>{srNo++}</td>
                                                    <td>{e.orderId}</td>
                                                    <td>{e.fullName}</td>
                                                    <td>{e.mobileNo}</td>
                                                    <td>{e.noOfItem}</td>
                                                    <td>{e.totalAmount}</td>
                                                    <td>{e.orderStatus}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-primary" onClick={() => handleView(e.orderId)}>
                                                            View Details
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default PendingOrder