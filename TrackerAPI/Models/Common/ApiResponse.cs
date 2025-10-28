namespace ElectricityTrackerAPI.Models.Common
{
    /// <summary>
    /// Standart API Response modeli - Tüm API endpoint'leri bu formatı kullanır
    /// </summary>
    public class ApiResponse<T>
    {
        /// <summary>
        /// İşlem başarılı mı?
        /// </summary>
        public bool Success { get; set; }

        /// <summary>
        /// Response mesajı
        /// </summary>
        public string Message { get; set; } = string.Empty;

        /// <summary>
        /// Response data (başarılı işlemlerde)
        /// </summary>
        public T? Data { get; set; }

        /// <summary>
        /// Hata listesi (başarısız işlemlerde)
        /// </summary>
        public List<string>? Errors { get; set; }

        /// <summary>
        /// HTTP status code
        /// </summary>
        public int StatusCode { get; set; }

        /// <summary>
        /// İşlem zamanı
        /// </summary>
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Başarılı response oluştur
        /// </summary>
        public static ApiResponse<T> SuccessResponse(T data, string message = "İşlem başarılı", int statusCode = 200)
        {
            return new ApiResponse<T>
            {
                Success = true,
                Message = message,
                Data = data,
                StatusCode = statusCode,
                Timestamp = DateTime.UtcNow
            };
        }

        /// <summary>
        /// Hata response oluştur
        /// </summary>
        public static ApiResponse<T> ErrorResponse(string message, List<string>? errors = null, int statusCode = 400)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<string>(),
                StatusCode = statusCode,
                Timestamp = DateTime.UtcNow
            };
        }

        /// <summary>
        /// Hata response oluştur (tek hata mesajı)
        /// </summary>
        public static ApiResponse<T> ErrorResponse(string message, string error, int statusCode = 400)
        {
            return new ApiResponse<T>
            {
                Success = false,
                Message = message,
                Errors = new List<string> { error },
                StatusCode = statusCode,
                Timestamp = DateTime.UtcNow
            };
        }
    }

    /// <summary>
    /// Data içermeyen API Response (sadece success/failure)
    /// </summary>
    public class ApiResponse : ApiResponse<object>
    {
        public static ApiResponse SuccessResponse(string message = "İşlem başarılı", int statusCode = 200)
        {
            return new ApiResponse
            {
                Success = true,
                Message = message,
                StatusCode = statusCode,
                Timestamp = DateTime.UtcNow
            };
        }

        public static ApiResponse ErrorResponse(string message, List<string>? errors = null, int statusCode = 400)
        {
            return new ApiResponse
            {
                Success = false,
                Message = message,
                Errors = errors ?? new List<string>(),
                StatusCode = statusCode,
                Timestamp = DateTime.UtcNow
            };
        }
    }
}

