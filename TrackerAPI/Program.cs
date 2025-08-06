using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Middleware;
using ElectricityTrackerAPI.Services;
using ElectricityTrackerAPI.Models.Core;
using Serilog;
using Serilog.Events;

// Async Main method wrapper
await MainAsync(args);

static async Task MainAsync(string[] args)
{
    var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File("logs/api-.txt", 
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 7,
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = null; // PascalCase korunur
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true; // Case insensitive
        options.JsonSerializerOptions.WriteIndented = true; // Debug için
    });

// Register services
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddScoped<IBillingService, BillingService>();
builder.Services.AddScoped<IAIService, AIService>();

// Register HttpClient for AI service
builder.Services.AddHttpClient<AIService>();

// Register background services
builder.Services.AddHostedService<BackgroundBillingService>();

// Entity Framework - PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "ElectricityTrackerAPI",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "ElectricityTrackerAPI",
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "your-secret-key-here"))
        };
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Elektrik Tüketim Takip API", 
        Version = "v1",
        Description = "Şirketlerin elektrik tüketimlerini takip etmek için API"
    });

    // JWT Authentication için Swagger konfigürasyonu
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Elektrik Tüketim Takip API v1");
        c.RoutePrefix = string.Empty; // Swagger UI'ı root'ta göster
    });
}

app.UseHttpsRedirection();

app.UseCors("AllowAll");

// Add request logging middleware - temporarily disabled
// app.UseMiddleware<RequestLoggingMiddleware>();

// Add tenant resolution middleware
app.UseTenantResolution();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Database migration'ları otomatik uygula ve test verilerini ekle
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate();
    
    // Test verilerini ekle
    await DbInitializer.Initialize(context);
    
    // Mevcut admin kullanıcısını SuperAdmin yap (migration sonrası)
    var adminUser = context.Users.FirstOrDefault(u => u.Email == "admin@demo-elektrik.com");
    if (adminUser != null && adminUser.Role != UserRole.SuperAdmin)
    {
        adminUser.Role = UserRole.SuperAdmin;
        adminUser.FirstName = "Super Admin";
        adminUser.LastName = "System";
        context.SaveChanges();
        Console.WriteLine("Admin kullanıcısı SuperAdmin olarak güncellendi.");
    }
}

    await app.RunAsync();
}
