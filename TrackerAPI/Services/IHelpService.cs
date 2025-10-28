using ElectricityTrackerAPI.Models.Core;

namespace ElectricityTrackerAPI.Services
{
    public interface IHelpService
    {
        // Categories
        Task<IEnumerable<HelpCategory>> GetCategoriesAsync();
        Task<HelpCategory> CreateCategoryAsync(HelpCategory category);
        Task<HelpCategory> UpdateCategoryAsync(HelpCategory category);
        Task<bool> DeleteCategoryAsync(int id);

        // Articles
        Task<IEnumerable<HelpArticle>> GetArticlesAsync(int? categoryId = null);
        Task<HelpArticle> CreateArticleAsync(HelpArticle article);
        Task<HelpArticle> UpdateArticleAsync(HelpArticle article);
        Task<bool> DeleteArticleAsync(int id);
        Task<IEnumerable<HelpArticle>> SearchArticlesAsync(string query);

        // FAQs
        Task<IEnumerable<HelpArticle>> GetFAQsAsync();
        Task<HelpArticle> CreateFAQAsync(HelpArticle faq);
        Task<HelpArticle> UpdateFAQAsync(HelpArticle faq);
        Task<bool> DeleteFAQAsync(int id);

        // Interactions
        Task<bool> RecordArticleInteractionAsync(int articleId, string interactionType);

        // Contact Requests
        Task<IEnumerable<ContactRequest>> GetContactRequestsAsync();
        Task<ContactRequest> CreateContactRequestAsync(ContactRequest request);
        Task<ContactRequest> UpdateContactRequestAsync(ContactRequest request);
        Task<bool> DeleteContactRequestAsync(int id);
    }
}
