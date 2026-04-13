using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEntity
{
    public class ModSlider
    {
        public string? Id { get; set; }
        public string? CatId { get; set; }
        public string? CreateBy { get; set; }
        public string? SliderName { get; set; }
        [NotMapped]
        public IFormFile? Upload_SliderImage { get; set; }
        public string? SliderImage { get; set; }
        public string? CategoryName { get; set; }
        public string? Status { get; set; }
        public string? CreateDate { get; set; }
        public string? Action { get; set; }
    }
    public class ModUnit
    {
        public string? Id { get; set; }
        public string? CatId { get; set;}
        public string? UnitName { get; set;}
        public string? Unit { get; set;}
        public string? Status { get; set; }
        public string? CreateBy { get; set; }
        public string? CreateDate { get; set; }
        public string? Action { get; set; }

    }
}
