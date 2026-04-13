using BusinessAccessLayer;
using Connection;
using DataAccessLayer;
using IContract;
using ProductManagementCoreWithReact.Server.repository;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddSingleton<ClsConnection>();
builder.Services.AddTransient<IDataAccess, DataAccess>();
builder.Services.AddScoped<IBusinessAccess, BusinessAccess>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


var app = builder.Build();

//  Serve static React (for production)
app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

//  Enable CORS
app.UseMiddleware<CorsMiddleware>();

app.UseAuthorization();

app.MapControllers();

//  React routing fallback
app.MapFallbackToFile("index.html");

app.Run();