using backend.Data;
using backend.DTOs;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class DashboardService
{
    private readonly AppDbContext _context;

    public DashboardService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardStatsDto> GetDashboardAsync(int userId, UserRole role)
    {
        var stats = new List<StatItemDto>();
        var activity = new List<ActivityItemDto>();
        int profileCompletion = 0;

        switch (role)
        {
            case UserRole.Doctor:
                stats = await GetDoctorStatsAsync(userId);
                activity = await GetDoctorActivityAsync(userId);
                profileCompletion = await GetDoctorProfileCompletionAsync(userId);
                break;
            case UserRole.Hospital:
                stats = await GetHospitalStatsAsync(userId);
                activity = await GetHospitalActivityAsync(userId);
                break;
            case UserRole.Patient:
                stats = await GetPatientStatsAsync(userId);
                activity = await GetPatientActivityAsync(userId);
                break;
            case UserRole.Admin:
                stats = await GetAdminStatsAsync();
                activity = await GetAdminActivityAsync();
                break;
        }

        return new DashboardStatsDto
        {
            Stats = stats,
            RecentActivity = activity,
            ProfileCompletion = profileCompletion
        };
    }

    private async Task<List<StatItemDto>> GetDoctorStatsAsync(int userId)
    {
        var doctor = await _context.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == userId);
        if (doctor == null) return new List<StatItemDto>();

        var applicationCount = await _context.JobApplications.CountAsync(a => a.DoctorId == doctor.Id);
        var unreadMessages = await _context.Messages.CountAsync(m => m.ReceiverId == userId && !m.IsRead);
        var profileViews = 156; 

        var thisWeekApps = await _context.JobApplications
            .CountAsync(a => a.DoctorId == doctor.Id && a.AppliedAt >= DateTime.UtcNow.AddDays(-7));

        return new List<StatItemDto>
        {
            new() { Title = "Applications", Value = applicationCount.ToString(), Trend = $"+{thisWeekApps} this week", TrendUp = thisWeekApps > 0 },
            new() { Title = "Messages", Value = unreadMessages.ToString(), Trend = unreadMessages > 0 ? $"{unreadMessages} new today" : "No new messages", TrendUp = unreadMessages > 0 },
            new() { Title = "Profile views", Value = profileViews.ToString(), Trend = "This month" },
            new() { Title = "Rating", Value = "N/A", Trend = "No reviews yet" }
        };
    }

    private async Task<List<ActivityItemDto>> GetDoctorActivityAsync(int userId)
    {
        var doctor = await _context.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == userId);
        var activity = new List<ActivityItemDto>();

        if (doctor != null)
        {
            var recentApps = await _context.JobApplications
                .Include(a => a.JobPosting)
                .Where(a => a.DoctorId == doctor.Id)
                .OrderByDescending(a => a.AppliedAt)
                .Take(2)
                .ToListAsync();

            foreach (var app in recentApps)
            {
                var timeAgo = GetTimeAgo(app.AppliedAt);
                activity.Add(new ActivityItemDto
                {
                    Text = $"Application for '{app.JobPosting.Title}' is {app.Status}",
                    Time = timeAgo,
                    Color = app.Status == ApplicationStatus.Accepted ? "bg-emerald-500" : app.Status == ApplicationStatus.Rejected ? "bg-red-500" : "bg-primary"
                });
            }
        }

        var messages = await _context.Messages
            .Where(m => m.ReceiverId == userId && !m.IsRead)
            .OrderByDescending(m => m.SentAt)
            .Take(2)
            .ToListAsync();

        foreach (var msg in messages)
        {
            activity.Add(new ActivityItemDto
            {
                Text = $"New message from {msg.Sender.Name}",
                Time = GetTimeAgo(msg.SentAt),
                Color = "bg-blue-500"
            });
        }

        return activity.OrderByDescending(a => a.Time).Take(5).ToList();
    }

    private async Task<int> GetDoctorProfileCompletionAsync(int userId)
    {
        var doctor = await _context.DoctorProfiles.FirstOrDefaultAsync(d => d.UserId == userId);
        if (doctor == null) return 0;

        int score = 0;
        int total = 6;

        if (!string.IsNullOrEmpty(doctor.Specialty)) score++;
        if (!string.IsNullOrEmpty(doctor.Bio)) score++;
        if (!string.IsNullOrEmpty(doctor.Phone)) score++;
        if (!string.IsNullOrEmpty(doctor.Location)) score++;
        if (doctor.YearsOfExperience > 0) score++;
        if (doctor.IsVerified) score++;

        return (int)Math.Round((double)score / total * 100);
    }

    private async Task<List<StatItemDto>> GetHospitalStatsAsync(int userId)
    {
        var hospital = await _context.HospitalProfiles.FirstOrDefaultAsync(h => h.UserId == userId);
        if (hospital == null) return new List<StatItemDto>();

        var activeListings = await _context.JobPostings.CountAsync(j => j.HospitalId == hospital.Id && j.IsActive);
        var totalApplicants = await _context.JobApplications
            .Where(a => a.JobPosting.HospitalId == hospital.Id)
            .CountAsync();
        var unreadMessages = await _context.Messages.CountAsync(m => m.ReceiverId == userId && !m.IsRead);
        var hiredCount = await _context.JobApplications
            .CountAsync(a => a.JobPosting.HospitalId == hospital.Id && a.Status == ApplicationStatus.Accepted);

        var thisWeekApps = await _context.JobApplications
            .CountAsync(a => a.JobPosting.HospitalId == hospital.Id && a.AppliedAt >= DateTime.UtcNow.AddDays(-7));

        return new List<StatItemDto>
        {
            new() { Title = "Active listings", Value = activeListings.ToString(), Trend = "Currently active" },
            new() { Title = "Applicants", Value = totalApplicants.ToString(), Trend = $"+{thisWeekApps} this week", TrendUp = thisWeekApps > 0 },
            new() { Title = "Messages", Value = unreadMessages.ToString(), Trend = unreadMessages > 0 ? $"{unreadMessages} new today" : "No new messages", TrendUp = unreadMessages > 0 },
            new() { Title = "Hired", Value = hiredCount.ToString(), Trend = "Total hires" }
        };
    }

    private async Task<List<ActivityItemDto>> GetHospitalActivityAsync(int userId)
    {
        var hospital = await _context.HospitalProfiles.FirstOrDefaultAsync(h => h.UserId == userId);
        var activity = new List<ActivityItemDto>();

        if (hospital != null)
        {
            var recentApps = await _context.JobApplications
                .Include(a => a.Doctor).ThenInclude(d => d.User)
                .Include(a => a.JobPosting)
                .Where(a => a.JobPosting.HospitalId == hospital.Id)
                .OrderByDescending(a => a.AppliedAt)
                .Take(3)
                .ToListAsync();

            foreach (var app in recentApps)
            {
                activity.Add(new ActivityItemDto
                {
                    Text = $"{app.Doctor.User.Name} applied for '{app.JobPosting.Title}'",
                    Time = GetTimeAgo(app.AppliedAt),
                    Color = "bg-primary"
                });
            }
        }

        return activity;
    }

    private async Task<List<StatItemDto>> GetPatientStatsAsync(int userId)
    {
        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (patient == null) return new List<StatItemDto>();

        var doctorCount = await _context.DoctorProfiles.CountAsync();
        var upcomingAppointments = await _context.Appointments
            .CountAsync(a => a.PatientId == patient.Id && a.Status == AppointmentStatus.Confirmed);
        var totalAppointments = await _context.Appointments.CountAsync(a => a.PatientId == patient.Id);
        var unreadMessages = await _context.Messages.CountAsync(m => m.ReceiverId == userId && !m.IsRead);

        return new List<StatItemDto>
        {
            new() { Title = "Available doctors", Value = doctorCount.ToString(), Trend = "In network" },
            new() { Title = "Appointments", Value = $"{upcomingAppointments}/{totalAppointments}", Trend = "Upcoming / Total" },
            new() { Title = "Messages", Value = unreadMessages.ToString(), Trend = unreadMessages > 0 ? "New messages" : "No new messages", TrendUp = unreadMessages > 0 },
            new() { Title = "Saved doctors", Value = "0", Trend = "Feature coming soon" }
        };
    }

    private async Task<List<ActivityItemDto>> GetPatientActivityAsync(int userId)
    {
        var patient = await _context.PatientProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        var activity = new List<ActivityItemDto>();

        if (patient != null)
        {
            var appointments = await _context.Appointments
                .Include(a => a.Doctor)
                .Where(a => a.PatientId == patient.Id)
                .OrderByDescending(a => a.DateTime)
                .Take(3)
                .ToListAsync();

            foreach (var appt in appointments)
            {
                var statusText = appt.Status switch
                {
                    AppointmentStatus.Confirmed => "confirmed",
                    AppointmentStatus.Pending => "pending",
                    AppointmentStatus.Cancelled => "cancelled",
                    _ => "completed"
                };

                activity.Add(new ActivityItemDto
                {
                    Text = $"Appointment with Dr. {appt.Doctor.User.Name} {statusText}",
                    Time = GetTimeAgo(appt.DateTime),
                    Color = appt.Status == AppointmentStatus.Confirmed ? "bg-emerald-500" : appt.Status == AppointmentStatus.Pending ? "bg-amber-500" : "bg-muted-foreground"
                });
            }
        }

        return activity;
    }

    private async Task<List<StatItemDto>> GetAdminStatsAsync()
    {
        var totalUsers = await _context.Users.CountAsync(u => u.IsActive);
        var totalDoctors = await _context.DoctorProfiles.CountAsync();
        var verifiedDoctors = await _context.DoctorProfiles.CountAsync(d => d.IsVerified);
        var totalPatients = await _context.PatientProfiles.CountAsync();
        var totalHospitals = await _context.HospitalProfiles.CountAsync();
        var openJobs = await _context.JobPostings.CountAsync(j => j.IsActive);
        var totalApplications = await _context.JobApplications.CountAsync();
        var totalAppointments = await _context.Appointments.CountAsync();
        var totalMessages = await _context.Messages.CountAsync();

        var newUsersThisMonth = await _context.Users
            .CountAsync(u => u.IsActive && u.CreatedAt >= DateTime.UtcNow.AddMonths(-1));
        var newJobsThisMonth = await _context.JobPostings
            .CountAsync(j => j.CreatedAt >= DateTime.UtcNow.AddMonths(-1));
        var newAppsThisMonth = await _context.JobApplications
            .CountAsync(a => a.AppliedAt >= DateTime.UtcNow.AddMonths(-1));
        var newAptsThisMonth = await _context.Appointments
            .CountAsync(a => a.CreatedAt >= DateTime.UtcNow.AddMonths(-1));

        return new List<StatItemDto>
        {
            new() { Title = "Total users", Value = totalUsers.ToString(), Trend = $"+{newUsersThisMonth} this month", TrendUp = newUsersThisMonth > 0 },
            new() { Title = "Doctors", Value = $"{verifiedDoctors}/{totalDoctors}", Trend = "Verified / Total" },
            new() { Title = "Patients", Value = totalPatients.ToString(), Trend = "Registered" },
            new() { Title = "Hospitals", Value = totalHospitals.ToString(), Trend = "Registered" },
            new() { Title = "Open jobs", Value = openJobs.ToString(), Trend = $"+{newJobsThisMonth} this month", TrendUp = newJobsThisMonth > 0 },
            new() { Title = "Applications", Value = totalApplications.ToString(), Trend = $"+{newAppsThisMonth} this month", TrendUp = newAppsThisMonth > 0 },
            new() { Title = "Appointments", Value = totalAppointments.ToString(), Trend = $"+{newAptsThisMonth} this month", TrendUp = newAptsThisMonth > 0 },
            new() { Title = "Messages", Value = totalMessages.ToString(), Trend = "Total sent" },
        };
    }

    private async Task<List<ActivityItemDto>> GetAdminActivityAsync()
    {
        var activity = new List<ActivityItemDto>();

        // Recent user registrations
        var newUsers = await _context.Users
            .OrderByDescending(u => u.CreatedAt)
            .Take(3)
            .ToListAsync();

        foreach (var user in newUsers)
        {
            activity.Add(new ActivityItemDto
            {
                Text = $"New user registered: {user.Name} ({user.Role})",
                Time = GetTimeAgo(user.CreatedAt),
                Color = "bg-blue-500"
            });
        }

        // Recent job postings
        var newJobs = await _context.JobPostings
            .Include(j => j.Hospital)
            .OrderByDescending(j => j.CreatedAt)
            .Take(3)
            .ToListAsync();

        foreach (var job in newJobs)
        {
            activity.Add(new ActivityItemDto
            {
                Text = $"New job posted: {job.Title} at {job.Hospital.HospitalName}",
                Time = GetTimeAgo(job.CreatedAt),
                Color = "bg-emerald-500"
            });
        }

        // Recent applications
        var newApps = await _context.JobApplications
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .Include(a => a.JobPosting)
            .OrderByDescending(a => a.AppliedAt)
            .Take(3)
            .ToListAsync();

        foreach (var app in newApps)
        {
            activity.Add(new ActivityItemDto
            {
                Text = $"{app.Doctor.User.Name} applied for {app.JobPosting.Title}",
                Time = GetTimeAgo(app.AppliedAt),
                Color = "bg-amber-500"
            });
        }

        // Recent appointments
        var newApts = await _context.Appointments
            .Include(a => a.Doctor).ThenInclude(d => d.User)
            .Include(a => a.Patient).ThenInclude(p => p.User)
            .OrderByDescending(a => a.CreatedAt)
            .Take(3)
            .ToListAsync();

        foreach (var apt in newApts)
        {
            activity.Add(new ActivityItemDto
            {
                Text = $"Appointment: {apt.Patient.User.Name} with Dr. {apt.Doctor.User.Name} ({apt.Status})",
                Time = GetTimeAgo(apt.CreatedAt),
                Color = "bg-purple-500"
            });
        }

        return activity.OrderByDescending(a => a.Time).Take(8).ToList();
    }

    private static string GetTimeAgo(DateTime dateTime)
    {
        var diff = DateTime.UtcNow - dateTime;
        if (diff.TotalMinutes < 1) return "Just now";
        if (diff.TotalMinutes < 60) return $"{(int)diff.TotalMinutes}m ago";
        if (diff.TotalHours < 24) return $"{(int)diff.TotalHours}h ago";
        if (diff.TotalDays < 7) return $"{(int)diff.TotalDays}d ago";
        return dateTime.ToString("MMM dd");
    }
}
