using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using ElectricityTrackerAPI.Data;
using ElectricityTrackerAPI.Models.Core;
using ElectricityTrackerAPI.Services;
using ElectricityTrackerAPI.DTOs.Core;

namespace ElectricityTrackerAPI.Controllers.Core
{
    [ApiController]
    [Route("api/chatbot")]
    [Authorize]
    public class ChatbotController : Common.BaseController
    {
        private readonly IAIService _aiService;

        public ChatbotController(ApplicationDbContext context, ILogger<ChatbotController> logger, IAIService aiService) 
            : base(context, logger)
        {
            _aiService = aiService;
        }

        [HttpGet("conversations")]
        public async Task<ActionResult<List<ChatbotConversationDto>>> GetConversations()
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var currentTenantId = GetCurrentTenantId();

                if (!currentUserId.HasValue || !currentTenantId.HasValue)
                {
                    return Unauthorized();
                }

                var conversations = await _context.ChatbotConversations
                    .Include(c => c.Messages.OrderByDescending(m => m.Timestamp).Take(1))
                    .Where(c => c.UserId == currentUserId.Value && c.TenantId == currentTenantId.Value)
                    .OrderByDescending(c => c.LastMessageAt ?? c.CreatedAt)
                    .Take(50)
                    .ToListAsync();

                var conversationDtos = conversations.Select(c => new ChatbotConversationDto
                {
                    Id = c.Id,
                    Title = c.Title,
                    Status = c.Status,
                    Category = c.Category,
                    MessageCount = c.MessageCount,
                    Satisfaction = c.Satisfaction,
                    CreatedAt = c.CreatedAt,
                    LastMessageAt = c.LastMessageAt,
                    LastMessage = c.Messages.FirstOrDefault()?.Content ?? ""
                }).ToList();

                return Ok(conversationDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting conversations");
                return StatusCode(500, new { message = "Konuşmalar alınırken hata oluştu" });
            }
        }

        [HttpGet("conversations/{id}/messages")]
        public async Task<ActionResult<List<ChatbotMessageDto>>> GetConversationMessages(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var currentTenantId = GetCurrentTenantId();

                if (!currentUserId.HasValue || !currentTenantId.HasValue)
                {
                    return Unauthorized();
                }

                var conversation = await _context.ChatbotConversations
                    .FirstOrDefaultAsync(c => c.Id == id && c.UserId == currentUserId.Value && c.TenantId == currentTenantId.Value);

                if (conversation == null)
                {
                    return NotFound();
                }

                var messages = await _context.ChatbotMessages
                    .Where(m => m.ConversationId == id)
                    .OrderBy(m => m.Timestamp)
                    .ToListAsync();

                var messageDtos = messages.Select(m => new ChatbotMessageDto
                {
                    Id = m.Id,
                    Sender = m.Sender,
                    Content = m.Content,
                    Timestamp = m.Timestamp,
                    MessageType = m.MessageType,
                    IsRead = m.IsRead
                }).ToList();

                return Ok(messageDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting conversation messages");
                return StatusCode(500, new { message = "Mesajlar alınırken hata oluştu" });
            }
        }

        [HttpPost("conversations")]
        public async Task<ActionResult<ChatbotConversationDto>> CreateConversation([FromBody] CreateConversationDto dto)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var currentTenantId = GetCurrentTenantId();

                if (!currentUserId.HasValue || !currentTenantId.HasValue)
                {
                    return Unauthorized();
                }

                var conversation = new ChatbotConversation
                {
                    UserId = currentUserId.Value,
                    TenantId = currentTenantId.Value,
                    Title = dto.Title ?? "Yeni Konuşma",
                    Status = "active",
                    Category = dto.Category,
                    CreatedAt = DateTime.UtcNow
                };

                _context.ChatbotConversations.Add(conversation);
                await _context.SaveChangesAsync();

                // Log the conversation creation
                await LogSystemAction(
                    "Chatbot konuşması oluşturuldu",
                    $"Kullanıcı: {currentUserId}, Başlık: {conversation.Title}",
                    "Chatbot"
                );

                return Ok(new ChatbotConversationDto
                {
                    Id = conversation.Id,
                    Title = conversation.Title,
                    Status = conversation.Status,
                    Category = conversation.Category,
                    MessageCount = 0,
                    CreatedAt = conversation.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating conversation");
                return StatusCode(500, new { message = "Konuşma oluşturulurken hata oluştu" });
            }
        }

