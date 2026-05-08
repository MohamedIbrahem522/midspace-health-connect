using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

public class PatientProfile
{
    [Key]
    public int Id { get; set; }

    [ForeignKey("User")]
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? MedicalHistory { get; set; }
    public string? BloodType { get; set; }
    
    public List<Appointment> Appointments { get; set; } = new();
}
