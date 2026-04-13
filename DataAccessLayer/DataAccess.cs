using BusinessEntity;
using Connection;
using IContract;
using Microsoft.AspNetCore.Http;
using System.Data;
using System.Data.SqlClient;

namespace DataAccessLayer
{
    public class DataAccess : IDataAccess
    {
        private readonly ClsConnection _con;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DataAccess(ClsConnection con, IHttpContextAccessor httpContextAccessor)
        {
            _con = con;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<DataTable> CheckLogin(ModLogin obj)
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("LoginAdmin", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Mobile", obj.userid);
                        cmd.Parameters.AddWithValue("@Password", obj.password);
                        SqlDataAdapter dr = new SqlDataAdapter(cmd);
                        dr.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            if (Convert.ToInt32(dt.Rows[0]["available"]) == 1)
                            {
                                return dt;
                            }
                            else
                            {
                                return null;
                            }
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }

        public async Task<DataTable> GetDashboard()
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("sp_getDashboard", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataAdapter dr = new SqlDataAdapter(cmd);
                        dr.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            return dt;
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }

        public async Task<bool> CheckExists(string name, string action, string id)
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("SP_CheckExists", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", id);
                        cmd.Parameters.AddWithValue("@name", name);
                        cmd.Parameters.AddWithValue("@action", action);
                        SqlDataAdapter dr = new SqlDataAdapter(cmd);
                        dr.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public async Task<bool> AddCategoryImage(ModCategory obj)
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("SP_AddCategory", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@CategoryName", obj.CategoryName);
                        cmd.Parameters.AddWithValue("@CategoryImage", obj.CategoryImage);
                        cmd.Parameters.AddWithValue("@CreateBy", obj.CreateBy);
                        cmd.Parameters.AddWithValue("@Id", obj.Id);
                        cmd.Parameters.AddWithValue("@Status", obj.Status);
                        cmd.Parameters.AddWithValue("@Action", obj.Action);
                        await connection.OpenAsync();
                        int i = await cmd.ExecuteNonQueryAsync();
                        await connection.CloseAsync();
                        if (i > 0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public async Task<bool> AddSubCategoryImage(ModSubCategory obj)
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("SP_AddSubCategory", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@CatId", obj.CatId);
                        cmd.Parameters.AddWithValue("@SubCategoryName", obj.SubCategoryName);
                        cmd.Parameters.AddWithValue("@SubCategoryImage", obj.SubCategoryImage);
                        cmd.Parameters.AddWithValue("@CreateBy", obj.CreateBy);
                        cmd.Parameters.AddWithValue("@Id", obj.Id);
                        cmd.Parameters.AddWithValue("@Status", obj.Status);
                        cmd.Parameters.AddWithValue("@Action", obj.Action);
                        await connection.OpenAsync();
                        int i = await cmd.ExecuteNonQueryAsync();
                        await connection.CloseAsync();
                        if (i > 0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public async Task<DataTable> GetReport(string id, string id2, string sellerId, string name, string action)
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("SP_GetAllReport", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", id);
                        cmd.Parameters.AddWithValue("@id2", id2);
                        cmd.Parameters.AddWithValue("@sellerId", sellerId);
                        cmd.Parameters.AddWithValue("@name", name);
                        cmd.Parameters.AddWithValue("@action", action);
                        SqlDataAdapter dr = new SqlDataAdapter(cmd);
                        dr.Fill(dt);
                        if (dt.Rows.Count > 0)
                        {
                            return dt;
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }

        public async Task<bool> AddProductImage(ModProduct obj)
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("SP_AddProduct", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@CatId", obj.CatId);
                        cmd.Parameters.AddWithValue("@SubCatId", obj.SubCatId);
                        cmd.Parameters.AddWithValue("@UnitId", obj.UnitId);
                        cmd.Parameters.AddWithValue("@Quantity", obj.Quantity);
                        cmd.Parameters.AddWithValue("@ProductName", obj.ProductName);
                        cmd.Parameters.AddWithValue("@ProductImage", obj.ProductImage);
                        cmd.Parameters.AddWithValue("@Description", obj.Description);
                        cmd.Parameters.AddWithValue("@ProductPrice", obj.ProductPrice);
                        cmd.Parameters.AddWithValue("@MrpPrice", obj.MrpPrice);
                        cmd.Parameters.AddWithValue("@SellingPrice", obj.SellingPrice);
                        cmd.Parameters.AddWithValue("@NoOfItem", obj.NoOfItem);
                        cmd.Parameters.AddWithValue("@Discount", obj.Discount);
                        cmd.Parameters.AddWithValue("@CreateBy", obj.CreateBy);
                        cmd.Parameters.AddWithValue("@Id", obj.Id);
                        cmd.Parameters.AddWithValue("@Status", obj.Status);
                        cmd.Parameters.AddWithValue("@HsnSkuCode", obj.HsnSkuCode);
                        cmd.Parameters.AddWithValue("@ProductCode", obj.ProductCode);
                        cmd.Parameters.AddWithValue("@GstType", obj.GstType);
                        cmd.Parameters.AddWithValue("@GstAmont", obj.GstAmont);
                        cmd.Parameters.AddWithValue("@GstPer", obj.GstPer);
                        cmd.Parameters.AddWithValue("@AmountWithGst", obj.AmountWithGst);
                        cmd.Parameters.AddWithValue("@DiscountAmount", obj.DiscountAmount);
                        cmd.Parameters.AddWithValue("@Action", obj.Action);
                        await connection.OpenAsync();
                        int i = await cmd.ExecuteNonQueryAsync();
                        await connection.CloseAsync();
                        if (i > 0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public async Task<bool> AddSliderImage(ModSlider obj)
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("SP_AddSlider", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@CatId", obj.CatId);
                        cmd.Parameters.AddWithValue("@SliderName", obj.SliderName);
                        cmd.Parameters.AddWithValue("@SliderImage", obj.SliderImage);
                        cmd.Parameters.AddWithValue("@CreateBy", obj.CreateBy);
                        cmd.Parameters.AddWithValue("@Id", obj.Id);
                        cmd.Parameters.AddWithValue("@Status", obj.Status);
                        cmd.Parameters.AddWithValue("@Action", obj.Action);
                        connection.OpenAsync();
                        int i = await cmd.ExecuteNonQueryAsync();
                        connection.CloseAsync();
                        if (i > 0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public async Task<bool> AddUnit(ModUnit obj)
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("SP_AddUnit", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@CatId", obj.CatId);
                        cmd.Parameters.AddWithValue("@UnitName", obj.UnitName);
                        cmd.Parameters.AddWithValue("@Unit", obj.Unit);
                        cmd.Parameters.AddWithValue("@CreateBy", obj.CreateBy);
                        cmd.Parameters.AddWithValue("@Id", obj.Id);
                        cmd.Parameters.AddWithValue("@Status", obj.Status);
                        cmd.Parameters.AddWithValue("@Action", obj.Action);
                        connection.OpenAsync();
                        int i = await cmd.ExecuteNonQueryAsync();
                        connection.CloseAsync();
                        if (i > 0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public async Task<bool> DeleteSingleData(string id, string action)
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("SP_DeleteData", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", id);
                        cmd.Parameters.AddWithValue("@action", action);
                        connection.OpenAsync();
                        int i = await cmd.ExecuteNonQueryAsync();
                        connection.CloseAsync();
                        if (i > 0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public async Task<bool> UpdateProfile(ModUser obj)
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("SP_UpdateProfile", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@Regno", obj.Regno);
                        cmd.Parameters.AddWithValue("@Name", obj.Name);
                        cmd.Parameters.AddWithValue("@Mobile", obj.Mobile);
                        cmd.Parameters.AddWithValue("@Dob", obj.Dob);
                        cmd.Parameters.AddWithValue("@Country", obj.Country);
                        cmd.Parameters.AddWithValue("@State", obj.State);
                        cmd.Parameters.AddWithValue("@City", obj.City);
                        cmd.Parameters.AddWithValue("@Address", obj.Address);
                        cmd.Parameters.AddWithValue("@pincode", obj.pincode);
                        cmd.Parameters.AddWithValue("@Email", obj.Email);
                        cmd.Parameters.AddWithValue("@password", obj.password);
                        cmd.Parameters.AddWithValue("@UserImage", obj.UserImage);
                        cmd.Parameters.AddWithValue("@Status", obj.Status);
                        cmd.Parameters.AddWithValue("@User_Type", "Admin");
                        cmd.Parameters.AddWithValue("@Action", obj.Action);
                        connection.OpenAsync();
                        int i = await cmd.ExecuteNonQueryAsync();
                        connection.CloseAsync();
                        if (i > 0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public async Task<DataTable> GetOrderList()
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("SP_AllOrderList", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        SqlDataAdapter adapter = new SqlDataAdapter(cmd);
                        adapter.Fill(dt);
                        if (dt != null && dt.Rows.Count > 0)
                        {
                            return dt;
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return null;
                }
            }
        }
        public async Task<bool> AcceptRejectOrder(string orderId, string OrderStatus)
        {
            using (var connection = new SqlConnection(_con.GetConnectionString()))
            {
                DataTable dt = new DataTable();
                try
                {
                    using (SqlCommand cmd = new SqlCommand("SP_AcceptRejectOrder", connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@orderId", orderId);
                        cmd.Parameters.AddWithValue("@OrderStatus", OrderStatus);
                        connection.OpenAsync();
                        int i = await cmd.ExecuteNonQueryAsync();
                        connection.CloseAsync();
                        if (i > 0)
                        {
                            return true;
                        }
                        else
                        {
                            return false;
                        }
                    }
                }
                catch (Exception ex)
                {
                    return false;
                }
            }
        }

        public string GetDomain()
        {
            var request = _httpContextAccessor.HttpContext?.Request;
            return request != null ? $"{request.Scheme}://{request.Host}" : string.Empty;
        }
    }
}
