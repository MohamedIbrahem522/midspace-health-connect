using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class CreateDoctorDto
{
    public string? Specialty { get; set; }
    public string? Hospital { get; set; }
    public string? Bio { get; set; }
    public string? Phone { get; set; }
    public string? Location { get; set; }
    public decimal? ConsultationFee { get; set; }
    public int YearsOfExperience { get; set; }
    public string? MedicalLicenseNumber { get; set; }
}

public class DoctorResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Specialty { get; set; }
    public string? Hospital { get; set; }
    public string? Bio { get; set; }
    public string? Phone { get; set; }
    public bool IsVerified { get; set; }
    public int YearsOfExperience { get; set; }
    public string? Location { get; set; }
    public decimal? ConsultationFee { get; set; }
    public string? ProfileImage { get; set; }
    public string? Degree { get; set; }
    public string? University { get; set; }
    public string? Certifications { get; set; }
    public string? PreviousWorkplace { get; set; }
    public string? Skills { get; set; }
}

public class UpdateProfileDto
{
    public string? Name { get; set; }
    public string? Specialty { get; set; }
    public string? Hospital { get; set; }
    public string? Bio { get; set; }
    public string? Phone { get; set; }
    public string? ProfileImage { get; set; }
    public string? Location { get; set; }
    public int? YearsOfExperience { get; set; }
    public decimal? ConsultationFee { get; set; }
    public string? MedicalLicenseNumber { get; set; }
    public string? Degree { get; set; }
    public string? University { get; set; }
    public string? Certifications { get; set; }
    public string? PreviousWorkplace { get; set; }
    public string? Skills { get; set; }
    public string? DateOfBirth { get; set; }
    public string? BloodType { get; set; }
    public string? MedicalHistory { get; set; }
}
