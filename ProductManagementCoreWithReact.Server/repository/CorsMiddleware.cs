using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace ProductManagementCoreWithReact.Server.repository
{
    public class CorsMiddleware
    {
        private readonly RequestDelegate _next;

        public CorsMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            var origin = context.Request.Headers["Origin"].ToString();

            if (!string.IsNullOrEmpty(origin) &&
                (origin.Contains("localhost:5173") || origin.Contains("apivegfresh.com")))
            {
                context.Response.Headers["Access-Control-Allow-Origin"] = origin;
            }

            context.Response.Headers["Access-Control-Allow-Headers"] = "*";

            context.Response.Headers["Access-Control-Allow-Methods"] =
                "GET, POST, PUT, DELETE, OPTIONS";

            context.Response.Headers["Access-Control-Allow-Credentials"] = "true";

            if (context.Request.Method == "OPTIONS")
            {
                context.Response.StatusCode = 200;
                return;
            }

            await _next(context);
        }
    }
}