using Microsoft.AspNetCore.Mvc;
using ElectricityTrackerAPI.Services;
using ElectricityTrackerAPI.Models.Core;

namespace ElectricityTrackerAPI.Controllers
{
    [ApiController]
    [Route("api/help")]
    public class HelpController : ControllerBase
    {
        private readonly IHelpService _helpService;
        private readonly ILogger<HelpController> _logger;

        public HelpController(IHelpService helpService, ILogger<HelpController> logger)
        {
            _helpService = helpService;
            _logger = logger;
        }

        // POST: api/help/contact
        [HttpPost("contact")]
        public async Task<ActionResult<ContactRequest>> CreateContactRequest([FromBody] ContactRequest request)
        {
            try
            {
                var createdRequest = await _helpService.CreateContactRequestAsync(request);
                return CreatedAtAction(nameof(CreateContactRequest), new { id = createdRequest.Id }, createdRequest);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating contact request");
                return StatusCode(500, "İletişim talebi oluşturulurken hata oluştu");
            }
        }

        // GET: api/help/faqs
        [HttpGet("faqs")]
        public async Task<ActionResult<IEnumerable<HelpArticle>>> GetPublicFAQs()
        {
            try
            {
                var faqs = await _helpService.GetFAQsAsync();
                return Ok(faqs.Where(f => f.IsActive));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting public FAQs");
                return StatusCode(500, "SSS alınırken hata oluştu");
            }
        }

        // GET: api/help/articles
        [HttpGet("articles")]
        public async Task<ActionResult<IEnumerable<HelpArticle>>> GetPublicArticles([FromQuery] int? categoryId = null)
        {
            try
            {
                var articles = await _helpService.GetArticlesAsync(categoryId);
                return Ok(articles.Where(a => a.IsActive && a.Status == "published"));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting public articles");
                return StatusCode(500, "Makaleler alınırken hata oluştu");
            }
        }

        // GET: api/help/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<HelpCategory>>> GetPublicCategories()
        {
            try
            {
                var categories = await _helpService.GetCategoriesAsync();
                return Ok(categories.Where(c => c.IsActive));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting public categories");
                return StatusCode(500, "Kategoriler alınırken hata oluştu");
            }
        }
    }
}
