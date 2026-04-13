using BusinessEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace IContract
{
    public interface IBusinessAccess
    {
        Task<ModDashboard> DashboardDetails();
        Task<List<ModCategory>> getallcategory();
        Task<List<ModSubCategory>> getallsubcategory();
        Task<List<ModProduct>> getallProduct(string sellerid);
        Task<List<ModSlider>> getSlider();
        Task<List<ModUnit>> getUnit();
        Task<ModUser> getUserDetails(string id);
    }
}
