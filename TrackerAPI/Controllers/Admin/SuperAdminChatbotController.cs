using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.DTOs.Core;
using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Controllers.Common;
using System.Text.Json;

namespace ElectricityTrackerAPI.Controllers.Admin
{
    [ApiController]
    [Route("api/admin/chatbot")]
    public class SuperAdminChatbotController : BaseController
    {
        public SuperAdminChatbotController(ApplicationDbContext context, ILogger<SuperAdminChatbotController> logger)
            : base(context, logger)
        {
        }

        // GET: api/admin/chatbot/statistics
        [HttpGet("statistics")]
        public async Task<ActionResult<ChatbotStatisticsDto>> GetStatistics()
        {
            try
            {
                var today = DateTime.UtcNow.Date;
                
                var activeConversations = await _context.ChatbotConversations
                    .Where(c => c.Status == "active")
                    .CountAsync();

                var totalConversations = await _context.ChatbotConversations.CountAsync();
                
                var resolvedConversations = await _context.ChatbotConversations
                    .Where(c => c.Status == "resolved")
                    .CountAsync();

                var dailyMessages = await _context.ChatbotMessages
                    .Where(m => m.Timestamp.Date == today)
                    .CountAsync();

                var totalMessages = await _context.ChatbotMessages.CountAsync();

                var conversationsWithSatisfaction = await _context.ChatbotConversations
                    .Where(c => c.Satisfaction.HasValue)
                    .ToListAsync();

                var averageSatisfaction = conversationsWithSatisfaction.Any() 
                    ? conversationsWithSatisfaction.Average(c => c.Satisfaction!.Value) 
                    : 0;

                var resolutionRate = totalConversations > 0 
                    ? (double)resolvedConversations / totalConversations * 100 
                    : 0;

                var totalQuickActions = await _context.QuickActions.CountAsync();
                var totalKnowledgeArticles = await _context.KnowledgeBaseArticles.CountAsync();

                var statistics = new ChatbotStatisticsDto
                {
                    ActiveConversations = activeConversations,
                    AverageSatisfaction = Math.Round(averageSatisfaction, 1),
                    ResolutionRate = Math.Round(resolutionRate, 1),
                    DailyMessages = dailyMessages,
                    TotalConversations = totalConversations,
                    TotalMessages = totalMessages,
                    TotalQuickActions = totalQuickActions,
                    TotalKnowledgeArticles = totalKnowledgeArticles
                };

                await LogSystemAction("Chatbot statistics retrieved", "Retrieved statistics for SuperAdmin", "Chatbot");

                return Ok(statistics);
            }
            catch (Exception ex)
            {
                await LogSystemAction("Error retrieving chatbot statistics", ex.Message, "Chatbot");
                return StatusCode(500, new { error = "Statistics retrieval failed" });
            }
        }

        // GET: api/admin/chatbot/conversations
        [HttpGet("conversations")]
        public async Task<ActionResult<IEnumerable<object>>> GetConversations(
            [FromQuery] string? status = null,
            [FromQuery] string? priority = null,
            [FromQuery] string? category = null,
            [FromQuery] int? tenantId = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            try
            {
                var query = _context.ChatbotConversations
                    .Include(c => c.User)
                    .Include(c => c.Tenant)
                    .Include(c => c.Messages)
                    .AsQueryable();

                // Apply filters
                if (!string.IsNullOrEmpty(status))
                    query = query.Where(c => c.Status == status);
                
                if (!string.IsNullOrEmpty(category))
                    query = query.Where(c => c.Category == category);
                
                if (tenantId.HasValue)
                    query = query.Where(c => c.TenantId == tenantId.Value);

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Apply pagination
                var conversations = await query
                    .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .Select(c => new
                    {
                        c.Id,
                        c.UserId,
                        UserName = c.User.FirstName + " " + c.User.LastName,
                        UserEmail = c.User.Email,
                        c.TenantId,
                        TenantName = c.Tenant.CompanyName,
                        c.Status,
                        c.Category,
                        c.MessageCount,
                        c.Satisfaction,
                        LastMessage = c.Messages.OrderByDescending(m => m.Timestamp).FirstOrDefault() != null 
                            ? c.Messages.OrderByDescending(m => m.Timestamp).First().Content 
                            : "",
                        LastMessageTime = c.LastMessageAt ?? c.CreatedAt,
                        Agent = "AI Bot",
                        Tags = c.Category != null ? new[] { c.Category } : new string[0]
                    })
                    .ToListAsync();

                await LogSystemAction("Chatbot conversations retrieved", "Retrieved " + conversations.Count + " conversations", "Chatbot");

                return Ok(new
                {
                    conversations,
                    totalCount,
                    page,
                    pageSize,
                    totalPages = (int)Math.Ceiling((double)totalCount / pageSize)
                });
            }
            catch (Exception ex)
            {
                await LogSystemAction("Error retrieving conversations", ex.Message, "Chatbot");
                return StatusCode(500, new { error = "Failed to retrieve conversations" });
            }
        }

