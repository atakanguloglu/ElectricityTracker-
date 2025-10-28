using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using ElectricityTrackerAPI.Models.Common;

namespace ElectricityTrackerAPI.Filters
{
    /// <summary>
    /// Model validation filter - Otomatik olarak ModelState kontrolü yapar
    /// </summary>
    public class ValidationFilter : IActionFilter
    {
        public void OnActionExecuting(ActionExecutingContext context)
        {
            if (!context.ModelState.IsValid)
            {
                var errors = context.ModelState
                    .Where(x => x.Value?.Errors.Count > 0)
                    .SelectMany(x => x.Value!.Errors)
                    .Select(x => x.ErrorMessage)
                    .ToList();

                var response = ApiResponse.ErrorResponse(
                    message: "Validation hatası oluştu",
                    errors: errors,
                    statusCode: 400
                );

                context.Result = new BadRequestObjectResult(response);
            }
        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            // Action tamamlandıktan sonra bir işlem yapmaya gerek yok
        }
    }
}

