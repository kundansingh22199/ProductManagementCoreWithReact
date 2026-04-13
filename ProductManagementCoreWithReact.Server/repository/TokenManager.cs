using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProductManagementCoreWithReact.Server.repository
{
    public static class TokenManager
    {
        private static readonly string Secret = "ERMN05OPLoDvbTTa/QkqLNMI7cPLguaRyHdgfsxaszzyg7n5qNBVjQmtBhz4SzYh4NBVCXi3KJHlSXKP+dasdaoi2+bXr6CUYTR==";
        private static readonly string Issuer = "https://localhost:7256";
        private static readonly string Audience = "http://localhost:5173";

        //public static string GenerateToken(string username)
        //{
        //    var key = Encoding.ASCII.GetBytes(Secret);
        //    var securityKey = new SymmetricSecurityKey(key);
        //    var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        //    var tokenDescriptor = new SecurityTokenDescriptor
        //    {
        //        Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, username) }),
        //        Expires = DateTime.UtcNow.AddMinutes(30),
        //        Issuer = Issuer,
        //        Audience = Audience,
        //        SigningCredentials = credentials
        //    };

        //    var tokenHandler = new JwtSecurityTokenHandler();
        //    var token = tokenHandler.CreateToken(tokenDescriptor);

        //    return tokenHandler.WriteToken(token);
        //}
        public static string GenerateToken(string userId, string name, string userType, string userImage)
        {
            var key = Encoding.ASCII.GetBytes(Secret);
            var securityKey = new SymmetricSecurityKey(key);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, name),
                new Claim("userid", userId),
                new Claim(ClaimTypes.Role, userType),
                new Claim("userimg", userImage)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(60), // ✅ Always set expiry
                Issuer = Issuer,
                Audience = Audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
        public static ClaimsPrincipal GetPrincipal(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(Secret);

                var parameters = new TokenValidationParameters
                {
                    RequireExpirationTime = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = Issuer,
                    ValidAudience = Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                };

                SecurityToken securityToken;
                var principal = tokenHandler.ValidateToken(token, parameters, out securityToken);

                return principal;
            }
            catch
            {
                return null;
            }
        }
        //public static string ValidateToken(string token)
        //{
        //    var principal = GetPrincipal(token);
        //    if (principal == null)
        //        return null;

        //    var identity = principal.Identity as ClaimsIdentity;
        //    var usernameClaim = identity?.FindFirst(ClaimTypes.Name);

        //    return usernameClaim?.Value;
        //}
        public static dynamic ValidateToken(string token)
        {
            var principal = GetPrincipal(token);
            if (principal == null)
                return null;

            var identity = principal.Identity as ClaimsIdentity;

            return new
            {
                userid = identity?.FindFirst("userid")?.Value,
                name = identity?.FindFirst(ClaimTypes.Name)?.Value,
                role = identity?.FindFirst(ClaimTypes.Role)?.Value,
                userimg = identity?.FindFirst("userimg")?.Value
            };
        }
    }
}
