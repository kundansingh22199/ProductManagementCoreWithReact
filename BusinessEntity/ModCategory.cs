using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEntity
{
    public class ModCategory
    {
        public string? Id { get; set; }
        public string? CategoryName { get; set; }
        [NotMapped]
        public IFormFile? Upload_CategoryImage { get; set; }
        public string? CategoryImage { get; set; }
        public string? CreateBy { get; set; }
        public string? Status { get; set; }
        public string? CreateDate { get; set; }
        public string? Action { get; set; }
    }
    public class ModSubCategory
    {
        public string? Id { get; set; }
        public string? CatId { get; set; }
        public string? CategoryName { get; set; }
        public string? SubCategoryName { get; set; }
        [NotMapped]
        public IFormFile? Upload_SubCategoryImage { get; set; }
        public string? SubCategoryImage { get; set; }
        public string? CreateBy { get; set; }
        public string? Status { get; set; }
        public string? CreateDate { get; set; }
        public string? Action { get; set; }
    }
}
