using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessEntity
{
    public class ModProduct
    {
        public string? Id {  get; set; }
        public string? CatId {  get; set; }
        public string? SubCatId {  get; set; }
        public string? UnitId {  get; set; }
        public string? Unit {  get; set; }
        public string? Quantity {  get; set; }
        public string? ProductName {  get; set; }
        [NotMapped]
        public IFormFile? Upload_ProductImage {  get; set; }
        public string? ProductImage {  get; set; }
        public string? Description {  get; set; }
        public string? ProductPrice {  get; set; }
        public string? MrpPrice {  get; set; }
        public string? SellingPrice {  get; set; }
        public string? Discount {  get; set; }
        public string? CreateBy {  get; set; }
        public string? CreateDate {  get; set; }
        public string? Status {  get; set; }
        public string? CategoryName {  get; set; }
        public string? SubCategoryName {  get; set; }
        public string? NoOfItem {  get; set; }
        public string? HsnSkuCode {  get; set; }
        public string? ProductCode {  get; set; }
        public string? GstType {  get; set; }
        public string? GstAmont {  get; set; }
        public string? GstPer {  get; set; }
        public string? AmountWithGst {  get; set; }
        public string? DiscountAmount {  get; set; }
        public string? Action {  get; set; }
    }
}