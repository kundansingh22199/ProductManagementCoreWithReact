import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

function AddProduct() {
    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr).token : null;
    const [loading, setLoading] = useState(true);
    const hashFetch = useRef(false);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [form, setForm] = useState({
        CatId: "", SubCatId: "", ProductName: "", HsnSkuCode: "", ProductCode: "", UnitId: "", Quantity: "", NoOfItem: "", ProductPrice: "",
        GstType: "", GstPer: "", GstAmont: "", MrpPrice: "", AmountWithGst: "", SellingPrice: "", Discount: "", DiscountAmount: "", Description: "", Upload_ProductImage: null
    });
    useEffect(() => {
        if (hashFetch.current) return
        hashFetch.current = true;
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
        fetchCategory();
        fetchUnit();
    }, []);
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
    const handleChange = (e) => {

        const { name, value, files } = e.target;

        let updatedForm = { ...form, [name]: files ? files[0] : value };

        let price = parseFloat(updatedForm.ProductPrice) || 0;
        let gstPer = parseFloat(updatedForm.GstPer) || 0;
        let gstType = updatedForm.GstType;

        let gstAmount = 0;
        let amountWithGst = 0;

        if (price > 0 && gstPer > 0) {
            if (gstType === "0") {
                gstAmount = (price * gstPer) / (100 + gstPer);
                amountWithGst = price;
            } else {
                gstAmount = (price * gstPer) / 100;
                amountWithGst = price + gstAmount;
            }
        }

        let selling = parseFloat(updatedForm.SellingPrice) || 0;
        let discountAmount = 0;
        let discount = 0;

        if (selling > 0 && amountWithGst > 0) {
            discountAmount = amountWithGst - selling;
            discount = (discountAmount / amountWithGst) * 100;
        }

        setForm({
            ...updatedForm,
            GstAmont: gstAmount.toFixed(2),
            AmountWithGst: amountWithGst.toFixed(2),
            MrpPrice: amountWithGst.toFixed(2),
            Discount: discount.toFixed(2),
            DiscountAmount: discountAmount.toFixed(2)
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        debugger
        const formData = new FormData();
        Object.keys(form).forEach(key => {
            formData.append(key, form[key]);
        });
        axios.post(`${API_URL}/api/addProduct`, formData, {
            headers: {
                "X-Auth-Token": token
            }
        }).then(res => {
            console.log(res);
            debugger
            if (res.data.status) {
                setForm({CatId: "",SubCatId: "",ProductName: "",HsnSkuCode: "",ProductCode: "",UnitId: "",Quantity: "",NoOfItem: "",ProductPrice: "",
                    GstType: "",GstPer: "",GstAmont: "",MrpPrice: "",AmountWithGst: "",SellingPrice: "",Discount: "",DiscountAmount: "",
                    Description: null,Upload_ProductImage: null
                });

                setSubCategories([]);
                alert(res.data.message);
            } else {
                alert(res.data.message);
            }
        }).catch(err => {
            debugger
            console.log("Submit Error:", err);

            if (err.response && err.response.status === 401) {
                sessionStorage.clear();
                navigate("/login", { replace: true });
            } else {
                alert(err.response?.data?.message || "Something went wrong");
            }
        }).finally(() => {
            setLoading(false);
        });
    };
    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                    <div className="breadcrumb-main">
                        <h4 className="text-capitalize breadcrumb-title">Add Product Item</h4>
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
                                        Add Product
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
                        <div className="col-lg-12">
                            <div className="card card-Vertical card-default card-md mb-4">
                                <div className="card-header">
                                    <h6>
                                        <label id="lblheadtag" />
                                    </h6>
                                </div>
                                <div className="card-body pb-md-30">
                                    <div className="Vertical-form">
                                        <div className="row">
                                            <div className="col-lg-3">
                                                <div className="form-group">
                                                    <label htmlFor="formGroupExampleInput" className="color-dark fs-14 fw-500 align-center mb-10" >
                                                        Choose Category
                                                    </label>
                                                    <select className="form-control ih-medium ip-gray radius-xs b-light px-15" id="CatId"
                                                        onChange={(e) => { handleChange(e); handleCategoryChange(e.target.value); }} name="CatId" required="" >
                                                        <option value="">----Select Category----</option>
                                                        {categories.map((c, index) => (
                                                            <option key={index} value={c.id}>
                                                                {c.categoryName}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group">
                                                    <label className="color-dark fs-14 fw-500 align-center mb-10">
                                                        Choose SubCategory
                                                    </label>
                                                    <select id="SubCatId" onChange={handleChange} className="form-control ih-medium ip-gray radius-xs b-light px-15" name="SubCatId" >
                                                        <option value="">----Select SubCategory----</option>
                                                        {subcategories.length > 0 && subcategories.map((c) => (
                                                            <option value={c.id}>{c.subCategoryName}</option>
                                                        ))};
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="category">
                                                    <label>Product Name</label>
                                                    <input type="text" id="txtproductname" onChange={handleChange} name="ProductName" className="form-control form-control-lg"
                                                        placeholder="Enter Product Name" required="required" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="hsncode">
                                                    <label>HSN/SKU Code</label>
                                                    <input type="text" id="txthsncode" onChange={handleChange} name="HsnSkuCode" className="form-control form-control-lg"
                                                        placeholder="Enter Hsn/Sku Code" required="required" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="productcod">
                                                    <label>Product Code</label>
                                                    <input type="text" id="txtproductcode" onChange={handleChange} name="ProductCode" className="form-control form-control-lg"
                                                        placeholder="Enter Product Code" required="required" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group">
                                                    <label htmlFor="formGroupExampleInput" className="color-dark fs-14 fw-500 align-center mb-10" >
                                                        Select Unit
                                                    </label>
                                                    <select className="form-control ih-medium ip-gray radius-xs b-light px-15" onChange={handleChange} name="UnitId" required="">
                                                        <option onChange={handleChange} value="">----Select Unit----</option>
                                                        {units.map((c) => (
                                                            <option key={c.id} value={c.id}>{c.unitName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="Quantity">
                                                    <label>Quantity</label>
                                                    <input type="text" id="txtQuantity" onChange={handleChange} name="Quantity" value={form.Quantity} className="form-control form-control-lg only-numeric"
                                                        placeholder="Enter Quantity" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="NoOfItem">
                                                    <label>No Of Item</label>
                                                    <input type="text" id="txtNoOfItem" onChange={handleChange} name="NoOfItem" value={form.NoOfItem} className="form-control form-control-lg only-numeric"
                                                        placeholder="Enter Quantity" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="prodamount">
                                                    <label>Product. Price</label>
                                                    <input type="text" id="txtprodamount" onChange={handleChange} name="ProductPrice" value={form.ProductPrice} className="form-control form-control-lg only-decimal"
                                                        placeholder="Enter Product Price" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25">
                                                    <label>Select Tax Type</label>
                                                    <select onChange={handleChange} className="form-control ih-medium ip-gray radius-xs b-light px-15" name="GstType" required="" >
                                                        <option value="">----Select Tax Type----</option>
                                                        <option value={0}>Include</option>
                                                        <option value={1}>Exclude</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="gstpercentage">
                                                    <label>Gst Per</label>
                                                    <input type="text" id="txtgstper" onChange={handleChange} name="GstPer" value={form.GstPer} className="form-control form-control-lg only-decimal"
                                                        placeholder="Enter Gst Percentage" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="gstamt">
                                                    <label>Gst Amount</label>
                                                    <input type="text" id="txtgstamt" onChange={handleChange} name="GstAmont" value={form.GstAmont} className="form-control form-control-lg only-decimal"
                                                        placeholder="Enter Gst Amount" readOnly="" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="mrpamount">
                                                    <label>MRP. Price</label>
                                                    <input type="text" id="txtmrpamount" onChange={handleChange} name="MrpPrice" value={form.MrpPrice} className="form-control form-control-lg only-decimal"
                                                        placeholder="Enter Mrp Price" readOnly="" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="amtwithgst">
                                                    <label>Amount With Gst</label>
                                                    <input type="text" id="txtgstper" onChange={handleChange} name="AmountWithGst" value={form.AmountWithGst} className="form-control form-control-lg only-decimal"
                                                        placeholder="Amount With Gst" readOnly="" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="price">
                                                    <label>Selling Price</label>
                                                    <input type="text" id="txtprice" onChange={handleChange} name="SellingPrice" value={form.SellingPrice} className="form-control form-control-lg only-decimal"
                                                        placeholder="Enter Selling Price" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="dis">
                                                    <label>Discount (%)</label>
                                                    <input type="text" id="txtdis" onChange={handleChange} name="Discount" value={form.Discount} className="form-control form-control-lg"
                                                        placeholder="Enter Discount" readOnly="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group mb-25" id="disamt">
                                                    <label>Discount Amount</label>
                                                    <input type="text" id="txtdisamt" onChange={handleChange} name="DiscountAmount" value={form.DiscountAmount} className="form-control form-control-lg"
                                                        placeholder="Enter Discount Amount" readOnly="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group">
                                                    <label htmlFor="formGroupExampleInput2" className="color-dark fs-14 fw-500 align-center mb-10" >
                                                        Product Images
                                                    </label>
                                                    <input type="file" id="FileUpload1" onChange={handleChange} name="Upload_ProductImage" value={form.Uplo} className="form-control ih-medium ip-gray radius-xs b-light px-15" />
                                                </div>
                                            </div>
                                            <div className="col-lg-3">
                                                <div className="form-group">
                                                    <label htmlFor="formGroupExampleInput2" className="color-dark fs-14 fw-500 align-center mb-10" >
                                                        Product Description
                                                    </label>
                                                    <textarea name="Description" onChange={handleChange} className="form-control form-control-lg" id="txtdescription" required="" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-primary btn-default btn-squared px-30" value="rdomanually" >
                                                Submit
                                            </button>
                                            <br />
                                            <label id="Label3" className="text-danger">

                                            </label>
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

export default AddProduct