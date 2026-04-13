import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const API_URL = import.meta.env.VITE_API_URL
function ProductList() {
    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr)?.token : null;
    const [loading, setLoading] = useState(true);
    const [productlists, setProductList] = useState([]);
    const navigate = useNavigate();
    const hashFetch = useRef(false);
    useEffect(() => {
        fetchProductList();
    }, []);
    const fetchProductList = async () => {
        if (hashFetch.current) return
        hashFetch.current = true;
        try {
            debugger;
            if (!token) {
                sessionStorage.clear();
                setLoading(false);
                navigate("/login", { replace: true });
                return;
            }
            const res = await axios.get(`${API_URL}/api/productList`, {
                headers: {
                    "X-Auth-Token": token
                }
            });
            debugger;
            const data = res.data;
            if (data?.status) {
                setProductList(data.data || [])
            }
        }
        catch (e) {
            console.log("Error", e);
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
            headers: {
                "X-Auth-Token": token
            }
        }).then(res => {
            console.log(res);
            setCategories(res.data.data);
        }).catch(err => {
            console.log("Category Err:" + err);
            sessionStorage.clear();
            navigate("/login")
            return;
        });
    };
    const fetchUnit = () => {
        axios.get(`${API_URL}/api/unitList`, {
            headers: {
                "X-Auth-Token": token
            }
        }).then(res => {
            console.log(res);
            setUnits(res.data.data);
        }).catch(err => {
            console.log("Unit Err:" + err);
            sessionStorage.clear();
            navigate("/login")
            return;
        });
    };
    const handleCategoryChange = (catId) => {
        setSubCategories([]);
        axios.get(`${API_URL}/api/subCategory/${catId}`, {
            headers: {
                "X-Auth-Token": token
            }
        }).then(res => {
            console.log(res);
            setSubCategories(res.data.data);
        }).catch(err => {
            console.log("SubCategory Err:", err);
            sessionStorage.clear();
            navigate("/login")
            return;
        });
    };

    const handleEdit = (id) => {
        setLoading(false);
        navigate(`/user/edit-product/${id}`);
    };
    const handleDelete = (id) => {
        setLoading(true);
        if (!window.confirm("Are you sure to delete?")) return;
        axios.delete(`${API_URL}/api/delete/product/${id}`, {
            headers: { "X-Auth-Token": token }
        }).then(res => {
            if (res.data.status) {
                fetchProductList();
                alert(res.data.message);
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
                            <div className="userDatatable adv-table-table global-shadow border-light-0 w-100 adv-table">
                                <div className="table-responsive">
                                    <div className="adv-table-table__header">
                                        <h4>Product List</h4>
                                    </div>
                                    <table className="table mb-0 table-bordered datatable1" style={{ width: "100%" }} >
                                        <thead>
                                            <tr className="userDatatable-header">
                                                <th>Sl.No</th>
                                                <th>Category Name</th>
                                                <th>SubCategory Name</th>
                                                <th>Product Name</th>
                                                <th>Hsn/Sku Code</th>
                                                <th>Product Code</th>
                                                <th>Quantity</th>
                                                <th>No Of Item</th>
                                                <th>Mrp Price</th>
                                                <th>Gst Per(%)</th>
                                                <th>Gst Amount</th>
                                                <th>Amount With Gst</th>
                                                <th>Selling Price</th>
                                                <th>Discount(%)</th>
                                                <th>Discount Amount</th>
                                                <th>Product Image</th>
                                                <th>Status</th>
                                                <th>Create Date</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productlists.length > 0 ? (productlists.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{item.categoryName}</td>
                                                    <td>{item.subCategoryName}</td>
                                                    <td>{item.productName}</td>
                                                    <td>{item.hsnSkuCode}</td>
                                                    <td>{item.productCode}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.noOfItem}</td>
                                                    <td>{item.mrpPrice}</td>
                                                    <td>{item.gstPer}</td>
                                                    <td>{item.gstAmont}</td>
                                                    <td>{item.amountWithGst}</td>
                                                    <td>{item.sellingPrice}</td>
                                                    <td>{item.discount}</td>
                                                    <td>{item.discountAmount}</td>
                                                    <td><img src={item.productImage} alt="Image" width="50"></img></td>
                                                    <td>{item.status === "1" ? "Active" : "Inactive"}</td>
                                                    <td>{item.createDate}</td>
                                                    <td>
                                                        <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(item.id)}>
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
            </div >
        </div >

    )
}

export default ProductList