using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Services;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Models.Logging;

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