        [HttpPost("conversations/{id}/messages")]
        public async Task<ActionResult<ChatbotMessageDto>> SendMessage(int id, [FromBody] SendMessageDto dto)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var currentTenantId = GetCurrentTenantId();

                if (!currentUserId.HasValue || !currentTenantId.HasValue)
                {
                    return Unauthorized();
                }

                var conversation = await _context.ChatbotConversations
                    .FirstOrDefaultAsync(c => c.Id == id && c.UserId == currentUserId.Value && c.TenantId == currentTenantId.Value);

                if (conversation == null)
                {
                    return NotFound();
                }

                // Save user message
                var userMessage = new ChatbotMessage
                {
                    ConversationId = id,
                    Sender = "user",
                    Content = dto.Content,
                    Timestamp = DateTime.UtcNow,
                    MessageType = "text"
                };

                _context.ChatbotMessages.Add(userMessage);

                // Get AI response
                string aiResponse = "";
                try
                {
                    aiResponse = await _aiService.AnswerQuestionAsync(dto.Content, $"Conversation ID: {id}");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "AI service error");
                    aiResponse = "Üzgünüm, şu anda size yardımcı olamıyorum. Lütfen daha sonra tekrar deneyin.";
                }

                // Save AI response
                var botMessage = new ChatbotMessage
                {
                    ConversationId = id,
                    Sender = "bot",
                    Content = aiResponse,
                    Timestamp = DateTime.UtcNow,
                    MessageType = "text"
                };

                _context.ChatbotMessages.Add(botMessage);

                // Update conversation
                conversation.LastMessageAt = DateTime.UtcNow;
                conversation.MessageCount += 2;

                await _context.SaveChangesAsync();

                // Log the message
                await LogSystemAction(
                    "Chatbot mesajı gönderildi",
                    $"Konuşma: {id}, Kullanıcı: {currentUserId}",
                    "Chatbot"
                );

                return Ok(new ChatbotMessageDto
                {
                    Id = botMessage.Id,
                    Sender = botMessage.Sender,
                    Content = botMessage.Content,
                    Timestamp = botMessage.Timestamp,
                    MessageType = botMessage.MessageType
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error sending message");
                return StatusCode(500, new { message = "Mesaj gönderilirken hata oluştu" });
            }
        }

        [HttpPut("conversations/{id}/satisfaction")]
        public async Task<ActionResult> UpdateSatisfaction(int id, [FromBody] UpdateSatisfactionDto dto)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var currentTenantId = GetCurrentTenantId();

                if (!currentUserId.HasValue || !currentTenantId.HasValue)
                {
                    return Unauthorized();
                }

                var conversation = await _context.ChatbotConversations
                    .FirstOrDefaultAsync(c => c.Id == id && c.UserId == currentUserId.Value && c.TenantId == currentTenantId.Value);

                if (conversation == null)
                {
                    return NotFound();
                }

                conversation.Satisfaction = dto.Satisfaction;
                await _context.SaveChangesAsync();

                await LogSystemAction(
                    "Chatbot memnuniyet değerlendirmesi",
                    $"Konuşma: {id}, Memnuniyet: {dto.Satisfaction}/5",
                    "Chatbot"
                );

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating satisfaction");
                return StatusCode(500, new { message = "Memnuniyet güncellenirken hata oluştu" });
            }
        }

        [HttpDelete("conversations/{id}")]
        public async Task<ActionResult> DeleteConversation(int id)
        {
            try
            {
                var currentUserId = GetCurrentUserId();
                var currentTenantId = GetCurrentTenantId();

                if (!currentUserId.HasValue || !currentTenantId.HasValue)
                {
                    return Unauthorized();
                }

                var conversation = await _context.ChatbotConversations
                    .FirstOrDefaultAsync(c => c.Id == id && c.UserId == currentUserId.Value && c.TenantId == currentTenantId.Value);

                if (conversation == null)
                {
                    return NotFound();
                }

                _context.ChatbotConversations.Remove(conversation);
                await _context.SaveChangesAsync();

                await LogSystemAction(
                    "Chatbot konuşması silindi",
                    $"Konuşma: {id}, Kullanıcı: {currentUserId}",
                    "Chatbot"
                );

                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting conversation");
                return StatusCode(500, new { message = "Konuşma silinirken hata oluştu" });
            }
        }
    }
} 