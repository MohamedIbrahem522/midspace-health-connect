using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class Message
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("Sender")]
    public int SenderId { get; set; }
    public User Sender { get; set; } = null!;

    [ForeignKey("Receiver")]
    public int ReceiverId { get; set; }
    public User Receiver { get; set; } = null!;

    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    public bool IsRead { get; set; } = false;
}
