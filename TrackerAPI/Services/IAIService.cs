using System.Threading.Tasks;

namespace ElectricityTrackerAPI.Services
{
    public interface IAIService
    {
        Task<string> GenerateContentAsync(string prompt, string? context = null);
        Task<string> AnalyzeConsumptionDataAsync(string consumptionData);
        Task<string> GenerateReportAsync(string reportType, string data);
        Task<string> GetEnergyOptimizationSuggestionsAsync(string facilityData);
        Task<string> AnswerQuestionAsync(string question, string? context = null);
    }
} 