using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class JobPosting
{
    [Key]
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Salary { get; set; }
    public string EmploymentType { get; set; } = "Full-time";

    [ForeignKey("Hospital")]
    public int HospitalId { get; set; }
    public HospitalProfile Hospital { get; set; } = null!;

    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<JobApplication> Applications { get; set; } = new();
}
