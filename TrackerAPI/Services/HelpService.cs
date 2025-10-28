using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Models.Core;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace ElectricityTrackerAPI.Services
{
    public class HelpService : IHelpService
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<HelpService> _logger;

        public HelpService(ApplicationDbContext context, ILogger<HelpService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<HelpCategory>> GetCategoriesAsync()
        {
            return await _context.HelpCategories
                .Include(c => c.SubCategories)
                .Where(c => c.ParentCategoryId == null)
                .OrderBy(c => c.SortOrder)
                .ToListAsync();
        }

        public async Task<HelpCategory> CreateCategoryAsync(HelpCategory category)
        {
            if (string.IsNullOrWhiteSpace(category.Slug))
            {
                category.Slug = GenerateSlug(category.Name);
            }

            _context.HelpCategories.Add(category);
            await _context.SaveChangesAsync();
            return category;
        }

        public async Task<HelpCategory> UpdateCategoryAsync(HelpCategory category)
        {
            var existingCategory = await _context.HelpCategories.FindAsync(category.Id);
            if (existingCategory == null)
                throw new ArgumentException("Kategori bulunamadı");

            existingCategory.Name = category.Name;
            existingCategory.Description = category.Description;
            existingCategory.Icon = category.Icon;
            existingCategory.Color = category.Color;
            existingCategory.SortOrder = category.SortOrder;
            existingCategory.IsActive = category.IsActive;
            existingCategory.UpdatedAt = DateTime.UtcNow;

            if (string.IsNullOrWhiteSpace(category.Slug))
            {
                existingCategory.Slug = GenerateSlug(category.Name);
            }
            else
            {
                existingCategory.Slug = category.Slug;
            }

            await _context.SaveChangesAsync();
            return existingCategory;
        }

        public async Task<bool> DeleteCategoryAsync(int id)
        {
            var category = await _context.HelpCategories.FindAsync(id);
            if (category == null)
                return false;

            // Check if category has articles
            var hasArticles = await _context.HelpArticles.AnyAsync(a => a.CategoryId == id);
            if (hasArticles)
                throw new InvalidOperationException("Bu kategoride makaleler bulunduğu için silinemez");

            _context.HelpCategories.Remove(category);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<HelpArticle>> GetArticlesAsync(int? categoryId = null)
        {
            var query = _context.HelpArticles
                .Include(a => a.Category)
                .AsQueryable();

            if (categoryId.HasValue)
            {
                query = query.Where(a => a.CategoryId == categoryId.Value);
            }

            return await query
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<HelpArticle> CreateArticleAsync(HelpArticle article)
        {
            if (string.IsNullOrWhiteSpace(article.Slug))
            {
                article.Slug = GenerateSlug(article.Title);
            }

            article.CreatedAt = DateTime.UtcNow;
            article.UpdatedAt = DateTime.UtcNow;

            if (article.Status == "published")
            {
                article.PublishedAt = DateTime.UtcNow;
            }

            _context.HelpArticles.Add(article);
            await _context.SaveChangesAsync();
            return article;
        }

        public async Task<HelpArticle> UpdateArticleAsync(HelpArticle article)
        {
            var existingArticle = await _context.HelpArticles.FindAsync(article.Id);
            if (existingArticle == null)
                throw new ArgumentException("Makale bulunamadı");

            existingArticle.Title = article.Title;
            existingArticle.Content = article.Content;
            existingArticle.CategoryId = article.CategoryId;
            existingArticle.Status = article.Status;
            existingArticle.SeoTitle = article.SeoTitle;
            existingArticle.SeoDescription = article.SeoDescription;
            existingArticle.SeoKeywords = article.SeoKeywords;
            existingArticle.IsActive = article.IsActive;
            existingArticle.UpdatedAt = DateTime.UtcNow;

            if (string.IsNullOrWhiteSpace(article.Slug))
            {
                existingArticle.Slug = GenerateSlug(article.Title);
            }
            else
            {
                existingArticle.Slug = article.Slug;
            }

            // Update published date if status changed to published
            if (article.Status == "published" && existingArticle.Status != "published")
            {
                existingArticle.PublishedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return existingArticle;
        }

        public async Task<bool> DeleteArticleAsync(int id)
        {
            var article = await _context.HelpArticles.FindAsync(id);
            if (article == null)
                return false;

            _context.HelpArticles.Remove(article);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<HelpArticle>> SearchArticlesAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return Enumerable.Empty<HelpArticle>();

            var searchTerm = query.ToLower();
            return await _context.HelpArticles
                .Include(a => a.Category)
                .Where(a => a.IsActive && a.Status == "published" &&
                           (a.Title.ToLower().Contains(searchTerm) ||
                            a.Content.ToLower().Contains(searchTerm) ||
                            a.SeoKeywords.ToLower().Contains(searchTerm)))
                .OrderByDescending(a => a.ViewCount)
                .ToListAsync();
        }

        public async Task<IEnumerable<HelpArticle>> GetFAQsAsync()
        {
            return await _context.HelpArticles
                .Include(a => a.Category)
                .Where(a => a.IsActive && a.Status == "published")
                .OrderByDescending(a => a.ViewCount)
                .ToListAsync();
        }

        public async Task<HelpArticle> CreateFAQAsync(HelpArticle faq)
        {
            faq.Status = "published";
            return await CreateArticleAsync(faq);
        }

        public async Task<HelpArticle> UpdateFAQAsync(HelpArticle faq)
        {
            faq.Status = "published";
            return await UpdateArticleAsync(faq);
        }

        public async Task<bool> DeleteFAQAsync(int id)
        {
            return await DeleteArticleAsync(id);
        }

        public async Task<bool> RecordArticleInteractionAsync(int articleId, string interactionType)
        {
            try
            {
                var article = await _context.HelpArticles.FindAsync(articleId);
                if (article == null)
                    return false;

                // Update article statistics
                switch (interactionType.ToLower())
                {
                    case "view":
                        article.ViewCount++;
                        break;
                    case "helpful":
                        article.HelpfulCount++;
                        break;
                    case "not_helpful":
                        article.NotHelpfulCount++;
                        break;
                    default:
                        return false;
                }

                // Record interaction
                var interaction = new HelpArticleInteraction
                {
                    ArticleId = articleId,
                    Type = interactionType.ToLower(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.HelpArticleInteractions.Add(interaction);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording article interaction");
                return false;
            }
        }

        public async Task<IEnumerable<ContactRequest>> GetContactRequestsAsync()
        {
            return await _context.ContactRequests
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        public async Task<ContactRequest> CreateContactRequestAsync(ContactRequest request)
        {
            request.CreatedAt = DateTime.UtcNow;
            request.UpdatedAt = DateTime.UtcNow;
            request.Status = "new";

            _context.ContactRequests.Add(request);
            await _context.SaveChangesAsync();
            return request;
        }

        public async Task<ContactRequest> UpdateContactRequestAsync(ContactRequest request)
        {
            var existingRequest = await _context.ContactRequests.FindAsync(request.Id);
            if (existingRequest == null)
                throw new ArgumentException("İletişim talebi bulunamadı");

            existingRequest.Name = request.Name;
            existingRequest.Email = request.Email;
            existingRequest.Subject = request.Subject;
            existingRequest.Message = request.Message;
            existingRequest.Category = request.Category;
            existingRequest.Priority = request.Priority;
            existingRequest.Status = request.Status;
            existingRequest.AssignedTo = request.AssignedTo;
            existingRequest.ResolutionNotes = request.ResolutionNotes;
            existingRequest.UpdatedAt = DateTime.UtcNow;

            if (request.Status == "resolved" && existingRequest.Status != "resolved")
            {
                existingRequest.ResolvedAt = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            return existingRequest;
        }

        public async Task<bool> DeleteContactRequestAsync(int id)
        {
            var request = await _context.ContactRequests.FindAsync(id);
            if (request == null)
                return false;

            _context.ContactRequests.Remove(request);
            await _context.SaveChangesAsync();
            return true;
        }

        private string GenerateSlug(string title)
        {
            // Convert to lowercase and remove special characters
            var slug = title.ToLower();
            slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
            slug = Regex.Replace(slug, @"\s+", "-");
            slug = slug.Trim('-');

            // Ensure uniqueness
            var baseSlug = slug;
            var counter = 1;
            while (_context.HelpArticles.Any(a => a.Slug == slug))
            {
                slug = $"{baseSlug}-{counter}";
                counter++;
            }

            return slug;
        }
    }
}
