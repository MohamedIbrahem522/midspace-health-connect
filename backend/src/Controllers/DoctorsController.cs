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
public class DoctorsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<DoctorsController> _logger;

    public DoctorsController(AppDbContext context, ILogger<DoctorsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/doctors
    [HttpGet]
    public async Task<IActionResult> GetDoctors([FromQuery] string? specialty, [FromQuery] string? search)
    {
        var query = _context.DoctorProfiles
            .Include(d => d.User)
            .AsQueryable();

        if (!string.IsNullOrEmpty(specialty))
        {
            query = query.Where(d => d.Specialty != null && d.Specialty.Contains(specialty));
        }

        if (!string.IsNullOrEmpty(search))
        {
            query = query.Where(d => d.User.Name.Contains(search) || (d.Hospital != null && d.Hospital.Contains(search)));
        }

        var doctors = await query.Select(d => new DoctorResponseDto
        {
            Id = d.Id,
            UserId = d.UserId,
            Name = d.User.Name,
            Email = d.User.Email,
            Specialty = d.Specialty,
            Hospital = d.Hospital,
            Bio = d.Bio,
            Phone = d.Phone,
            IsVerified = d.IsVerified,
            YearsOfExperience = d.YearsOfExperience,
            Location = d.Location,
            ConsultationFee = d.ConsultationFee,
            ProfileImage = d.User.ProfileImage,
            Degree = d.Degree,
            University = d.University,
            Certifications = d.Certifications,
            PreviousWorkplace = d.PreviousWorkplace,
            Skills = d.Skills
        }).ToListAsync();

        return Ok(doctors);
    }

    // GET: api/doctors/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetDoctor(int id)
    {
        var doctor = await _context.DoctorProfiles
            .Include(d => d.User)
            .FirstOrDefaultAsync(d => d.Id == id || d.UserId == id);

        if (doctor == null)
            return NotFound("Doctor not found.");

        return Ok(new DoctorResponseDto
        {
            Id = doctor.Id,
            UserId = doctor.UserId,
            Name = doctor.User.Name,
            Email = doctor.User.Email,
            Specialty = doctor.Specialty,
            Hospital = doctor.Hospital,
            Bio = doctor.Bio,
            Phone = doctor.Phone,
            IsVerified = doctor.IsVerified,
            YearsOfExperience = doctor.YearsOfExperience,
            Location = doctor.Location,
            ConsultationFee = doctor.ConsultationFee,
            ProfileImage = doctor.User.ProfileImage,
            Degree = doctor.Degree,
            University = doctor.University,
            Certifications = doctor.Certifications,
            PreviousWorkplace = doctor.PreviousWorkplace,
            Skills = doctor.Skills
        });
    }

    // GET: api/doctors/me
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users
            .Include(u => u.DoctorProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return NotFound("User not found.");

        if (user.Role == UserRole.Doctor && user.DoctorProfile != null)
        {
            var dp = user.DoctorProfile;
            return Ok(new DoctorResponseDto
            {
                Id = dp.Id,
                UserId = dp.UserId,
                Name = user.Name,
                Email = user.Email,
                Specialty = dp.Specialty,
                Hospital = dp.Hospital,
                Bio = dp.Bio,
                Phone = dp.Phone,
                IsVerified = dp.IsVerified,
                YearsOfExperience = dp.YearsOfExperience,
                Location = dp.Location,
                ConsultationFee = dp.ConsultationFee,
                ProfileImage = user.ProfileImage,
                Degree = dp.Degree,
                University = dp.University,
                Certifications = dp.Certifications,
                PreviousWorkplace = dp.PreviousWorkplace,
                Skills = dp.Skills,
            });
        }

        return Ok(new { message = "Profile not yet set up" });
    }

    // PUT: api/doctors/me
    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.Include(u => u.DoctorProfile).FirstOrDefaultAsync(u => u.Id == userId);
        
        if (user == null)
            return NotFound("User not found.");

        user.Name = dto.Name ?? user.Name;
        user.ProfileImage = dto.ProfileImage ?? user.ProfileImage;

        if (user.Role == UserRole.Doctor && user.DoctorProfile != null)
        {
            var dp = user.DoctorProfile;
            dp.Specialty = dto.Specialty ?? dp.Specialty;
            dp.Hospital = dto.Hospital ?? dp.Hospital;
            dp.Bio = dto.Bio ?? dp.Bio;
            dp.Phone = dto.Phone ?? dp.Phone;
            dp.Location = dto.Location ?? dp.Location;
            dp.MedicalLicenseNumber = dto.MedicalLicenseNumber ?? dp.MedicalLicenseNumber;
            if (dto.YearsOfExperience.HasValue)
                dp.YearsOfExperience = dto.YearsOfExperience.Value;
            if (dto.ConsultationFee.HasValue)
                dp.ConsultationFee = dto.ConsultationFee.Value;
            dp.Degree = dto.Degree ?? dp.Degree;
            dp.University = dto.University ?? dp.University;
            dp.Certifications = dto.Certifications ?? dp.Certifications;
            dp.PreviousWorkplace = dto.PreviousWorkplace ?? dp.PreviousWorkplace;
            dp.Skills = dto.Skills ?? dp.Skills;
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Profile updated successfully" });
    }
}
