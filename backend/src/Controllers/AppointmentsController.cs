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
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AppointmentsController(AppDbContext context)
    {
        _context = context;
    }

    // POST: api/appointments
    [HttpPost]
    public async Task<IActionResult> BookAppointment([FromBody] CreateAppointmentDto dto)
    {
        var patientId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == patientId);
        
        if (patient == null) return BadRequest("Patient profile not found. Please complete your profile.");

        var doctor = await _context.DoctorProfiles.FindAsync(dto.DoctorId);
        if (doctor == null) return NotFound("Doctor not found.");

        // Check availability
        var exists = await _context.Appointments.AnyAsync(a => 
            a.DoctorId == dto.DoctorId && 
            a.DateTime == dto.DateTime && 
            a.Status != AppointmentStatus.Cancelled);

        if (exists) return BadRequest("This time slot is already booked.");

        var appointment = new Appointment
        {
            PatientId = patient.Id,
            DoctorId = dto.DoctorId,
            DateTime = dto.DateTime,
            Notes = dto.Notes
        };

        _context.Appointments.Add(appointment);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Appointment booked successfully", id = appointment.Id });
    }

    // GET: api/appointments/my
    [HttpGet("my")]
    public async Task<IActionResult> GetMyAppointments()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);

        if (user?.Role == UserRole.Patient)
        {
            var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return Ok(new List<object>());

            var appointments = await _context.Appointments
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Where(a => a.PatientId == patient.Id)
                .Select(a => new AppointmentResponseDto
                {
                    Id = a.Id,
                    DoctorName = a.Doctor.User.Name,
                    Specialty = a.Doctor.Specialty,
                    DateTime = a.DateTime,
                    Status = a.Status.ToString(),
                    Notes = a.Notes
                })
                .ToListAsync();

            return Ok(appointments);
        }
        else if (user?.Role == UserRole.Doctor)
        {
            var doctor = await _context.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == userId);
            if (doctor == null) return Ok(new List<object>());

            var appointments = await _context.Appointments
                .Include(a => a.Patient).ThenInclude(p => p.User)
                .Where(a => a.DoctorId == doctor.Id)
                .Select(a => new AppointmentResponseDto
                {
                    Id = a.Id,
                    PatientName = a.Patient.User.Name,
                    DateTime = a.DateTime,
                    Status = a.Status.ToString(),
                    Notes = a.Notes
                })
                .ToListAsync();

            return Ok(appointments);
        }

        return Forbid();
    }

    // PUT: api/appointments/{id}/status
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        var appointment = await _context.Appointments.FindAsync(id);
        if (appointment == null) return NotFound();

        appointment.Status = Enum.Parse<AppointmentStatus>(dto.Status);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Status updated" });
    }
}

public class CreateAppointmentDto
{
    public int DoctorId { get; set; }
    public DateTime DateTime { get; set; }
    public string? Notes { get; set; }
}

public class AppointmentResponseDto
{
    public int Id { get; set; }
    public string? DoctorName { get; set; }
    public string? PatientName { get; set; }
    public string? Specialty { get; set; }
    public DateTime DateTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
}

public class UpdateStatusDto
{
    public string Status { get; set; } = string.Empty;
}
