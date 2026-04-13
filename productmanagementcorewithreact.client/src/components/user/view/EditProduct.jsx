import { useState,useEffect,useRef } from "react"
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;
export default function EditProduct() {
    const userStr = sessionStorage.getItem("user");
    const token = userStr ? JSON.parse(userStr).token : null;
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [productdetails, setProductDetails] = useState({});
    const navigate = useNavigate();
    const hashFetch = useRef(false);
    const [categories, setCategories] = useState([]);
    const [units, setUnits] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [form, setForm] = useState({
        Id:"",CatId: "", SubCatId: "", ProductName: "", HsnSkuCode: "", ProductCode: "", UnitId: "", Quantity: "", NoOfItem: "", ProductPrice: "",
        GstType: "", GstPer: "", GstAmont: "", MrpPrice: "", AmountWithGst: "", SellingPrice: "", Discount: "", DiscountAmount: "", Description: "", Upload_ProductImage: null
    });
    useEffect(() => {
        fetchCategory();
        fetchUnit();
        if (id) {
            productDetail(id);
        }
    },[id])
    const productDetail = (id) => {
        axios.get(`${API_URL}/api/productList/${id}`, {
            headers: { "X-Auth-Token": token }
        }).then(res => {
            const data = res.data.data;

            // Fill form state
            setForm({
                Id: data.id,
                CatId: data.catId,
                SubCatId: data.subCatId,
                ProductName: data.productName,
                HsnSkuCode: data.hsnSkuCode,
                ProductCode: data.productCode,
                UnitId: data.unitId,
                Quantity: data.quantity,
                NoOfItem: data.noOfItem,
                ProductPrice: data.productPrice,
                GstType: data.gstType,
                GstPer: data.gstPer,
                GstAmont: data.gstAmont,
                MrpPrice: data.mrpPrice,
                AmountWithGst: data.amountWithGst,
                SellingPrice: data.sellingPrice,
                Discount: data.discount,
                DiscountAmount: data.discountAmount,
                Description: data.description,
                Upload_ProductImage: null
            });

            // load subcategories
            if (data.catId) {
                handleCategoryChange(data.catId);
            }

        }).catch(err => {
            console.log("Product Err:" + err);
            sessionStorage.clear();
            navigate("/login");
        });
    };
    const fetchCategory = () => {
        axios.get(`${API_URL}/api/categoryList`, {
            headers: { "X-Auth-Token": token }
        }).then(res => {
            console.log(res);
            setCategories(res.data.data);
        }).catch(err => {
            console.log("Category Err:" + err);
            sessionStorage.clear();
            navigate("/login")
            return;
        });
    }
    const fetchUnit = () => {
        axios.get(`${API_URL}/api/unitList`, {
            headers: { "X-Auth-Token": token }
        }).then(res => {
            console.log(res);
            setUnits(res.data.data);
        }).catch(err => {
            console.log("Unit Err:" + err);
            sessionStorage.clear();
            navigate("/login")
            return;
        });
    }
    const handleCategoryChange = (catId) => {
        axios.get(`${API_URL}/api/subCategory/${catId}`, {
            headers: { "X-Auth-Token": token }
        }).then(res => {
            console.log(res);
            setSubCategories(res.data.data);
        }).catch(err => {
            console.log("SubCategory Err:", err);
            sessionStorage.clear();
            navigate("/login")
            return;
        })
    }
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
        debugger
        e.preventDefault();
        setLoading(true);
        debugger
        const formData = new FormData();
        Object.keys(form).forEach(key => {
            formData.append(key, form[key]);
        });
        axios.post(`${API_URL}/api/updateProduct`, formData, {
            headers: {
                "X-Auth-Token": token
            }
        }).then(res => {
            console.log(res);
            debugger
            if (res.data.status) {
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
    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-lg-12">
                    <div className="breadcrumb-main">
                        <h4 className="text-capitalize breadcrumb-title">Edit Product</h4>
                    </div>
                </div>
            </div>
            <div className="form-element">
                <div className="row">
                    <form onSubmit={handleSubmit }>
                        <div className="col-lg-12">
                            <div className="card card-Vertical card-default card-md mb-4">
                                <div className="card-header">
                                    <h6>Edit Product</h6>
                                </div>
                                <div className="card-body pb-md-30">
                                    <div className="Vertical-form">
                                        <div className="row">
                                            <div className="col-lg-4">
                                                <input type="hidden" name="Id" id="editId" />
                                                {/* Category */}
                                                <div className="form-group">
                                                    <label>Choose Category</label>
                                                    <select value={form.CatId || ""} onChange={(e) => {
                                                            const value = e.target.value;
                                                            setForm(prev => ({
                                                                ...prev,
                                                                CatId: value,
                                                                SubCatId: "" 
                                                            }));

                                                            handleCategoryChange(value);
                                                        }}
                                                        className="form-control"
                                                        id="CatId"
                                                        name="CatId" >
                                                        <option value="">----Select Category----</option>
                                                        {categories.length > 0 && categories.map((item, index) => (
                                                            <option value={item.id}>{item.categoryName }</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                {/* SubCategory */}
                                                <div className="form-group">
                                                    <label>Choose SubCategory</label>
                                                    <select id="SubCatId" name="SubCatId" onChange={handleChange} value={form.SubCatId} className="form-control" >
                                                        <option value="">----Select SubCategory----</option>
                                                        {subcategories.length > 0 && subcategories.map((item, index) => (
                                                            <option value={item.id}>{item.subCategoryName }</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                {/* Product Name */}
                                                <div className="form-group">
                                                    <label>Product Name</label>
                                                    <input type="text" id="txtproductname" onChange={handleChange} name="ProductName" value={form.ProductName} placeholder="Enter Product Name" className="form-control" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group mb-25" id="hsncode">
                                                    <label>HSN/SKU Code</label>
                                                    <input type="text" id="txthsncode" onChange={handleChange} name="HsnSkuCode" value={form.HsnSkuCode} className="form-control form-control-lg"
                                                        placeholder="Enter Hsn/Sku Code" required="required" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group mb-25" id="productcod">
                                                    <label>Product Code</label>
                                                    <input type="text" id="txtproductcode" onChange={handleChange} name="ProductCode" value={form.ProductCode} className="form-control form-control-lg"
                                                        placeholder="Enter Product Code" required="required" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                {/* Unit */}
                                                <div className="form-group">
                                                    <label>Select Unit</label>
                                                    <select className="form-control form-control-lg" onChange={handleChange} value={form.UnitId} id="UnitId" name="UnitId" >
                                                        <option value="">----Select Unit----</option>
                                                        {units.length > 0 && units.map((item, index) => (
                                                            <option value={item.id}>{item.unitName}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                {/* Quantity */}
                                                <div className="form-group">
                                                    <label>Quantity</label>
                                                    <input type="text" id="txtQuantity" name="Quantity" onChange={handleChange} value={form.Quantity} placeholder="Enter Quantity" className="form-control form-control-lg only-numeric" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                {/* NoOfItem */}
                                                <div className="form-group">
                                                    <label>NoOfItem</label>
                                                    <input type="text" id="txtNoOfItem" name="NoOfItem" onChange={handleChange} value={form.NoOfItem} placeholder="Enter No of Item" className="form-control form-control-lg only-numeric" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group mb-25" id="prodamount">
                                                    <label>Product Price</label>
                                                    <input type="text" id="txtprodamount" name="ProductPrice" onChange={handleChange} value={form.ProductPrice} className="form-control form-control-lg only-decimal"
                                                        placeholder="Enter Product Price" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group mb-25">
                                                    <label>Select Tax Type</label>
                                                    <select className="form-control ih-medium ip-gray radius-xs b-light px-15" onChange={handleChange} value={form.GstType} name="GstType" required="" >
                                                        <option value="">----Select Tax Type----</option>
                                                        <option value={0}>Include</option>
                                                        <option value={1}>Exclude</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group mb-25" id="gstpercentage">
                                                    <label>Gst Per</label>
                                                    <input type="text" id="txtgstper" name="GstPer" onChange={handleChange} value={form.GstPer} className="form-control form-control-lg only-decimal"
                                                        placeholder="Enter Gst Percentage" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group mb-25" id="gstamt">
                                                    <label>Gst Amount</label>
                                                    <input type="text" id="txtgstamt" name="GstAmont" onChange={handleChange} value={form.GstAmont} className="form-control form-control-lg only-decimal"
                                                        placeholder="Enter Gst Amount" readOnly="" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group mb-25" id="mrpamount">
                                                    <label>MRP. Price</label>
                                                    <input type="text" id="txtmrpamount" name="MrpPrice" onChange={handleChange} value={form.MrpPrice} className="form-control form-control-lg only-decimal"
                                                        placeholder="Enter Mrp Price" readOnly="" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group mb-25" id="amtwithgst">
                                                    <label>Amount With Gst</label>
                                                    <input type="text" id="txtgstper" name="AmountWithGst" onChange={handleChange} value={form.AmountWithGst} className="form-control form-control-lg only-decimal"
                                                        placeholder="Amount With Gst" readOnly="" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group mb-25" id="SellingPrice">
                                                    <label>Selling Price</label>
                                                    <input type="text" id="txtSellingPrice" name="SellingPrice" onChange={handleChange} value={form.SellingPrice} className="form-control form-control-lg only-decimal"
                                                        placeholder="SellingPrice" readOnly="" required="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group mb-25" id="dis">
                                                    <label>Discount (%)</label>
                                                    <input type="text" id="txtdis" name="Discount" onChange={handleChange} value={form.Discount} className="form-control form-control-lg"
                                                        placeholder="Enter Discount" readOnly="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="form-group mb-25" id="disamt">
                                                    <label>Discount Amount</label>
                                                    <input type="text" id="txtdisamt" name="DiscountAmount" onChange={handleChange} value={form.DiscountAmount} className="form-control form-control-lg"
                                                        placeholder="Enter Discount Amount" readOnly="" />
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                {/* Product Image */}
                                                <div className="form-group">
                                                    <label>Product Image</label>
                                                    <input type="file" name="Upload_ProductImage" onChange={handleChange} className="form-control" />
                                                    <div>
                                                        <img src={form.ProductImage} width={100} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-4">
                                                <div className="mb-3">
                                                    <label htmlFor="editStatus" className="form-label">
                                                        Status
                                                    </label>
                                                    <select name="Status" id="editStatus" onChange={handleChange} className="form-control form-control-lg" required="" >
                                                        <option value={1}>Active</option>
                                                        <option value={0}>Inactive</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {/* Submit */}
                                            <div className="form-group">
                                                <button type="submit" className="btn btn-primary">
                                                    Update Product
                                                </button>
                                                <br />
                                                <label className="text-danger"></label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}