using BusinessEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IContract
{
    public interface IDataAccess
    {
        Task<DataTable> CheckLogin(ModLogin obj);
        Task<DataTable> GetDashboard();
        Task<bool> CheckExists(string name, string action, string id);
        Task<bool> AddCategoryImage(ModCategory obj);
        Task<bool> AddSubCategoryImage(ModSubCategory obj);
        Task<DataTable> GetReport(string id, string id2, string sellerId, string name, string action);
        Task<bool> AddProductImage(ModProduct obj);
        Task<bool> AddSliderImage(ModSlider obj);
        Task<bool> AddUnit(ModUnit obj);
        Task<bool> DeleteSingleData(string id, string action);
        Task<bool> UpdateProfile(ModUser obj);
        Task<DataTable> GetOrderList();
        Task<bool> AcceptRejectOrder(string orderId, string OrderStatus);
        string GetDomain();
    }
}
