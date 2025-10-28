using Microsoft.AspNetCore.Mvc;
using ElectricityTrackerAPI.Services;
using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.DTOs.Core;
using ElectricityTrackerAPI.Controllers.Common;

namespace ElectricityTrackerAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/superadmin/help")]
    public class HelpController : BaseController
    {
        private readonly IHelpService _helpService;
        private readonly ILogger<HelpController> _helpLogger;

        public HelpController(IHelpService helpService, ILogger<HelpController> logger) : base(null, logger)
        {
            _helpService = helpService;
            _helpLogger = logger;
        }

        // GET: api/admin/help/categories
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<HelpCategory>>> GetCategories()
        {
            try
            {
                var categories = await _helpService.GetCategoriesAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error getting help categories");
                return StatusCode(500, "Kategoriler alınırken hata oluştu");
            }
        }

        // POST: api/admin/help/categories
        [HttpPost("categories")]
        public async Task<ActionResult<HelpCategory>> CreateCategory([FromBody] HelpCategory category)
        {
            try
            {
                var createdCategory = await _helpService.CreateCategoryAsync(category);
                return CreatedAtAction(nameof(GetCategories), new { id = createdCategory.Id }, createdCategory);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error creating help category");
                return StatusCode(500, "Kategori oluşturulurken hata oluştu");
            }
        }

        // PUT: api/admin/help/categories/{id}
        [HttpPut("categories/{id}")]
        public async Task<ActionResult<HelpCategory>> UpdateCategory(int id, [FromBody] HelpCategory category)
        {
            try
            {
                if (id != category.Id)
                    return BadRequest("ID uyuşmazlığı");

                var updatedCategory = await _helpService.UpdateCategoryAsync(category);
                return Ok(updatedCategory);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error updating help category");
                return StatusCode(500, "Kategori güncellenirken hata oluştu");
            }
        }

        // DELETE: api/admin/help/categories/{id}
        [HttpDelete("categories/{id}")]
        public async Task<ActionResult> DeleteCategory(int id)
        {
            try
            {
                var result = await _helpService.DeleteCategoryAsync(id);
                if (result)
                    return NoContent();
                
                return NotFound("Kategori bulunamadı");
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error deleting help category");
                return StatusCode(500, "Kategori silinirken hata oluştu");
            }
        }

        // GET: api/admin/help/articles
        [HttpGet("articles")]
        public async Task<ActionResult<IEnumerable<HelpArticle>>> GetArticles([FromQuery] int? categoryId = null)
        {
            try
            {
                var articles = await _helpService.GetArticlesAsync(categoryId);
                return Ok(articles);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error getting help articles");
                return StatusCode(500, "Makaleler alınırken hata oluştu");
            }
        }

        // POST: api/admin/help/articles
        [HttpPost("articles")]
        public async Task<ActionResult<HelpArticle>> CreateArticle([FromBody] HelpArticle article)
        {
            try
            {
                var createdArticle = await _helpService.CreateArticleAsync(article);
                return CreatedAtAction(nameof(GetArticles), new { id = createdArticle.Id }, createdArticle);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error creating help article");
                return StatusCode(500, "Makale oluşturulurken hata oluştu");
            }
        }

        // PUT: api/admin/help/articles/{id}
        [HttpPut("articles/{id}")]
        public async Task<ActionResult<HelpArticle>> UpdateArticle(int id, [FromBody] HelpArticle article)
        {
            try
            {
                if (id != article.Id)
                    return BadRequest("ID uyuşmazlığı");

                var updatedArticle = await _helpService.UpdateArticleAsync(article);
                return Ok(updatedArticle);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error updating help article");
                return StatusCode(500, "Makale güncellenirken hata oluştu");
            }
        }

        // DELETE: api/admin/help/articles/{id}
        [HttpDelete("articles/{id}")]
        public async Task<ActionResult> DeleteArticle(int id)
        {
            try
            {
                var result = await _helpService.DeleteArticleAsync(id);
                if (result)
                    return NoContent();
                
                return NotFound("Makale bulunamadı");
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error deleting help article");
                return StatusCode(500, "Makale silinirken hata oluştu");
            }
        }

        // GET: api/admin/help/articles/search
        [HttpGet("articles/search")]
        public async Task<ActionResult<IEnumerable<HelpArticle>>> SearchArticles([FromQuery] string q)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(q))
                    return BadRequest("Arama terimi gerekli");

                var articles = await _helpService.SearchArticlesAsync(q);
                return Ok(articles);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error searching help articles");
                return StatusCode(500, "Makale arama sırasında hata oluştu");
            }
        }

        // GET: api/admin/help/faqs
        [HttpGet("faqs")]
        public async Task<ActionResult<IEnumerable<HelpArticle>>> GetFAQs()
        {
            try
            {
                var faqs = await _helpService.GetFAQsAsync();
                return Ok(faqs);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error getting FAQs");
                return StatusCode(500, "SSS alınırken hata oluştu");
            }
        }

        // POST: api/admin/help/faqs
        [HttpPost("faqs")]
        public async Task<ActionResult<HelpArticle>> CreateFAQ([FromBody] HelpArticle faq)
        {
            try
            {
                var createdFAQ = await _helpService.CreateFAQAsync(faq);
                return CreatedAtAction(nameof(GetFAQs), new { id = createdFAQ.Id }, createdFAQ);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error creating FAQ");
                return StatusCode(500, "SSS oluşturulurken hata oluştu");
            }
        }

        // PUT: api/admin/help/faqs/{id}
        [HttpPut("faqs/{id}")]
        public async Task<ActionResult<HelpArticle>> UpdateFAQ(int id, [FromBody] HelpArticle faq)
        {
            try
            {
                if (id != faq.Id)
                    return BadRequest("ID uyuşmazlığı");

                var updatedFAQ = await _helpService.UpdateFAQAsync(faq);
                return Ok(updatedFAQ);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error updating FAQ");
                return StatusCode(500, "SSS güncellenirken hata oluştu");
            }
        }

        // DELETE: api/admin/help/faqs/{id}
        [HttpDelete("faqs/{id}")]
        public async Task<ActionResult> DeleteFAQ(int id)
        {
            try
            {
                var result = await _helpService.DeleteFAQAsync(id);
                if (result)
                    return NoContent();
                
                return NotFound("SSS bulunamadı");
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error deleting FAQ");
                return StatusCode(500, "SSS silinirken hata oluştu");
            }
        }

        // POST: api/admin/help/articles/{id}/interactions
        [HttpPost("articles/{id}/interactions")]
        public async Task<ActionResult> RecordArticleInteraction(int id, [FromBody] InteractionRequest request)
        {
            try
            {
                var result = await _helpService.RecordArticleInteractionAsync(id, request.Type);
                if (result)
                    return Ok(new { success = true });
                
                return BadRequest("Etkileşim kaydedilemedi");
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error recording article interaction");
                return StatusCode(500, "Etkileşim kaydedilirken hata oluştu");
            }
        }

        // GET: api/admin/help/contact-requests
        [HttpGet("contact-requests")]
        public async Task<ActionResult<IEnumerable<ContactRequest>>> GetContactRequests()
        {
            try
            {
                var requests = await _helpService.GetContactRequestsAsync();
                return Ok(requests);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error getting contact requests");
                return StatusCode(500, "İletişim talepleri alınırken hata oluştu");
            }
        }

        // PUT: api/admin/help/contact-requests/{id}
        [HttpPut("contact-requests/{id}")]
        public async Task<ActionResult<ContactRequest>> UpdateContactRequest(int id, [FromBody] ContactRequest request)
        {
            try
            {
                if (id != request.Id)
                    return BadRequest("ID uyuşmazlığı");

                var updatedRequest = await _helpService.UpdateContactRequestAsync(request);
                return Ok(updatedRequest);
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error updating contact request");
                return StatusCode(500, "İletişim talebi güncellenirken hata oluştu");
            }
        }

        // DELETE: api/admin/help/contact-requests/{id}
        [HttpDelete("contact-requests/{id}")]
        public async Task<ActionResult> DeleteContactRequest(int id)
        {
            try
            {
                var result = await _helpService.DeleteContactRequestAsync(id);
                if (result)
                    return NoContent();
                
                return NotFound("İletişim talebi bulunamadı");
            }
            catch (Exception ex)
            {
                _helpLogger.LogError(ex, "Error deleting contact request");
                return StatusCode(500, "İletişim talebi silinirken hata oluştu");
            }
        }
    }

    public class InteractionRequest
    {
        public string Type { get; set; } = string.Empty; // "view", "helpful", "not_helpful"
    }
}
