using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateJobDto
{
    [Required]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    public string Description { get; set; } = string.Empty;
    
    [Required]
    public string Specialty { get; set; } = string.Empty;
    
    public string? Location { get; set; }
    public string? Salary { get; set; }
    public string EmploymentType { get; set; } = "Full-time";
    public int HospitalId { get; set; }
}

public class JobResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Specialty { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string? Salary { get; set; }
    public string EmploymentType { get; set; } = string.Empty;
    public int HospitalId { get; set; }
    public string HospitalName { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public int ApplicantCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class JobApplicationDto
{
    public int Id { get; set; }
    public int JobPostingId { get; set; }
    public string JobTitle { get; set; } = string.Empty;
    public string HospitalName { get; set; } = string.Empty;
    public string? Location { get; set; }
    public string EmploymentType { get; set; } = string.Empty;
    public int DoctorId { get; set; }
    public string DoctorName { get; set; } = string.Empty;
    public string? DoctorSpecialty { get; set; }
    public string? CoverLetter { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime AppliedAt { get; set; }
}

public class ApplyJobDto
{
    public string? CoverLetter { get; set; }
    public string? ResumeUrl { get; set; }
}
