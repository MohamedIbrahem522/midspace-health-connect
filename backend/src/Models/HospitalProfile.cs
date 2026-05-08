using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class HospitalProfile
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string HospitalName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Location { get; set; }
    public string? Website { get; set; }
    public string? Phone { get; set; }
    public string? LogoUrl { get; set; }

    public List<JobPosting> JobPostings { get; set; } = new();
}
