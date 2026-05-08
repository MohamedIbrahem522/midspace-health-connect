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
public class JobsController : ControllerBase
{
    private readonly AppDbContext _context;

    public JobsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/jobs
    [HttpGet]
    public async Task<IActionResult> GetJobs([FromQuery] string? specialty)
    {
        var query = _context.JobPostings
            .Include(j => j.Hospital)
            .Where(j => j.IsActive)
            .AsQueryable();

        if (!string.IsNullOrEmpty(specialty))
        {
            query = query.Where(j => j.Specialty.Contains(specialty));
        }

        var jobs = await query
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => new JobResponseDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                Specialty = j.Specialty,
                Location = j.Location,
                Salary = j.Salary,
                EmploymentType = j.EmploymentType,
                HospitalId = j.HospitalId,
                HospitalName = j.Hospital.HospitalName,
                IsActive = j.IsActive,
                ApplicantCount = j.Applications.Count,
                CreatedAt = j.CreatedAt
            })
            .ToListAsync();

        return Ok(jobs);
    }

    // POST: api/jobs
    [Authorize(Roles = "Hospital,Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var hospital = await _context.HospitalProfiles.FirstOrDefaultAsync(h => h.UserId == userId);

        if (hospital == null)
            return Forbid();

        var job = new JobPosting
        {
            Title = dto.Title,
            Description = dto.Description,
            Specialty = dto.Specialty,
            Location = dto.Location,
            Salary = dto.Salary,
            EmploymentType = dto.EmploymentType,
            HospitalId = hospital.Id
        };

        _context.JobPostings.Add(job);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetJobs), new { id = job.Id }, new { message = "Job created successfully", jobId = job.Id });
    }

    // GET: api/jobs/{id}
    [HttpGet("{id}")]
    public async Task<IActionResult> GetJob(int id)
    {
        var job = await _context.JobPostings
            .Include(j => j.Hospital)
            .FirstOrDefaultAsync(j => j.Id == id);

        if (job == null)
            return NotFound();

        var response = new JobResponseDto
        {
            Id = job.Id,
            Title = job.Title,
            Description = job.Description,
            Specialty = job.Specialty,
            Location = job.Location,
            Salary = job.Salary,
            EmploymentType = job.EmploymentType,
            HospitalId = job.HospitalId,
            HospitalName = job.Hospital.HospitalName,
            IsActive = job.IsActive,
            ApplicantCount = job.Applications.Count,
            CreatedAt = job.CreatedAt
        };

        return Ok(response);
    }

    // POST: api/jobs/{id}/apply
    [Authorize(Roles = "Doctor")]
    [HttpPost("{id}/apply")]
    public async Task<IActionResult> ApplyJob(int id, [FromBody] ApplyJobDto dto)
    {
        var doctorId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var doctor = await _context.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == doctorId);
        if (doctor == null) return BadRequest("Doctor profile not found.");

        var job = await _context.JobPostings.FindAsync(id);
        if (job == null) return NotFound("Job not found.");

        var application = new JobApplication
        {
            JobPostingId = id,
            DoctorId = doctor.Id,
            CoverLetter = dto.CoverLetter,
            ResumeUrl = dto.ResumeUrl,
            Status = ApplicationStatus.Pending
        };

        _context.JobApplications.Add(application);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Application submitted successfully" });
    }

    // GET: api/jobs/applications
    [Authorize]
    [HttpGet("applications")]
    public async Task<IActionResult> GetMyApplications()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return Unauthorized();

        // Doctor sees their own applications
        if (user.Role == UserRole.Doctor)
        {
            var doctor = await _context.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == userId);
            if (doctor == null) return Ok(new List<object>());

            var applications = await _context.JobApplications
                .Include(a => a.JobPosting)
                .Where(a => a.DoctorId == doctor.Id)
                .Select(a => new JobApplicationDto
                {
                    Id = a.Id,
                    JobPostingId = a.JobPostingId,
                    JobTitle = a.JobPosting.Title,
                    HospitalName = a.JobPosting.Hospital.HospitalName,
                    Location = a.JobPosting.Location,
                    EmploymentType = a.JobPosting.EmploymentType,
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor.User.Name,
                    Status = a.Status.ToString(),
                    AppliedAt = a.AppliedAt
                })
                .ToListAsync();
            return Ok(applications);
        }

        // Hospital sees applicants for their jobs
        if (user.Role == UserRole.Hospital)
        {
            var hospital = await _context.HospitalProfiles.FirstOrDefaultAsync(h => h.UserId == userId);
            if (hospital == null) return Ok(new List<object>());

            var applications = await _context.JobApplications
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.JobPosting)
                .Where(a => a.JobPosting.HospitalId == hospital.Id)
                .Select(a => new JobApplicationDto
                {
                    Id = a.Id,
                    JobPostingId = a.JobPostingId,
                    JobTitle = a.JobPosting.Title,
                    DoctorId = a.DoctorId,
                    DoctorName = a.Doctor.User.Name,
                    Status = a.Status.ToString(),
                    AppliedAt = a.AppliedAt
                })
                .ToListAsync();
            return Ok(applications);
        }

        return Ok(new List<object>());
    }

    // GET: api/jobs/my
    [Authorize(Roles = "Hospital")]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyJobs()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var hospital = await _context.HospitalProfiles.FirstOrDefaultAsync(h => h.UserId == userId);
        if (hospital == null) return Forbid();

        var jobs = await _context.JobPostings
            .Where(j => j.HospitalId == hospital.Id)
            .OrderByDescending(j => j.CreatedAt)
            .Select(j => new JobResponseDto
            {
                Id = j.Id,
                Title = j.Title,
                Description = j.Description,
                Specialty = j.Specialty,
                Location = j.Location,
                Salary = j.Salary,
                EmploymentType = j.EmploymentType,
                HospitalId = j.HospitalId,
                HospitalName = j.Hospital.HospitalName,
                IsActive = j.IsActive,
                ApplicantCount = j.Applications.Count,
                CreatedAt = j.CreatedAt
            })
            .ToListAsync();

        return Ok(jobs);
    }

    // DELETE: api/jobs/{id}
    [Authorize(Roles = "Hospital,Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var job = await _context.JobPostings.FindAsync(id);
        if (job == null) return NotFound();

        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _context.Users.FindAsync(userId);

        // Hospital can only delete their own jobs
        if (user!.Role == UserRole.Hospital)
        {
            var hospital = await _context.HospitalProfiles.FirstOrDefaultAsync(h => h.UserId == userId);
            if (hospital == null || job.HospitalId != hospital.Id)
                return Forbid();
        }

        var applications = await _context.JobApplications
            .Where(a => a.JobPostingId == id)
            .ToListAsync();
        _context.JobApplications.RemoveRange(applications);

        _context.JobPostings.Remove(job);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Job deleted successfully" });
    }

    // PUT: api/jobs/{id}/toggle-status
    [Authorize(Roles = "Hospital")]
    [HttpPut("{id}/toggle-status")]
    public async Task<IActionResult> ToggleJobStatus(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var hospital = await _context.HospitalProfiles.FirstOrDefaultAsync(h => h.UserId == userId);
        if (hospital == null) return Forbid();

        var job = await _context.JobPostings.FirstOrDefaultAsync(j => j.Id == id && j.HospitalId == hospital.Id);
        if (job == null) return NotFound();

        job.IsActive = !job.IsActive;
        await _context.SaveChangesAsync();
        return Ok(new { message = $"Job is now {(job.IsActive ? "active" : "inactive")}" });
    }

    // PUT: api/jobs/{id}/applications/{applicationId}/status
    [Authorize(Roles = "Hospital")]
    [HttpPut("{id}/applications/{applicationId}/status")]
    public async Task<IActionResult> UpdateApplicationStatus(int id, int applicationId, [FromBody] UpdateStatusDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var hospital = await _context.HospitalProfiles.FirstOrDefaultAsync(h => h.UserId == userId);
        if (hospital == null) return Forbid();

        var application = await _context.JobApplications
            .Include(a => a.JobPosting)
            .FirstOrDefaultAsync(a => a.Id == applicationId && a.JobPosting.HospitalId == hospital.Id);
        if (application == null) return NotFound();

        if (!Enum.TryParse<ApplicationStatus>(dto.Status, true, out var status))
            return BadRequest("Invalid status");

        application.Status = status;
        await _context.SaveChangesAsync();
        return Ok(new { message = $"Application {dto.Status}" });
    }
}
