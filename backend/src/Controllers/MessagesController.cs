using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly AppDbContext _context;

    public MessagesController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/messages
    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] CreateMessageDto dto)
    {
        var senderId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        
        var receiver = await _context.Users.FindAsync(dto.ReceiverId);
        if (receiver == null) return BadRequest("Receiver not found.");

        var message = new Message
        {
            SenderId = senderId,
            ReceiverId = dto.ReceiverId,
            Content = dto.Content
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Message sent successfully", id = message.Id });
    }

    // GET: api/messages/conversations
    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var conversations = await _context.Messages
            .Where(m => m.SenderId == userId || m.ReceiverId == userId)
            .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
            .Select(g => new ConversationDto
            {
                UserId = g.Key,
                UserName = g.OrderByDescending(m => m.SentAt).First().SenderId == userId 
                    ? g.OrderByDescending(m => m.SentAt).First().Receiver.Name 
                    : g.OrderByDescending(m => m.SentAt).First().Sender.Name,
                ProfileImage = g.OrderByDescending(m => m.SentAt).First().SenderId == userId 
                    ? g.OrderByDescending(m => m.SentAt).First().Receiver.ProfileImage 
                    : g.OrderByDescending(m => m.SentAt).First().Sender.ProfileImage,
                LastMessage = g.OrderByDescending(m => m.SentAt).First().Content,
                LastMessageAt = g.OrderByDescending(m => m.SentAt).First().SentAt
            })
            .ToListAsync();

        return Ok(conversations);
    }

    // GET: api/messages/{userId}
    [HttpGet("{userId}")]
    public async Task<IActionResult> GetMessagesWithUser(int userId)
    {
        var currentUserId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var messages = await _context.Messages
            .Where(m => (m.SenderId == currentUserId && m.ReceiverId == userId) || 
                        (m.SenderId == userId && m.ReceiverId == currentUserId))
            .OrderBy(m => m.SentAt)
            .Select(m => new MessageResponseDto
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderName = m.Sender.Name,
                ReceiverId = m.ReceiverId,
                ReceiverName = m.Receiver.Name,
                Content = m.Content,
                SentAt = m.SentAt,
                IsRead = m.IsRead
            })
            .ToListAsync();

        // Mark received messages as read
        var unread = messages.Where(m => m.ReceiverId == currentUserId && !m.IsRead).ToList();
        foreach (var m in unread)
        {
            var messageEntity = await _context.Messages.FindAsync(m.Id);
            if (messageEntity != null) messageEntity.IsRead = true;
        }
        await _context.SaveChangesAsync();

        return Ok(messages);
    }
}
