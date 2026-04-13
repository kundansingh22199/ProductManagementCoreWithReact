namespace Connection
{
    public class ClsConnection
    {
        public string GetConnectionString()
        {
            //return "Data Source=38.225.206.247; Initial Catalog=VegFresh_DB; User ID=sa; Password=MnbSoft2017!@#; pooling=true";
            return "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=VegFresh_DB;Integrated Security=True";
            //return "Data Source=(localdb)\\MyInstance;Initial Catalog=VegFresh_DB;Integrated Security=True";
        }
    }
}
