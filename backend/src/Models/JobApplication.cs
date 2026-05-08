using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public enum ApplicationStatus
{
    Pending,
    Reviewed,
    Accepted,
    Rejected
}

public class JobApplication
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("JobPosting")]
    public int JobPostingId { get; set; }
    public JobPosting JobPosting { get; set; } = null!;

    [ForeignKey("Doctor")]
    public int DoctorId { get; set; }
    public DoctorProfile Doctor { get; set; } = null!;

    public string? CoverLetter { get; set; }
    public string? ResumeUrl { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
    public DateTime AppliedAt { get; set; } = DateTime.UtcNow;
}
