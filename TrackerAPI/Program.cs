using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using System.Threading.RateLimiting;
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
builder.Services.AddControllers(options =>
{
    // Global validation filter ekle
    options.Filters.Add<ElectricityTrackerAPI.Filters.ValidationFilter>();
})
.AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = null; // PascalCase korunur
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true; // Case insensitive
    options.JsonSerializerOptions.WriteIndented = true; // Debug için
})
// Model validation hatalarını devre dışı bırak (filter'da handle ediyoruz)
.ConfigureApiBehaviorOptions(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

// Memory Cache
builder.Services.AddMemoryCache();

// Rate Limiting
builder.Services.AddRateLimiter(options =>
{
    // Global rate limiter: IP bazlı
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
    {
        var ipAddress = context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: ipAddress,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100, // 100 istek
                Window = TimeSpan.FromMinutes(1), // 1 dakikada
                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                QueueLimit = 0 // Queue kullanma
            });
    });

    // Rate limit aşıldığında response
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = 429; // Too Many Requests
        
        var response = new
        {
            Success = false,
            Message = "Çok fazla istek gönderdiniz. Lütfen bir süre bekleyin.",
            StatusCode = 429,
            Timestamp = DateTime.UtcNow,
            Errors = new[] { "Rate limit aşıldı. 1 dakika içinde en fazla 100 istek gönderebilirsiniz." }
        };

        await context.HttpContext.Response.WriteAsJsonAsync(response, cancellationToken: token);
    };
});

// Register services
builder.Services.AddSingleton<ICacheService, CacheService>();
builder.Services.AddScoped<ILogService, LogService>();
builder.Services.AddScoped<IBillingService, BillingService>();
builder.Services.AddScoped<IAIService, AIService>();
builder.Services.AddScoped<ISettingsService, SettingsService>();
builder.Services.AddScoped<IHelpService, HelpService>();

// Register HttpClient for AI service
builder.Services.AddHttpClient<AIService>();

// Register background services
builder.Services.AddHostedService<BackgroundBillingService>();

// Health Checks
builder.Services.AddHealthChecks()
    .AddNpgSql(
        connectionString: builder.Configuration.GetConnectionString("DefaultConnection") ?? "",
        name: "postgresql",
        tags: new[] { "db", "sql", "postgresql" })
    .AddCheck("api", () => 
        Microsoft.Extensions.Diagnostics.HealthChecks.HealthCheckResult.Healthy("API is running"),
        tags: new[] { "api" });

// Entity Framework - PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"), npgsqlOptions =>
    {
        // Uzun süren seed/migration işlemleri için komut zaman aşımını artır
        npgsqlOptions.CommandTimeout(180);
    });
    
    // Development'ta detaylı hata mesajları, Production'da kapalı
    if (builder.Environment.IsDevelopment())
    {
        options.EnableSensitiveDataLogging();
        options.EnableDetailedErrors();
    }
    
    // Global NoTracking yerine per-query basis kullanın
    // Not: Update işlemlerinde .AsTracking() eklemeniz gerekir
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
});

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:Key"];
if (string.IsNullOrEmpty(jwtKey) || jwtKey.Length < 32)
{
    if (builder.Environment.IsProduction())
    {
        throw new InvalidOperationException(
            "JWT Key is not configured or too short! Please set a secure JWT Key (min 32 characters) in configuration.");
    }
    Log.Warning("JWT Key is weak or not set. This is only acceptable in Development!");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ClockSkew = TimeSpan.Zero, // Token'ların tam zamanında expire olmasını sağla
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtKey ?? "fallback-key-for-development-only"))
        };
    });

// CORS Configuration
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() 
    ?? new[] { "http://localhost:3000" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            // Development: Allow all for easier testing
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        }
        else
        {
            // Production: Strict CORS policy
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
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

// Rate Limiting - CORS'tan önce!
app.UseRateLimiter();

app.UseCors("CorsPolicy");

// Global Exception Handler - En üstte olmalı!
app.UseGlobalExceptionHandler();

// Add request logging middleware - temporarily disabled
// app.UseMiddleware<RequestLoggingMiddleware>();

// Add tenant resolution middleware
app.UseTenantResolution();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Health check endpoints
app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
{
    ResponseWriter = async (context, report) =>
    {
        context.Response.ContentType = "application/json";
        
        var response = new
        {
            Status = report.Status.ToString(),
            Duration = report.TotalDuration,
            Timestamp = DateTime.UtcNow,
            Checks = report.Entries.Select(e => new
            {
                Name = e.Key,
                Status = e.Value.Status.ToString(),
                Description = e.Value.Description,
                Duration = e.Value.Duration,
                Tags = e.Value.Tags
            })
        };
        
        await context.Response.WriteAsJsonAsync(response);
    }
});

// Simple health check (sadece API çalışıyor mu?)
app.MapHealthChecks("/health/ready");

// Database migration'ları otomatik uygula ve test verilerini ekle
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate();

    // Seeding'i opsiyonel yap (CI/ilk doğrulama için kapatılabilir)
    var disableSeedEnv = Environment.GetEnvironmentVariable("DISABLE_SEED");
    var disableSeedConfig = builder.Configuration["DisableSeed"];
    var isSeedDisabled =
        string.Equals(disableSeedEnv, "1", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(disableSeedEnv, "true", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(disableSeedConfig, "1", StringComparison.OrdinalIgnoreCase) ||
        string.Equals(disableSeedConfig, "true", StringComparison.OrdinalIgnoreCase);

    if (!isSeedDisabled)
    {
        await DbInitializer.Initialize(context);
    }
    
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
