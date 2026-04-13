using BusinessEntity;
using IContract;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProductManagementCoreWithReact.Server.repository;
using System.Data;

namespace ProductManagementCoreWithReact.Server.Controllers
{
    [Route("api")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IDataAccess _dataAccess;
        private readonly IBusinessAccess _businessAccess;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public UserController(IDataAccess dataAccess, IBusinessAccess businessAccess, IWebHostEnvironment webHostEnvironment)
        {
            _dataAccess = dataAccess;
            _businessAccess = businessAccess;
            _webHostEnvironment = webHostEnvironment;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] ModLogin obj)
        {
            try
            {
                if (string.IsNullOrEmpty(obj.userid) || string.IsNullOrEmpty(obj.password))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "All fields are required."
                    });
                }

                DataTable dt = await _dataAccess.CheckLogin(obj);

                if (dt != null && dt.Rows.Count > 0)
                {
                    string userId = Convert.ToString(dt.Rows[0]["regno"]);
                    string name = Convert.ToString(dt.Rows[0]["name"]);
                    string userType = Convert.ToString(dt.Rows[0]["User_Type"]);
                    string userImage = Convert.ToString(dt.Rows[0]["UserImage"]);

                    string img = !string.IsNullOrEmpty(userImage)
                        ? _dataAccess.GetDomain() + "/UploadUserImage/" + userImage
                        : _dataAccess.GetDomain() + "/UploadUserImage/user.png";

                    string token = TokenManager.GenerateToken(userId, name, userType, img);
                    if (!string.IsNullOrWhiteSpace(token))
                    {
                        return Ok(new
                        {
                            status = true,
                            message = "Login successful",
                            token = token
                        });
                    }
                    else
                    {
                        return StatusCode(500, new
                        {
                            status = false,
                            message = "Failed to generate token"
                        });
                    }
                    //return Ok(new
                    //{
                    //    status = true,
                    //    message = "Login successful",
                    //    data = new
                    //    {
                    //        userid = userId,
                    //        name = name,
                    //        usertype = userType,
                    //        userimg = img
                    //    }
                    //});
                }
                else
                {
                    return Unauthorized(new
                    {
                        status = false,
                        message = "Invalid User ID or Password"
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet("dashboard")]
        public async Task<IActionResult> Dashboard()
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                string userid = loginData.userid;
                string name = loginData.name;
                string userimg = loginData.userimg;
                string role = loginData.role;

                ModDashboard obj = await _businessAccess.DashboardDetails();

                if (obj != null)
                {
                    return Ok(new
                    {
                        status = true,
                        message = "Dashboard data fetched successfully",
                        data = obj
                    });
                }
                else
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "No data found"
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost("addCategory")]
        public async Task<IActionResult> AddCategory([FromForm] ModCategory obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                if (string.IsNullOrEmpty(obj.CategoryName) || obj.Upload_CategoryImage == null)
                {
                    return BadRequest(new { status = false, message = "All fields required" });
                }

                if (await _dataAccess.CheckExists(obj.CategoryName, "category", ""))
                {
                    return BadRequest(new { status = false, message = "Category already exists" });
                }

                string rootPath = _webHostEnvironment.WebRootPath;

                if (string.IsNullOrEmpty(rootPath))
                {
                    rootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                }

                string folderPath = Path.Combine(rootPath, "CategoryImage");

                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                string ext = Path.GetExtension(obj.Upload_CategoryImage.FileName);
                string fileName = Guid.NewGuid().ToString("N") + ext;
                string filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await obj.Upload_CategoryImage.CopyToAsync(stream);
                }

                obj.CategoryImage = fileName;
                obj.Action = "insert";
                obj.CreateBy = loginData.userid;
                bool result = await _dataAccess.AddCategoryImage(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "Category added successfully" : "Failed to add category"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpGet("categoryList")]
        public async Task<IActionResult> CategoryList()
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                var list = await _businessAccess.getallcategory();

                return Ok(new
                {
                    status = true,
                    data = list
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPost("categoryUpdate")]
        public async Task<IActionResult> UpdateCategory([FromForm] ModCategory obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                if (string.IsNullOrEmpty(obj.CategoryName) || string.IsNullOrEmpty(obj.Id))
                {
                    return BadRequest(new { status = false, message = "All fields required" });
                }

                if (await _dataAccess.CheckExists(obj.CategoryName, "updatecategory", obj.Id))
                {
                    return BadRequest(new { status = false, message = "Category already exists" });
                }

                string fileName = "";

                if (obj.Upload_CategoryImage != null)
                {
                    string folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "CategoryImage");
                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string ext = Path.GetExtension(obj.Upload_CategoryImage.FileName);
                    fileName = Guid.NewGuid().ToString("N") + ext;
                    string filePath = Path.Combine(folderPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await obj.Upload_CategoryImage.CopyToAsync(stream);
                    }
                }
                obj.CreateBy = loginData.userid;
                obj.CategoryImage = fileName;
                obj.Action = "update";

                bool result = await _dataAccess.AddCategoryImage(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "Category updated successfully" : "Failed to update category"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPost("addSubCategory")]
        public async Task<IActionResult> AddSubCategory([FromForm] ModSubCategory obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                if (string.IsNullOrEmpty(obj.SubCategoryName) || string.IsNullOrEmpty(obj.CatId) || obj.Upload_SubCategoryImage == null)
                {
                    return BadRequest(new { status = false, message = "All fields required" });
                }
                obj.CreateBy = loginData.userid;
                if (await _dataAccess.CheckExists(obj.SubCategoryName, "subcategory", obj.CatId))
                {
                    return BadRequest(new { status = false, message = "SubCategory already exists" });
                }

                string folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "SubCategoryImage");
                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                string ext = Path.GetExtension(obj.Upload_SubCategoryImage.FileName);
                string fileName = Guid.NewGuid().ToString("N") + ext;
                string filePath = Path.Combine(folderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await obj.Upload_SubCategoryImage.CopyToAsync(stream);
                }

                obj.SubCategoryImage = fileName;
                obj.Action = "insert";

                bool result = await _dataAccess.AddSubCategoryImage(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "SubCategory added successfully" : "Failed to add"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpGet("subCategoryList")]
        public async Task<IActionResult> SubCategoryList()
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                var list = await _businessAccess.getallsubcategory();

                return Ok(new
                {
                    status = true,
                    data = list
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPost("updateSubCategory")]
        public async Task<IActionResult> UpdateSubCategory([FromForm] ModSubCategory obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                if (string.IsNullOrEmpty(obj.SubCategoryName) || string.IsNullOrEmpty(obj.CatId) || string.IsNullOrEmpty(obj.Id))
                {
                    return BadRequest(new { status = false, message = "All fields required" });
                }

                if (await _dataAccess.CheckExists(obj.SubCategoryName, "updatesubcategory", obj.Id))
                {
                    return BadRequest(new { status = false, message = "SubCategory already exists" });
                }

                string fileName = "";

                if (obj.Upload_SubCategoryImage != null)
                {
                    string folderPath = Path.Combine(_webHostEnvironment.WebRootPath, "SubCategoryImage");
                    if (!Directory.Exists(folderPath))
                        Directory.CreateDirectory(folderPath);

                    string ext = Path.GetExtension(obj.Upload_SubCategoryImage.FileName);
                    fileName = Guid.NewGuid().ToString("N") + ext;
                    string filePath = Path.Combine(folderPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await obj.Upload_SubCategoryImage.CopyToAsync(stream);
                    }
                }

                obj.SubCategoryImage = fileName;
                obj.Action = "update";
                obj.CreateBy = loginData.userid;
                bool result = await _dataAccess.AddSubCategoryImage(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "SubCategory updated successfully" : "Failed to update"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpGet("subCategory/{catId}")]
        public async Task<IActionResult> GetSubCategories(string catId)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                var all = await _businessAccess.getallsubcategory();

                var filtered = all.Where(x => x.CatId == catId).Select(x => new
                {
                    x.Id,
                    x.SubCategoryName
                }).Distinct();

                return Ok(new { status = true, data = filtered });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPost("addUnit")]
        public async Task<IActionResult> AddUnit([FromBody] ModUnit obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                obj.CreateBy = loginData.userid;
                if (string.IsNullOrEmpty(obj.UnitName) || string.IsNullOrEmpty(obj.Unit))
                {
                    return BadRequest(new { status = false, message = "All fields required" });
                }

                obj.Action = "insert";

                bool result = await _dataAccess.AddUnit(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "Unit added successfully" : "Failed to add"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpGet("unitList")]
        public async Task<IActionResult> UnitList()
        {
            var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
            if (string.IsNullOrWhiteSpace(token))
            {
                return Unauthorized(new { status = false, message = "Token Required" });
            }
            var loginData = TokenManager.ValidateToken(token);
            if (loginData == null)
            {
                return Unauthorized(new { status = false, message = "Invalid Token" });
            }
            var list = await _businessAccess.getUnit();
            return Ok(new { status = true, data = list });
        }

        [HttpPost("updateUnit")]
        public async Task<IActionResult> UpdateUnit([FromBody] ModUnit obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                if (string.IsNullOrEmpty(obj.UnitName) || string.IsNullOrEmpty(obj.Unit))
                {
                    return BadRequest(new { status = false, message = "All fields required" });
                }

                obj.Action = "update";
                obj.CreateBy = loginData.userid;

                bool result = await _dataAccess.AddUnit(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "Unit updated successfully" : "Failed to update"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPost("addSlider")]
        public async Task<IActionResult> AddSlider([FromForm] ModSlider obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                obj.CreateBy = loginData.userid;
                if (string.IsNullOrEmpty(obj.SliderName) ||
                    string.IsNullOrEmpty(obj.CatId) ||
                    obj.Upload_SliderImage == null)
                {
                    return BadRequest(new { status = false, message = "All fields required" });
                }

                string folder = Path.Combine(_webHostEnvironment.WebRootPath, "SliderImage");
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);

                string ext = Path.GetExtension(obj.Upload_SliderImage.FileName);
                string fileName = Guid.NewGuid().ToString("N") + ext;
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await obj.Upload_SliderImage.CopyToAsync(stream);
                }

                obj.SliderImage = fileName;
                obj.Action = "insert";

                bool result = await _dataAccess.AddSliderImage(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "Slider added successfully" : "Failed to add"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpGet("sliderList")]
        public async Task<IActionResult> SliderList()
        {
            var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
            if (string.IsNullOrWhiteSpace(token))
            {
                return Unauthorized(new { status = false, message = "Token Required" });
            }
            var loginData = TokenManager.ValidateToken(token);
            if (loginData == null)
            {
                return Unauthorized(new { status = false, message = "Invalid Token" });
            }
            var list = await _businessAccess.getSlider();
            return Ok(new { status = true, data = list });
        }

        [HttpPost("updateSlider")]
        public async Task<IActionResult> UpdateSlider([FromForm] ModSlider obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                if (string.IsNullOrEmpty(obj.SliderName) || string.IsNullOrEmpty(obj.CatId))
                {
                    return BadRequest(new { status = false, message = "All fields required" });
                }

                string fileName = "";

                if (obj.Upload_SliderImage != null)
                {
                    string folder = Path.Combine(_webHostEnvironment.WebRootPath, "SliderImage");
                    if (!Directory.Exists(folder))
                        Directory.CreateDirectory(folder);

                    string ext = Path.GetExtension(obj.Upload_SliderImage.FileName);
                    fileName = Guid.NewGuid().ToString("N") + ext;
                    string filePath = Path.Combine(folder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await obj.Upload_SliderImage.CopyToAsync(stream);
                    }
                }
                obj.CreateBy = loginData.userid;
                obj.SliderImage = fileName;
                obj.Action = "update";

                bool result = await _dataAccess.AddSliderImage(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "Slider updated successfully" : "Failed to update"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPost("addProduct")]
        public async Task<IActionResult> AddProduct([FromForm] ModProduct obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                if (string.IsNullOrEmpty(obj.CatId) || string.IsNullOrEmpty(obj.UnitId) || string.IsNullOrEmpty(obj.Quantity) || string.IsNullOrEmpty(obj.ProductName) ||
                    string.IsNullOrEmpty(obj.Description) || string.IsNullOrEmpty(obj.MrpPrice) || string.IsNullOrEmpty(obj.SellingPrice) || string.IsNullOrEmpty(obj.NoOfItem))
                {
                    return BadRequest(new { status = false, message = "All fields required" });
                }

                if (obj.Upload_ProductImage == null)
                {
                    return BadRequest(new { status = false, message = "Product image required" });
                }
                obj.CreateBy = loginData.userid;
                string folder = Path.Combine(_webHostEnvironment.WebRootPath, "ProductImage");
                if (!Directory.Exists(folder))
                    Directory.CreateDirectory(folder);

                string ext = Path.GetExtension(obj.Upload_ProductImage.FileName);
                string fileName = Guid.NewGuid().ToString("N") + ext;
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await obj.Upload_ProductImage.CopyToAsync(stream);
                }

                obj.ProductImage = fileName;
                obj.Action = "insert";
                obj.CreateBy = loginData.userid;

                bool result = await _dataAccess.AddProductImage(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "Product added successfully" : "Failed to add product"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpGet("productList/{id?}")]
        public async Task<IActionResult> GetProducts(string? id = null)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                string userid = loginData.userid;
                if (string.IsNullOrEmpty(userid))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "userid is required"
                    });
                }

                var list = await _businessAccess.getallProduct(userid);

                if (!string.IsNullOrEmpty(id))
                {
                    var product = list.FirstOrDefault(x => x.Id == id);

                    if (product == null)
                    {
                        return NotFound(new
                        {
                            status = false,
                            message = "Product not found"
                        });
                    }

                    return Ok(new
                    {
                        status = true,
                        data = product
                    });
                }

                return Ok(new
                {
                    status = true,
                    data = list
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost("updateProduct")]
        public async Task<IActionResult> UpdateProduct([FromForm] ModProduct obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                if (string.IsNullOrEmpty(obj.Id) || string.IsNullOrEmpty(obj.CatId) || string.IsNullOrEmpty(obj.UnitId) || string.IsNullOrEmpty(obj.Quantity) ||
                    string.IsNullOrEmpty(obj.ProductName) || string.IsNullOrEmpty(obj.Description) || string.IsNullOrEmpty(obj.MrpPrice) || string.IsNullOrEmpty(obj.SellingPrice))
                {
                    return BadRequest(new { status = false, message = "All fields required" });
                }

                string fileName = "";

                if (obj.Upload_ProductImage != null)
                {
                    string folder = Path.Combine(_webHostEnvironment.WebRootPath, "ProductImage");
                    if (!Directory.Exists(folder))
                        Directory.CreateDirectory(folder);

                    string ext = Path.GetExtension(obj.Upload_ProductImage.FileName);
                    fileName = Guid.NewGuid().ToString("N") + ext;

                    string filePath = Path.Combine(folder, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await obj.Upload_ProductImage.CopyToAsync(stream);
                    }
                }
                obj.CreateBy = loginData.userid;
                obj.ProductImage = fileName;
                obj.Action = "update";

                bool result = await _dataAccess.AddProductImage(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "Product updated successfully" : "Failed to update"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpDelete("delete/{type}/{id}")]
        public async Task<IActionResult> Delete(string type, string id)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                if (string.IsNullOrEmpty(id) || string.IsNullOrEmpty(type))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Type and ID are required"
                    });
                }

                bool result = await _dataAccess.DeleteSingleData(id, type);

                if (!result)
                {
                    return Ok(new
                    {
                        status = false,
                        message = $"Unable to delete {type}"
                    });
                }

                return Ok(new
                {
                    status = true,
                    message = $"{type} deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet("orderList/{status}")]
        public async Task<IActionResult> GetOrders(string status)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                DataTable dt = await _dataAccess.GetOrderList();

                if (dt == null || dt.Rows.Count == 0)
                {
                    return Ok(new { status = true, data = new List<object>() });
                }

                var filteredRows = dt.AsEnumerable().Where(row => row["OrderStatus"].ToString().ToLower() == status.ToLower());

                var result = filteredRows.GroupBy(row => new
                {
                    OrderId = row["OrderId"].ToString(),
                    TotalAmount = row["Total"].ToString(),
                    NoOfItem = row["NoOfItem"].ToString(),
                    OrderType = row["OrderType"].ToString(),
                    OrderStatus = row["OrderStatus"].ToString(),
                    PaymentType = row["PaymentType"].ToString(),
                    PaymentStatus = row["PaymentStatus"].ToString(),
                    PlateformFee = row["PlateformFee"].ToString(),
                    ShippingAmount = row["ShippingAmount"].ToString(),
                    AddressId = row["AddressId"].ToString(),
                    Name = row["Name"].ToString(),
                    Mobile = row["Mobile"].ToString(),
                    MobileNo = row["MobileNo"].ToString(),
                    FullName = row["FullName"].ToString(),
                    Country = row["Country"].ToString(),
                    State = row["State"].ToString(),
                    City = row["City"].ToString(),
                    Address = row["Address"].ToString(),
                    PinCode = row["PinCode"].ToString(),
                    Flat_House_Building = row["Flat_House_Building"].ToString(),
                    CreateBy = row["CreateBy"].ToString(),
                    TxnNo = row["TxnNo"].ToString()
                }).Select(g => new
                {
                    g.Key.OrderId,
                    g.Key.TotalAmount,
                    g.Key.NoOfItem,
                    g.Key.OrderType,
                    g.Key.OrderStatus,
                    g.Key.PaymentType,
                    g.Key.PaymentStatus,
                    g.Key.PlateformFee,
                    g.Key.ShippingAmount,
                    g.Key.TxnNo,
                    g.Key.AddressId,
                    g.Key.Name,
                    g.Key.Mobile,
                    g.Key.MobileNo,
                    g.Key.FullName,
                    g.Key.Country,
                    g.Key.State,
                    g.Key.City,
                    g.Key.Address,
                    g.Key.PinCode,
                    g.Key.Flat_House_Building,
                    g.Key.CreateBy,
                    ProductDetails = g.Select(row => new
                    {
                        Id = row["Id"].ToString(),
                        ProductId = row["ProductId"].ToString(),
                        ProductCode = row["ProductCode"].ToString(),
                        ProductName = row["ProductName"].ToString(),
                        ProductImage = row["ProductImage"].ToString(),
                        ProductQty = row["ProductQty"].ToString(),
                        Quantity = row["Quantity"].ToString(),
                        Unit = row["Unit"].ToString(),
                        MrpPrice = row["MrpPrice"].ToString(),
                        GstPer = row["GstPer"].ToString(),
                        GstAmont = row["GstAmont"].ToString(),
                        DiscountAmount = row["DiscountAmount"].ToString(),
                        AmountWithGst = row["AmountWithGst"].ToString(),
                        SellingPrice = row["SellingPrice"].ToString(),
                        TotalAmount = row["TotalAmount"].ToString()
                    }).ToList()
                }).ToList();

                return Ok(new { status = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpGet("orderDetails/{orderId}")]
        public async Task<IActionResult> GetOrderDetails(string orderId)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                if (string.IsNullOrEmpty(orderId))
                    return BadRequest(new { status = false, message = "OrderId required" });

                DataTable dt = await _dataAccess.GetOrderList();

                var filteredRows = dt.AsEnumerable()
                    .Where(row => row["OrderId"].ToString() == orderId);

                if (!filteredRows.Any())
                    return NotFound(new { status = false, message = "Order not found" });

                var result = filteredRows
                    .GroupBy(row => new
                    {
                        Invoice = row["InvoiceNo"].ToString(),
                        OrderId = row["OrderId"].ToString(),
                        TotalAmount = row["Total"].ToString(),
                        PaymentType = row["PaymentType"].ToString(),
                        PaymentStatus = row["PaymentStatus"].ToString()
                    })
                    .Select(g => new
                    {
                        g.Key,
                        TotalDiscount = g.Sum(row =>
                            decimal.TryParse(row["DiscountAmount"].ToString(), out var val) ? val : 0),
                        ProductDetails = g.Select(row => new
                        {
                            ProductName = row["ProductName"].ToString(),
                            Quantity = row["Quantity"].ToString(),
                            SellingPrice = row["SellingPrice"].ToString()
                        }).ToList()
                    }).FirstOrDefault();

                return Ok(new { status = true, data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPost("orderAccept/{orderId}")]
        public async Task<IActionResult> AcceptOrder(string orderId)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                bool result = await _dataAccess.AcceptRejectOrder(orderId, "Confirm");

                return Ok(new
                {
                    status = result,
                    message = result ? "Order Accepted" : "Failed"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpPost("orderReject/{orderId}")]
        public async Task<IActionResult> RejectOrder(string orderId)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                bool result = await _dataAccess.AcceptRejectOrder(orderId, "Reject");

                return Ok(new
                {
                    status = result,
                    message = result ? "Order Rejected" : "Failed"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { status = false, message = ex.Message });
            }
        }

        [HttpGet("getProfile")]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                string userid = loginData.userid;
                if (string.IsNullOrEmpty(userid))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "UserId is required"
                    });
                }

                var user = await _businessAccess.getUserDetails(userid);

                if (user == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "User not found"
                    });
                }

                return Ok(new
                {
                    status = true,
                    data = user
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost("updateProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] ModUser obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                obj.Regno = loginData.userid;
                if (string.IsNullOrEmpty(obj.Regno))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "UserId required"
                    });
                }

                obj.Action = "updateprofile";

                bool result = await _dataAccess.UpdateProfile(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "Profile Updated Successfully" : "Profile Update Failed"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }

        [HttpPost("updatePassword")]
        public async Task<IActionResult> UpdatePassword([FromBody] ModUser obj)
        {
            try
            {
                var token = Request.Headers["X-Auth-Token"].FirstOrDefault();
                if (string.IsNullOrWhiteSpace(token))
                {
                    return Unauthorized(new { status = false, message = "Token Required" });
                }
                var loginData = TokenManager.ValidateToken(token);
                if (loginData == null)
                {
                    return Unauthorized(new { status = false, message = "Invalid Token" });
                }
                obj.Regno = loginData.userid;
                if (string.IsNullOrEmpty(obj.Regno))
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "UserId required"
                    });
                }

                var existingUser = await _businessAccess.getUserDetails(obj.Regno);

                if (existingUser == null)
                {
                    return NotFound(new
                    {
                        status = false,
                        message = "User not found"
                    });
                }

                if (existingUser.password != obj.OldPassword)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Invalid old password"
                    });
                }

                if (string.IsNullOrWhiteSpace(obj.password) || obj.password.Length < 6)
                {
                    return BadRequest(new
                    {
                        status = false,
                        message = "Password must be at least 6 characters"
                    });
                }

                obj.Action = "updatepassword";

                bool result = await _dataAccess.UpdateProfile(obj);

                return Ok(new
                {
                    status = result,
                    message = result ? "Password updated successfully" : "Failed to update password"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }
    }
}
