using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public enum UserRole
{
    Doctor,
    Hospital,
    Patient,
    Admin
}

public class User
{
    [Key]
    public int Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string Email { get; set; } = string.Empty;
    
    public string PasswordHash { get; set; } = string.Empty;
    
    public UserRole Role { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsActive { get; set; } = true;
    
    public string? ProfileImage { get; set; }

    // Navigation Properties
    public DoctorProfile? DoctorProfile { get; set; }
    public HospitalProfile? HospitalProfile { get; set; }
    public PatientProfile? PatientProfile { get; set; }
    
    public List<Message> SentMessages { get; set; } = new();
    public List<Message> ReceivedMessages { get; set; } = new();
    public List<JobApplication> JobApplications { get; set; } = new();
}