        // GET: api/admin/chatbot/conversations/{id}/messages
        [HttpGet("conversations/{id}/messages")]
        public async Task<ActionResult<IEnumerable<ChatbotMessageDto>>> GetConversationMessages(int id)
        {
            try
            {
                var messages = await _context.ChatbotMessages
                    .Where(m => m.ConversationId == id)
                    .OrderBy(m => m.Timestamp)
                    .Select(m => new ChatbotMessageDto
                    {
                        Id = m.Id,
                        ConversationId = m.ConversationId,
                        Sender = m.Sender,
                        Content = m.Content,
                        Timestamp = m.Timestamp,
                        MessageType = m.MessageType,
                        IsRead = m.IsRead,
                        Metadata = m.Metadata
                    })
                    .ToListAsync();

                await LogSystemAction("Conversation messages retrieved", "Retrieved " + messages.Count + " messages for conversation " + id, "Chatbot");

                return Ok(messages);
            }
            catch (Exception ex)
            {
                await LogSystemAction("Error retrieving conversation messages", ex.Message, "Chatbot");
                return StatusCode(500, new { error = "Failed to retrieve messages" });
            }
        }

        // POST: api/admin/chatbot/conversations/{id}/messages
        [HttpPost("conversations/{id}/messages")]
        public async Task<ActionResult<ChatbotMessageDto>> SendMessage(int id, [FromBody] CreateChatbotMessageDto messageDto)
        {
            try
            {
                var conversation = await _context.ChatbotConversations.FindAsync(id);
                if (conversation == null)
                    return NotFound(new { error = "Conversation not found" });

                var message = new ChatbotMessage
                {
                    ConversationId = id,
                    Sender = messageDto.Sender,
                    Content = messageDto.Content,
                    Timestamp = DateTime.UtcNow,
                    MessageType = messageDto.MessageType ?? "text",
                    IsRead = false,
                    Metadata = messageDto.Metadata
                };

                _context.ChatbotMessages.Add(message);

                // Update conversation
                conversation.LastMessageAt = DateTime.UtcNow;
                conversation.MessageCount = await _context.ChatbotMessages
                    .Where(m => m.ConversationId == id)
                    .CountAsync() + 1;

                await _context.SaveChangesAsync();

                await LogSystemAction("Message sent", "Message sent to conversation " + id, "Chatbot");

                var responseDto = new ChatbotMessageDto
                {
                    Id = message.Id,
                    ConversationId = message.ConversationId,
                    Sender = message.Sender,
                    Content = message.Content,
                    Timestamp = message.Timestamp,
                    MessageType = message.MessageType,
                    IsRead = message.IsRead,
                    Metadata = message.Metadata
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                await LogSystemAction("Error sending message", ex.Message, "Chatbot");
                return StatusCode(500, new { error = "Failed to send message" });
            }
        }

        // GET: api/admin/chatbot/quick-actions
        [HttpGet("quick-actions")]
        public async Task<ActionResult<IEnumerable<QuickActionDto>>> GetQuickActions()
        {
            try
            {
                var quickActions = await _context.QuickActions
                    .Where(qa => qa.IsActive)
                    .OrderByDescending(qa => qa.UsageCount)
                    .Select(qa => new QuickActionDto
                    {
                        Id = qa.Id,
                        Title = qa.Title,
                        Description = qa.Description,
                        Category = qa.Category,
                        Icon = qa.Icon,
                        UsageCount = qa.UsageCount,
                        IsActive = qa.IsActive,
                        CreatedAt = qa.CreatedAt,
                        LastUsedAt = qa.LastUsedAt,
                        Priority = qa.Priority,
                        Metadata = qa.Metadata
                    })
                    .ToListAsync();

                await LogSystemAction("Quick actions retrieved", $"Retrieved {quickActions.Count} quick actions", "Chatbot");

                return Ok(quickActions);
            }
            catch (Exception ex)
            {
                await LogSystemAction("Error retrieving quick actions", ex.Message, "Chatbot");
                return StatusCode(500, new { error = "Failed to retrieve quick actions" });
            }
        }

        // POST: api/admin/chatbot/quick-actions
        [HttpPost("quick-actions")]
        public async Task<ActionResult<QuickActionDto>> CreateQuickAction([FromBody] CreateQuickActionDto dto)
        {
            try
            {
                var quickAction = new QuickAction
                {
                    Title = dto.Title,
                    Description = dto.Description,
                    Category = dto.Category,
                    Icon = dto.Icon,
                    UsageCount = 0,
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    Priority = dto.Priority,
                    Metadata = dto.Metadata
                };

                _context.QuickActions.Add(quickAction);
                await _context.SaveChangesAsync();

                await LogSystemAction("Quick action created", $"Created quick action: {dto.Title}", "Chatbot");

                var responseDto = new QuickActionDto
                {
                    Id = quickAction.Id,
                    Title = quickAction.Title,
                    Description = quickAction.Description,
                    Category = quickAction.Category,
                    Icon = quickAction.Icon,
                    UsageCount = quickAction.UsageCount,
                    IsActive = quickAction.IsActive,
                    CreatedAt = quickAction.CreatedAt,
                    LastUsedAt = quickAction.LastUsedAt,
                    Priority = quickAction.Priority,
                    Metadata = quickAction.Metadata
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                await LogSystemAction("Error creating quick action", ex.Message, "Chatbot");
                return StatusCode(500, new { error = "Failed to create quick action" });
            }
        }

        // PUT: api/admin/chatbot/quick-actions/{id}/use
        [HttpPut("quick-actions/{id}/use")]
        public async Task<ActionResult> UseQuickAction(int id)
        {
            try
            {
                var quickAction = await _context.QuickActions.FindAsync(id);
                if (quickAction == null)
                    return NotFound(new { error = "Quick action not found" });

                quickAction.UsageCount++;
                quickAction.LastUsedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                await LogSystemAction("Quick action used", $"Quick action used: {quickAction.Title}", "Chatbot");

                return Ok(new { message = "Quick action used successfully" });
            }
            catch (Exception ex)
            {
                await LogSystemAction("Error using quick action", ex.Message, "Chatbot");
                return StatusCode(500, new { error = "Failed to use quick action" });
            }
        }

        // GET: api/admin/chatbot/knowledge-base
        [HttpGet("knowledge-base")]
        public async Task<ActionResult<IEnumerable<KnowledgeBaseArticleDto>>> GetKnowledgeBaseArticles()
        {
            try
            {
                var articles = await _context.KnowledgeBaseArticles
                    .Where(kb => kb.IsPublished)
                    .OrderByDescending(kb => kb.Views)
                    .Select(kb => new KnowledgeBaseArticleDto
                    {
                        Id = kb.Id,
                        Title = kb.Title,
                        Category = kb.Category,
                        Content = kb.Content,
                        Views = kb.Views,
                        HelpfulCount = kb.HelpfulCount,
                        NotHelpfulCount = kb.NotHelpfulCount,
                        IsPublished = kb.IsPublished,
                        CreatedAt = kb.CreatedAt,
                        LastUpdatedAt = kb.LastUpdatedAt,
                        Author = kb.Author,
                        Summary = kb.Summary,
                        Tags = kb.Tags,
                        Metadata = kb.Metadata
                    })
                    .ToListAsync();

                await LogSystemAction("Knowledge base articles retrieved", $"Retrieved {articles.Count} articles", "Chatbot");

                return Ok(articles);
            }
            catch (Exception ex)
            {
                await LogSystemAction("Error retrieving knowledge base articles", ex.Message, "Chatbot");
                return StatusCode(500, new { error = "Failed to retrieve knowledge base articles" });
            }
        }

        // POST: api/admin/chatbot/knowledge-base
        [HttpPost("knowledge-base")]
        public async Task<ActionResult<KnowledgeBaseArticleDto>> CreateKnowledgeBaseArticle([FromBody] CreateKnowledgeBaseArticleDto dto)
        {
            try
            {
                var article = new KnowledgeBaseArticle
                {
                    Title = dto.Title,
                    Category = dto.Category,
                    Content = dto.Content,
                    Views = 0,
                    HelpfulCount = 0,
                    NotHelpfulCount = 0,
                    IsPublished = true,
                    CreatedAt = DateTime.UtcNow,
                    Author = dto.Author,
                    Summary = dto.Summary,
                    Tags = dto.Tags,
                    Metadata = dto.Metadata
                };

                _context.KnowledgeBaseArticles.Add(article);
                await _context.SaveChangesAsync();

                await LogSystemAction("Knowledge base article created", $"Created article: {dto.Title}", "Chatbot");

                var responseDto = new KnowledgeBaseArticleDto
                {
                    Id = article.Id,
                    Title = article.Title,
                    Category = article.Category,
                    Content = article.Content,
                    Views = article.Views,
                    HelpfulCount = article.HelpfulCount,
                    NotHelpfulCount = article.NotHelpfulCount,
                    IsPublished = article.IsPublished,
                    CreatedAt = article.CreatedAt,
                    LastUpdatedAt = article.LastUpdatedAt,
                    Author = article.Author,
                    Summary = article.Summary,
                    Tags = article.Tags,
                    Metadata = article.Metadata
                };

                return Ok(responseDto);
            }
            catch (Exception ex)
            {
                await LogSystemAction("Error creating knowledge base article", ex.Message, "Chatbot");
                return StatusCode(500, new { error = "Failed to create knowledge base article" });
            }
        }

        // PUT: api/admin/chatbot/knowledge-base/{id}/view
        [HttpPut("knowledge-base/{id}/view")]
        public async Task<ActionResult> ViewKnowledgeBaseArticle(int id)
        {
            try
            {
                var article = await _context.KnowledgeBaseArticles.FindAsync(id);
                if (article == null)
                    return NotFound(new { error = "Article not found" });

                article.Views++;

                await _context.SaveChangesAsync();

                await LogSystemAction("Knowledge base article viewed", $"Article viewed: {article.Title}", "Chatbot");

                return Ok(new { message = "Article view recorded" });
            }
            catch (Exception ex)
            {
                await LogSystemAction("Error recording article view", ex.Message, "Chatbot");
                return StatusCode(500, new { error = "Failed to record article view" });
            }
        }

        // PUT: api/admin/chatbot/conversations/{id}/status
        [HttpPut("conversations/{id}/status")]
        public async Task<ActionResult> UpdateConversationStatus(int id, [FromBody] UpdateConversationStatusDto dto)
        {
            try
            {
                var conversation = await _context.ChatbotConversations.FindAsync(id);
                if (conversation == null)
                    return NotFound(new { error = "Conversation not found" });

                conversation.Status = dto.Status;
                if (dto.Satisfaction.HasValue)
                    conversation.Satisfaction = dto.Satisfaction.Value;

                await _context.SaveChangesAsync();

                await LogSystemAction("Conversation status updated", $"Updated conversation {id} status to {dto.Status}", "Chatbot");

                return Ok(new { message = "Conversation status updated successfully" });
            }
            catch (Exception ex)
            {
                await LogSystemAction("Error updating conversation status", ex.Message, "Chatbot");
                return StatusCode(500, new { error = "Failed to update conversation status" });
            }
        }
    }

    public class UpdateConversationStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public int? Satisfaction { get; set; }
    }
} 