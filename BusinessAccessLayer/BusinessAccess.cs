using BusinessEntity;
using IContract;
using System.Data;

namespace BusinessAccessLayer
{
    public class BusinessAccess : IBusinessAccess
    {
        private readonly IDataAccess _dataAccess;
        public BusinessAccess(IDataAccess dataAccess)
        {
            _dataAccess = dataAccess;
        }

        public async Task<ModDashboard> DashboardDetails()
        {
            ModDashboard obj = new ModDashboard();
            DataTable dt = new DataTable();
            dt = await _dataAccess.GetDashboard();
            if (dt != null && dt.Rows.Count > 0)
            {
                obj.totalcustomer = Convert.ToString(dt.Rows[0]["totalcustomer"]);
                obj.todaycustomer = Convert.ToString(dt.Rows[0]["todaycustomer"]);
                obj.totalorder = Convert.ToString(dt.Rows[0]["totalorder"]);
                obj.todayorder = Convert.ToString(dt.Rows[0]["todayorder"]);
                obj.totalproduct = Convert.ToString(dt.Rows[0]["totalproduct"]);
                obj.todayproduct = Convert.ToString(dt.Rows[0]["todayproduct"]);
                obj.totalsale = Convert.ToString(dt.Rows[0]["totalsale"]);
                obj.todaysale = Convert.ToString(dt.Rows[0]["todaysale"]);
                obj.totaltransaction = Convert.ToString(dt.Rows[0]["totaltransaction"]);
                obj.todaytransaction = Convert.ToString(dt.Rows[0]["todaytransaction"]);
            }
            return obj;
        }

