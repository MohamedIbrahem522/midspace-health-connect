using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class DoctorProfile
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string? Specialty { get; set; }
    public string? Hospital { get; set; }
    public string? Bio { get; set; }
    public string? Phone { get; set; }
    public bool IsVerified { get; set; } = false;
    public int YearsOfExperience { get; set; }
    public string? MedicalLicenseNumber { get; set; }
    public string? Location { get; set; }
    public decimal? ConsultationFee { get; set; }
    public string? Degree { get; set; }
    public string? University { get; set; }
    public string? Certifications { get; set; }
    public string? PreviousWorkplace { get; set; }
    public string? Skills { get; set; }

    public List<JobApplication> Applications { get; set; } = new();
    public List<Appointment> Appointments { get; set; } = new();
}
