using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Services;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Models.Logging;
using ElectricityTrackerAPI.DTOs.Admin;

namespace ElectricityTrackerAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/ai")]
    [Authorize(Roles = "SuperAdmin")]
    public class SuperAdminAIController : Common.BaseController
    {
        private readonly IAIService _aiService;

        public SuperAdminAIController(ApplicationDbContext context, ILogger<SuperAdminAIController> logger, IAIService aiService) 
            : base(context, logger)
        {
            _aiService = aiService;
        }

        [HttpPost("generate-content")]
        public async Task<ActionResult<AIResponseDto>> GenerateContent([FromBody] GenerateContentDto dto)
        {
            try
            {
                var response = await _aiService.GenerateContentAsync(dto.Prompt, dto.Context);

                // Log the AI interaction
                await LogSystemAction(
                    "AI içerik üretimi",
                    $"Prompt: {dto.Prompt.Substring(0, Math.Min(100, dto.Prompt.Length))}...",
                    "AI"
                );

                return Ok(new AIResponseDto
                {
                    Success = true,
                    Content = response,
                    GeneratedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AI content generation failed");
                return StatusCode(500, new AIResponseDto
                {
                    Success = false,
                    Error = "AI servisi ile iletişim kurulurken hata oluştu.",
                    GeneratedAt = DateTime.UtcNow
                });
            }
        }

        [HttpPost("analyze-consumption")]
        public async Task<ActionResult<AIResponseDto>> AnalyzeConsumptionData([FromBody] ConsumptionAnalysisDto dto)
        {
            try
            {
                var analysis = await _aiService.AnalyzeConsumptionDataAsync(dto.ConsumptionData);

                // Log the analysis
                await LogSystemAction(
                    "AI tüketim analizi",
                    $"Tesis: {dto.FacilityName}, Veri noktası: {dto.DataPoints}",
                    "AI"
                );

                return Ok(new AIResponseDto
                {
                    Success = true,
                    Content = analysis,
                    GeneratedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AI consumption analysis failed");
                return StatusCode(500, new AIResponseDto
                {
                    Success = false,
                    Error = "Tüketim analizi sırasında hata oluştu.",
                    GeneratedAt = DateTime.UtcNow
                });
            }
        }

        [HttpPost("generate-report")]
        public async Task<ActionResult<AIResponseDto>> GenerateReport([FromBody] ReportGenerationDto dto)
        {
            try
            {
                var report = await _aiService.GenerateReportAsync(dto.ReportType, dto.Data);

                // Log the report generation
                await LogSystemAction(
                    "AI rapor üretimi",
                    $"Rapor türü: {dto.ReportType}, Tenant: {dto.TenantName}",
                    "AI"
                );

                return Ok(new AIResponseDto
                {
                    Success = true,
                    Content = report,
                    GeneratedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AI report generation failed");
                return StatusCode(500, new AIResponseDto
                {
                    Success = false,
                    Error = "Rapor üretimi sırasında hata oluştu.",
                    GeneratedAt = DateTime.UtcNow
                });
            }
        }

        [HttpPost("energy-optimization")]
        public async Task<ActionResult<AIResponseDto>> GetEnergyOptimizationSuggestions([FromBody] EnergyOptimizationDto dto)
        {
            try
            {
                var suggestions = await _aiService.GetEnergyOptimizationSuggestionsAsync(dto.FacilityData);

                // Log the optimization request
                await LogSystemAction(
                    "AI enerji optimizasyonu",
                    $"Tesis: {dto.FacilityName}, Tüketim: {dto.CurrentConsumption} kWh",
                    "AI"
                );

                return Ok(new AIResponseDto
                {
                    Success = true,
                    Content = suggestions,
                    GeneratedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AI energy optimization failed");
                return StatusCode(500, new AIResponseDto
                {
                    Success = false,
                    Error = "Enerji optimizasyonu sırasında hata oluştu.",
                    GeneratedAt = DateTime.UtcNow
                });
            }
        }

        [HttpPost("chat")]
        public async Task<ActionResult<AIResponseDto>> ChatWithAI([FromBody] ChatRequestDto dto)
        {
            try
            {
                var response = await _aiService.AnswerQuestionAsync(dto.Question, dto.Context);

                // Log the chat interaction
                await LogSystemAction(
                    "AI sohbet",
                    $"Soru: {dto.Question.Substring(0, Math.Min(100, dto.Question.Length))}...",
                    "AI"
                );

                return Ok(new AIResponseDto
                {
                    Success = true,
                    Content = response,
                    GeneratedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AI chat failed");
                return StatusCode(500, new AIResponseDto
                {
                    Success = false,
                    Error = "AI sohbeti sırasında hata oluştu.",
                    GeneratedAt = DateTime.UtcNow
                });
            }
        }

        [HttpGet("usage-stats")]
        public async Task<ActionResult<AIUsageStatsDto>> GetAIUsageStats()
        {
            try
            {
                // Get AI usage statistics from logs
                var aiLogs = await _context.SystemLogs
                    .Where(l => l.Category == "AI")
                    .OrderByDescending(l => l.Timestamp)
                    .Take(100)
                    .ToListAsync();

                var stats = new AIUsageStatsDto
                {
                    TotalRequests = aiLogs.Count(),
                    RecentRequests = aiLogs.Count(l => l.Timestamp >= DateTime.UtcNow.AddDays(7)),
                    SuccessRate = aiLogs.Count(l => l.Level == "Info") * 100.0 / Math.Max(aiLogs.Count(), 1),
                    LastUsed = aiLogs.FirstOrDefault()?.Timestamp,
                    PopularFeatures = aiLogs
                        .GroupBy(l => l.Message)
                        .OrderByDescending(g => g.Count())
                        .Take(5)
                        .Select(g => new PopularFeatureDto
                        {
                            Feature = g.Key,
                            UsageCount = g.Count()
                        })
                        .ToList()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AI usage stats retrieval failed");
                return StatusCode(500, new { message = "AI kullanım istatistikleri alınırken hata oluştu", error = ex.Message });
            }
        }

        [HttpPost("test-connection")]
        public async Task<ActionResult<AIResponseDto>> TestAIConnection()
        {
            try
            {
                var testResponse = await _aiService.GenerateContentAsync("Merhaba! Bu bir test mesajıdır. Lütfen 'Bağlantı başarılı' yanıtını ver.");

                return Ok(new AIResponseDto
                {
                    Success = true,
                    Content = testResponse,
                    GeneratedAt = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AI connection test failed");
                return StatusCode(500, new AIResponseDto
                {
                    Success = false,
                    Error = "AI bağlantı testi başarısız oldu.",
                    GeneratedAt = DateTime.UtcNow
                });
            }
        }

        // AI Analytics Endpoints
        [HttpGet("analytics/consumption-predictions")]
        public async Task<ActionResult<List<ConsumptionPredictionDto>>> GetConsumptionPredictions()
        {
            try
            {
                // Mock data for now - replace with real database queries later
                var predictions = new List<ConsumptionPredictionDto>
                {
                    new ConsumptionPredictionDto
                    {
                        Id = 1,
                        TenantId = 1,
                        TenantName = "ABC Şirketi",
                        ResourceType = "electricity",
                        ResourceName = "Ana Elektrik",
                        CurrentMonth = 4500,
                        PredictedNextMonth = 4800,
                        PredictedYearly = 52000,
                        Confidence = 85,
                        Trend = "increasing",
                        Factors = new List<string> { "Yaz ayları", "Klima kullanımı", "Üretim artışı" },
                        Recommendations = new List<string> { "Enerji tasarrufu", "Akıllı sayaç", "Zaman bazlı fiyatlandırma" }
                    },
                    new ConsumptionPredictionDto
                    {
                        Id = 2,
                        TenantId = 2,
                        TenantName = "XYZ Ltd.",
                        ResourceType = "water",
                        ResourceName = "Su Tüketimi",
                        CurrentMonth = 1200,
                        PredictedNextMonth = 1100,
                        PredictedYearly = 13000,
                        Confidence = 92,
                        Trend = "decreasing",
                        Factors = new List<string> { "Su tasarrufu", "Yeni ekipman", "Personel eğitimi" },
                        Recommendations = new List<string> { "Su geri dönüşümü", "Sızıntı kontrolü", "Verimli armatürler" }
                    }
                };

                return Ok(predictions);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get consumption predictions");
                return StatusCode(500, new { Error = "Tüketim tahminleri alınırken hata oluştu." });
            }
        }

        [HttpGet("analytics/cost-savings")]
        public async Task<ActionResult<List<CostSavingsDto>>> GetCostSavings()
        {
            try
            {
                // Mock data for now - replace with real database queries later
                var savings = new List<CostSavingsDto>
                {
                    new CostSavingsDto
                    {
                        Id = 1,
                        TenantId = 1,
                        TenantName = "ABC Şirketi",
                        DepartmentId = 1,
                        DepartmentName = "IT Departmanı",
                        CurrentCost = 4500,
                        PotentialSavings = 1200,
                        SavingsPercentage = 26.7,
                        Recommendations = new List<string> { "Sunucu sanallaştırma: ₺800 tasarruf", "Enerji tasarruflu monitörler: ₺400 tasarruf" },
                        ImplementationTime = "2-3 ay",
                        ROI = 180,
                        Priority = "high"
                    },
                    new CostSavingsDto
                    {
                        Id = 2,
                        TenantId = 2,
                        TenantName = "XYZ Ltd.",
                        DepartmentId = 4,
                        DepartmentName = "Üretim",
                        CurrentCost = 8500,
                        PotentialSavings = 2100,
                        SavingsPercentage = 24.7,
                        Recommendations = new List<string> { "Verimli motorlar: ₺1200 tasarruf", "Akıllı aydınlatma: ₺900 tasarruf" },
                        ImplementationTime = "4-6 ay",
                        ROI = 220,
                        Priority = "medium"
                    }
                };

                return Ok(savings);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get cost savings");
                return StatusCode(500, new { Error = "Maliyet tasarrufları alınırken hata oluştu." });
            }
        }

        [HttpGet("analytics/department-kpis")]
        public async Task<ActionResult<List<DepartmentKPIDto>>> GetDepartmentKPIs()
        {
            try
            {
                // Mock data for now - replace with real database queries later
                var kpis = new List<DepartmentKPIDto>
                {
                    new DepartmentKPIDto
                    {
                        Id = 1,
                        TenantId = 1,
                        TenantName = "ABC Şirketi",
                        DepartmentId = 1,
                        DepartmentName = "IT Departmanı",
                        EnergyEfficiency = 85,
                        CostPerEmployee = 180,
                        SustainabilityScore = 78,
                        ImprovementAreas = new List<string> { "Sunucu optimizasyonu", "Enerji izleme sistemi" }
                    },
                    new DepartmentKPIDto
                    {
                        Id = 2,
                        TenantId = 2,
                        TenantName = "XYZ Ltd.",
                        DepartmentId = 4,
                        DepartmentName = "Üretim",
                        EnergyEfficiency = 72,
                        CostPerEmployee = 320,
                        SustainabilityScore = 65,
                        ImprovementAreas = new List<string> { "Verimli ekipman", "Atık azaltma" }
                    }
                };

                return Ok(kpis);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get department KPIs");
                return StatusCode(500, new { Error = "Departman KPI'ları alınırken hata oluştu." });
            }
        }

        [HttpGet("analytics/carbon-footprint")]
        public async Task<ActionResult<List<CarbonFootprintDto>>> GetCarbonFootprint()
        {
            try
            {
                // Mock data for now - replace with real database queries later
                var footprints = new List<CarbonFootprintDto>
                {
                    new CarbonFootprintDto
                    {
                        Id = 1,
                        TenantId = 1,
                        TenantName = "ABC Şirketi",
                        CurrentMonth = 2.8,
                        PreviousMonth = 3.1,
                        Reduction = 12.5,
                        Target = 2.5,
                        Status = "on-track"
                    },
                    new CarbonFootprintDto
                    {
                        Id = 2,
                        TenantId = 2,
                        TenantName = "XYZ Ltd.",
                        CurrentMonth = 4.2,
                        PreviousMonth = 4.5,
                        Reduction = 8.2,
                        Target = 3.8,
                        Status = "behind"
                    }
                };

                return Ok(footprints);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get carbon footprint");
                return StatusCode(500, new { Error = "Karbon ayak izi verileri alınırken hata oluştu." });
            }
        }

        [HttpGet("analytics/executive-kpis")]
        public async Task<ActionResult<List<ExecutiveKPIDto>>> GetExecutiveKPIs()
        {
            try
            {
                // Mock data for now - replace with real database queries later
                var kpis = new List<ExecutiveKPIDto>
                {
                    new ExecutiveKPIDto
                    {
                        Id = 1,
                        TenantId = 1,
                        TenantName = "ABC Şirketi",
                        TotalEnergyCost = 45200,
                        EnergyEfficiency = 78,
                        SustainabilityScore = 82,
                        CostSavings = 12000,
                        ComplianceScore = 95
                    },
                    new ExecutiveKPIDto
                    {
                        Id = 2,
                        TenantId = 2,
                        TenantName = "XYZ Ltd.",
                        TotalEnergyCost = 68500,
                        EnergyEfficiency = 72,
                        SustainabilityScore = 68,
                        CostSavings = 8500,
                        ComplianceScore = 88
                    }
                };

                return Ok(kpis);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get executive KPIs");
                return StatusCode(500, new { Error = "Yönetici KPI'ları alınırken hata oluştu." });
            }
        }
    }

    // DTOs
    public class GenerateContentDto
    {
        public string Prompt { get; set; } = string.Empty;
        public string? Context { get; set; }
    }

    public class ConsumptionAnalysisDto
    {
        public string ConsumptionData { get; set; } = string.Empty;
        public string FacilityName { get; set; } = string.Empty;
        public int DataPoints { get; set; }
    }

    public class ReportGenerationDto
    {
        public string ReportType { get; set; } = string.Empty;
        public string Data { get; set; } = string.Empty;
        public string TenantName { get; set; } = string.Empty;
    }

    public class EnergyOptimizationDto
    {
        public string FacilityData { get; set; } = string.Empty;
        public string FacilityName { get; set; } = string.Empty;
        public decimal CurrentConsumption { get; set; }
    }

    public class ChatRequestDto
    {
        public string Question { get; set; } = string.Empty;
        public string? Context { get; set; }
    }

    public class AIResponseDto
    {
        public bool Success { get; set; }
        public string? Content { get; set; }
        public string? Error { get; set; }
        public DateTime GeneratedAt { get; set; }
    }

    public class AIUsageStatsDto
    {
        public int TotalRequests { get; set; }
        public int RecentRequests { get; set; }
        public double SuccessRate { get; set; }
        public DateTime? LastUsed { get; set; }
        public List<PopularFeatureDto> PopularFeatures { get; set; } = new();
    }

    public class PopularFeatureDto
    {
        public string Feature { get; set; } = string.Empty;
        public int UsageCount { get; set; }
    }
} 