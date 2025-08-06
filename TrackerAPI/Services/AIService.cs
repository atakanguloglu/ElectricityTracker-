using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace ElectricityTrackerAPI.Services
{
    public class AIService : IAIService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AIService> _logger;
        private readonly string _apiKey;
        private readonly string _baseUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

        public AIService(HttpClient httpClient, IConfiguration configuration, ILogger<AIService> logger)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _logger = logger;
            _apiKey = _configuration["GeminiAPI:ApiKey"] ?? "AIzaSyCBjtmnsY2nEZHBEJkqR3p5pDWLA737T8I";
        }

        public async Task<string> GenerateContentAsync(string prompt, string? context = null)
        {
            try
            {
                var requestBody = new
                {
                    contents = new[]
                    {
                        new
                        {
                            parts = new[]
                            {
                                new
                                {
                                    text = context != null ? $"{context}\n\n{prompt}" : prompt
                                }
                            }
                        }
                    }
                };

                var json = JsonSerializer.Serialize(requestBody);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync($"{_baseUrl}?key={_apiKey}", content);
                
                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var responseData = JsonSerializer.Deserialize<GeminiResponse>(responseContent);
                    
                    if (responseData?.candidates?.Length > 0 && 
                        responseData.candidates[0].content?.parts?.Length > 0)
                    {
                        return responseData.candidates[0].content.parts[0].text;
                    }
                }

                _logger.LogError("Gemini API request failed: {StatusCode}", response.StatusCode);
                return "AI servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calling Gemini API");
                return "AI servisi ile iletişim kurulurken hata oluştu.";
            }
        }

        public async Task<string> AnalyzeConsumptionDataAsync(string consumptionData)
        {
            var prompt = $@"
Elektrik tüketim verilerini analiz et ve aşağıdaki konularda detaylı bir rapor hazırla:

Veri: {consumptionData}

Lütfen şunları analiz et:
1. Tüketim trendleri
2. Anormal kullanım paternleri
3. Enerji tasarrufu önerileri
4. Maliyet analizi
5. Gelecek tahminleri

Raporu Türkçe olarak hazırla ve pratik öneriler sun.
";

            return await GenerateContentAsync(prompt);
        }

        public async Task<string> GenerateReportAsync(string reportType, string data)
        {
            var prompt = $@"
{reportType} raporu için aşağıdaki verileri kullanarak profesyonel bir rapor hazırla:

Veri: {data}

Rapor şunları içermeli:
1. Özet ve ana bulgular
2. Detaylı analiz
3. Grafik ve görselleştirme önerileri
4. Sonuçlar ve öneriler
5. Eylem planı

Raporu Türkçe olarak hazırla ve yönetim seviyesinde anlaşılır olsun.
";

            return await GenerateContentAsync(prompt);
        }

        public async Task<string> GetEnergyOptimizationSuggestionsAsync(string facilityData)
        {
            var prompt = $@"
Aşağıdaki tesis verilerine göre enerji optimizasyonu önerileri sun:

Tesis Verileri: {facilityData}

Lütfen şu konularda öneriler ver:
1. Enerji tasarrufu teknikleri
2. Ekipman optimizasyonu
3. Zamanlama önerileri
4. Maliyet-fayda analizi
5. Uygulama adımları
6. Beklenen tasarruf miktarları

Önerileri pratik ve uygulanabilir olacak şekilde Türkçe olarak sun.
";

            return await GenerateContentAsync(prompt);
        }

        public async Task<string> AnswerQuestionAsync(string question, string? context = null)
        {
            var prompt = context != null 
                ? $"Bağlam: {context}\n\nSoru: {question}\n\nLütfen bu soruyu Türkçe olarak yanıtla."
                : $"Soru: {question}\n\nLütfen bu soruyu Türkçe olarak yanıtla.";

            return await GenerateContentAsync(prompt);
        }
    }

    // Gemini API Response Models
    public class GeminiResponse
    {
        public Candidate[]? candidates { get; set; }
    }

    public class Candidate
    {
        public Content? content { get; set; }
    }

    public class Content
    {
        public Part[]? parts { get; set; }
    }

    public class Part
    {
        public string? text { get; set; }
    }
} 