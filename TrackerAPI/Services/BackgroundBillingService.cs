using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace ElectricityTrackerAPI.Services
{
    public class BackgroundBillingService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<BackgroundBillingService> _logger;
        private readonly TimeSpan _period = TimeSpan.FromDays(1); // Her gün çalışır
        
        // Monitoring için property'ler
        public bool IsRunning { get; private set; } = false;
        public double Progress { get; private set; } = 0;
        public DateTime NextRunTime { get; private set; } = DateTime.UtcNow.AddDays(1);
        public DateTime LastRunTime { get; private set; } = DateTime.UtcNow.AddDays(-1);

        public BackgroundBillingService(
            IServiceProvider serviceProvider,
            ILogger<BackgroundBillingService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Background Billing Service started. Will run every day at 00:00.");

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    // Her gün saat 00:00'da çalış
                    var now = DateTime.UtcNow;
                    var nextRun = now.Date.AddDays(1); // Yarın 00:00
                    var delay = nextRun - now;

                    NextRunTime = nextRun;
                    _logger.LogInformation($"Next automatic billing run scheduled for: {nextRun:yyyy-MM-dd HH:mm:ss} UTC");

                    // Bir sonraki çalışma zamanına kadar bekle
                    await Task.Delay(delay, stoppingToken);

                    // Otomatik fatura oluşturma işlemini başlat
                    await ProcessAutomaticBilling();
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInformation("Background Billing Service is stopping.");
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred in Background Billing Service");
                    
                    // Hata durumunda 1 saat bekle ve tekrar dene
                    await Task.Delay(TimeSpan.FromHours(1), stoppingToken);
                }
            }
        }

        private async Task ProcessAutomaticBilling()
        {
            _logger.LogInformation("Starting daily automatic billing process...");
            
            IsRunning = true;
            Progress = 0;
            LastRunTime = DateTime.UtcNow;

            using var scope = _serviceProvider.CreateScope();
            var billingService = scope.ServiceProvider.GetRequiredService<IBillingService>();

            try
            {
                // Progress'i güncelle
                Progress = 25;
                await Task.Delay(100); // Simüle edilmiş işlem süresi
                
                Progress = 50;
                await Task.Delay(100);
                
                Progress = 75;
                await Task.Delay(100);
                
                await billingService.ProcessAutomaticBilling();
                
                Progress = 100;
                _logger.LogInformation("Daily automatic billing process completed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during automatic billing process");
            }
            finally
            {
                IsRunning = false;
                Progress = 0;
            }
        }
    }
} 