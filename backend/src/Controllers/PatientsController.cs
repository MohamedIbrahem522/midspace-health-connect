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
public class PatientsController : ControllerBase
{
    private readonly AppDbContext _context;

    public PatientsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/patients/me
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users
            .Include(u => u.PatientProfile)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return NotFound("User not found.");

        if (user.Role == UserRole.Patient && user.PatientProfile != null)
        {
            var pp = user.PatientProfile;
            return Ok(new
            {
                id = pp.Id,
                userId = pp.UserId,
                name = user.Name,
                email = user.Email,
                phone = pp.Phone,
                dateOfBirth = pp.DateOfBirth,
                bloodType = pp.BloodType,
                medicalHistory = pp.MedicalHistory,
                profileImage = user.ProfileImage,
            });
        }

        return Ok(new { message = "Profile not yet set up" });
    }

    // PUT: api/patients/me
    [Authorize]
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.Include(u => u.PatientProfile).FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            return NotFound("User not found.");

        user.Name = dto.Name ?? user.Name;
        user.ProfileImage = dto.ProfileImage ?? user.ProfileImage;

        if (user.Role == UserRole.Patient && user.PatientProfile != null)
        {
            var pp = user.PatientProfile;
            pp.Phone = dto.Phone ?? pp.Phone;
            pp.BloodType = dto.BloodType ?? pp.BloodType;
            pp.MedicalHistory = dto.MedicalHistory ?? pp.MedicalHistory;
            if (dto.DateOfBirth != null && DateTime.TryParse(dto.DateOfBirth, out var dob))
                pp.DateOfBirth = dob;
        }

        await _context.SaveChangesAsync();

        return Ok(new { message = "Profile updated successfully" });
    }
}