        public async Task<List<ModCategory>> getallcategory()
        {
            List<ModCategory> lst = new List<ModCategory>();
            DataTable dt = new DataTable();
            dt = await _dataAccess.GetReport("", "", "", "", "category");
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    lst.Add(new ModCategory
                    {
                        Id = Convert.ToString(dr["Id"]),
                        CategoryImage = !string.IsNullOrEmpty(Convert.ToString(dr["CategoryImage"]))
                        ? _dataAccess.GetDomain() + "/CategoryImage/" + Convert.ToString(dr["CategoryImage"]) : "",
                        CategoryName = Convert.ToString(dr["CategoryName"]),
                        Status = Convert.ToString(dr["Status"]),
                        CreateDate = Convert.ToDateTime(dr["CreateDate"]).ToString("dd MMM yyyy")
                    });
                }
            }
            return lst;
        }

        public async Task<List<ModSubCategory>> getallsubcategory()
        {
            List<ModSubCategory> lst = new List<ModSubCategory>();
            DataTable dt = new DataTable();
            dt = await _dataAccess.GetReport("", "", "", "", "subcategory");
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    lst.Add(new ModSubCategory
                    {
                        Id = Convert.ToString(dr["Id"]),
                        SubCategoryImage = !string.IsNullOrEmpty(Convert.ToString(dr["SubCategoryImage"]))
                        ? _dataAccess.GetDomain() + "/SubCategoryImage/" + Convert.ToString(dr["SubCategoryImage"]) : "",
                        SubCategoryName = Convert.ToString(dr["SubCategoryName"]),
                        CatId = Convert.ToString(dr["CatId"]),
                        CategoryName = Convert.ToString(dr["CategoryName"]),
                        Status = Convert.ToString(dr["Status"]),
                        CreateDate = Convert.ToDateTime(dr["CreateDate"]).ToString("dd MMM yyyy")
                    });
                }
            }
            return lst;
        }

        public async Task<List<ModProduct>> getallProduct(string sellerid)
        {
            List<ModProduct> lst = new List<ModProduct>();
            DataTable dt = new DataTable();
            dt = await _dataAccess.GetReport("", "", sellerid, "", "product");
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    lst.Add(new ModProduct
                    {
                        Id = Convert.ToString(dr["Id"]),
                        CatId = Convert.ToString(dr["CatId"]),
                        SubCatId = Convert.ToString(dr["SubCatId"]),
                        UnitId = Convert.ToString(dr["UnitId"]),
                        Unit = Convert.ToString(dr["Unit"]),
                        Quantity = Convert.ToString(dr["Quantity"]),
                        NoOfItem = Convert.ToString(dr["NoOfItem"]),
                        ProductImage = !string.IsNullOrEmpty(Convert.ToString(dr["ProductImage"]))
                        ? _dataAccess.GetDomain() + "/ProductImage/" + Convert.ToString(dr["ProductImage"]) : "",
                        ProductName = Convert.ToString(dr["ProductName"]),
                        CategoryName = Convert.ToString(dr["CategoryName"]),
                        SubCategoryName = Convert.ToString(dr["SubCategoryName"]),
                        Description = Convert.ToString(dr["Description"]),
                        ProductPrice = Convert.ToString(dr["ProductPrice"]),
                        MrpPrice = Convert.ToString(dr["MrpPrice"]),
                        SellingPrice = Convert.ToString(dr["SellingPrice"]),
                        Discount = Convert.ToString(dr["Discount"]),
                        Status = Convert.ToString(dr["Status"]),
                        HsnSkuCode = Convert.ToString(dr["HsnSkuCode"]),
                        ProductCode = Convert.ToString(dr["ProductCode"]),
                        GstType = Convert.ToString(dr["GstType"]),
                        GstAmont = Convert.ToString(dr["GstAmont"]),
                        GstPer = Convert.ToString(dr["GstPer"]),
                        AmountWithGst = Convert.ToString(dr["AmountWithGst"]),
                        DiscountAmount = Convert.ToString(dr["DiscountAmount"]),
                        CreateDate = Convert.ToDateTime(dr["CreateDate"]).ToString("dd MMM yyyy")
                    });
                }
            }
            return lst;
        }

        public async Task<List<ModSlider>> getSlider()
        {
            List<ModSlider> lst = new List<ModSlider>();
            DataTable dt = new DataTable();
            dt = await _dataAccess.GetReport("", "", "", "", "slider");
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    lst.Add(new ModSlider
                    {
                        Id = Convert.ToString(dr["Id"]),
                        CatId = Convert.ToString(dr["CatId"]),
                        SliderImage = !string.IsNullOrEmpty(Convert.ToString(dr["SliderImage"]))
                        ? _dataAccess.GetDomain() + "/SliderImage/" + Convert.ToString(dr["SliderImage"]) : "",
                        SliderName = Convert.ToString(dr["SliderName"]),
                        CategoryName = Convert.ToString(dr["CategoryName"]),
                        Status = Convert.ToString(dr["Status"]),
                        CreateDate = Convert.ToDateTime(dr["CreateDate"]).ToString("dd MMM yyyy")
                    });
                }
            }
            return lst;
        }

        public async Task<List<ModUnit>> getUnit()
        {
            List<ModUnit> lst = new List<ModUnit>();
            DataTable dt = new DataTable();
            dt = await _dataAccess.GetReport("", "", "", "", "unit");
            if (dt != null && dt.Rows.Count > 0)
            {
                foreach (DataRow dr in dt.Rows)
                {
                    lst.Add(new ModUnit
                    {
                        Id = Convert.ToString(dr["Id"]),
                        UnitName = Convert.ToString(dr["UnitName"]),
                        Unit = Convert.ToString(dr["Unit"]),
                        Status = Convert.ToString(dr["Status"]),
                        CreateDate = Convert.ToDateTime(dr["CreateDate"]).ToString("dd MMM yyyy")
                    });
                }
            }
            return lst;
        }

        public async Task<ModUser> getUserDetails(string id)
        {
            ModUser obj = new ModUser();
            DataTable dt = new DataTable();
            dt = await _dataAccess.GetReport(id, "", "", "", "admin"); ;
            if (dt != null && dt.Rows.Count > 0)
            {
                obj.Regno = Convert.ToString(dt.Rows[0]["Regno"]);
                obj.Name = Convert.ToString(dt.Rows[0]["Name"]);
                obj.Mobile = Convert.ToString(dt.Rows[0]["Mobile"]);
                obj.Dob = Convert.ToDateTime(dt.Rows[0]["Dob"]).ToString("yyyy-MM-dd");
                obj.Country = Convert.ToString(dt.Rows[0]["Country"]);
                obj.State = Convert.ToString(dt.Rows[0]["State"]);
                obj.City = Convert.ToString(dt.Rows[0]["City"]);
                obj.Address = Convert.ToString(dt.Rows[0]["Address"]);
                obj.pincode = Convert.ToString(dt.Rows[0]["pincode"]);
                obj.User_Type = Convert.ToString(dt.Rows[0]["User_Type"]);
                obj.Email = Convert.ToString(dt.Rows[0]["Email"]);
                obj.Status = Convert.ToString(dt.Rows[0]["Status"]);
                obj.password = Convert.ToString(dt.Rows[0]["password"]);
                var userImage = Convert.ToString(dt.Rows[0]["UserImage"]);
                obj.UserImage = !string.IsNullOrEmpty(userImage)
                ? _dataAccess.GetDomain() + "/UploadUserImage/" + userImage
                : _dataAccess.GetDomain() + "/UploadUserImage/user.png";
                //obj.UserImage = Convert.ToString(dt.Rows[0]["UserImage"]);
                obj.Create_date = Convert.ToString(dt.Rows[0]["Create_date"]);
                obj.ActiveDate = Convert.ToString(dt.Rows[0]["ActiveDate"]);
            }
            return obj;
        }
    }
}
