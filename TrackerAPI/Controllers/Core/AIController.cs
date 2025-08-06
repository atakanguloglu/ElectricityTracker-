using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using ElectricityTrackerAPI.Services;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Models.Logging;

namespace ElectricityTrackerAPI.Controllers.Core
{
    [ApiController]
    [Route("api/ai")]
    [Authorize]
    public class AIController : Common.BaseController
    {
        private readonly IAIService _aiService;

        public AIController(ApplicationDbContext context, ILogger<AIController> logger, IAIService aiService) 
            : base(context, logger)
        {
            _aiService = aiService;
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

        [HttpPost("generate-report")]
        public async Task<ActionResult<AIResponseDto>> GenerateReport([FromBody] ReportGenerationDto dto)
        {
            try
            {
                var report = await _aiService.GenerateReportAsync(dto.ReportType, dto.Data);

                // Log the report generation
                await LogSystemAction(
                    "AI rapor üretimi",
                    $"Rapor türü: {dto.ReportType}",
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
    }

    // DTOs
    public class ChatRequestDto
    {
        public string Question { get; set; } = string.Empty;
        public string? Context { get; set; }
    }

    public class ConsumptionAnalysisDto
    {
        public string ConsumptionData { get; set; } = string.Empty;
        public string FacilityName { get; set; } = string.Empty;
        public int DataPoints { get; set; }
    }

    public class EnergyOptimizationDto
    {
        public string FacilityData { get; set; } = string.Empty;
        public string FacilityName { get; set; } = string.Empty;
        public decimal CurrentConsumption { get; set; }
    }

    public class ReportGenerationDto
    {
        public string ReportType { get; set; } = string.Empty;
        public string Data { get; set; } = string.Empty;
    }

    public class AIResponseDto
    {
        public bool Success { get; set; }
        public string? Content { get; set; }
        public string? Error { get; set; }
        public DateTime GeneratedAt { get; set; }
    }
} 