using System.Text;
using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Auth
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "SuperSecretKey12345678901234567890"))
        };
    });

// CORS (Allow frontend to access)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.SetIsOriginAllowed(origin =>
        {
            if (string.IsNullOrEmpty(origin)) return false;
            // Allow localhost on any port
            if (origin.StartsWith("http://localhost") || origin.StartsWith("https://localhost"))
                return true;
            // Allow Vercel deployment
            if (origin.Contains("vercel.app"))
                return true;
            return false;
        })
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Apply migrations on startup (Dev only)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Configure pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Seed some data if needed
SeedData(app);

app.Run();

void SeedData(IApplicationBuilder appBuilder)
{
    using var scope = appBuilder.ApplicationServices.CreateScope();
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    if (!context.Users.Any())
    {
        // Admin
        context.Users.Add(new User { Name = "Admin", Email = "admin@midspace.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123"), Role = UserRole.Admin });
        
        // Doctor
        var doctor = new User { Name = "Dr. Sara Hassan", Email = "doctor@midspace.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor123"), Role = UserRole.Doctor };
        context.Users.Add(doctor);
        context.SaveChanges();
        context.DoctorProfiles.Add(new DoctorProfile { UserId = doctor.Id, Specialty = "Cardiologist", Hospital = "Cairo Medical Center", Bio = "Experienced Cardiologist.", IsVerified = true, YearsOfExperience = 10 });

        // Patient
        var patient = new User { Name = "Ahmed Khaled", Email = "patient@midspace.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Patient123"), Role = UserRole.Patient };
        context.Users.Add(patient);
        context.SaveChanges();
        context.PatientProfiles.Add(new PatientProfile { UserId = patient.Id, Phone = "+201234567890" });
    }

    // Add hospital account + jobs if not exists
    if (!context.Users.Any(u => u.Email == "hospital@midspace.com"))
    {
        var hospital = new User { Name = "Cairo Medical Center", Email = "hospital@midspace.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Hospital123"), Role = UserRole.Hospital };
        context.Users.Add(hospital);
        context.SaveChanges();
        var hospitalProfile = new HospitalProfile { UserId = hospital.Id, HospitalName = "Cairo Medical Center", Location = "Cairo, Egypt", Phone = "+20234567890", Description = "Leading medical center in Egypt" };
        context.HospitalProfiles.Add(hospitalProfile);
        context.SaveChanges();

        context.JobPostings.AddRange(
            new JobPosting { Title = "Senior Cardiologist", Description = "We are looking for an experienced cardiologist to join our team.", Specialty = "Cardiology", Location = "Cairo, Egypt", EmploymentType = "Full-time", Salary = "200,000-300,000 EGP", HospitalId = hospitalProfile.Id, IsActive = true },
            new JobPosting { Title = "Pediatrician", Description = "Join our pediatrics department.", Specialty = "Pediatrics", Location = "Cairo, Egypt", EmploymentType = "Full-time", Salary = "150,000-250,000 EGP", HospitalId = hospitalProfile.Id, IsActive = true },
            new JobPosting { Title = "Dermatology Consultant", Description = "Part-time dermatology consultant needed.", Specialty = "Dermatology", Location = "Alexandria, Egypt", EmploymentType = "Part-time", Salary = "100,000-180,000 EGP", HospitalId = hospitalProfile.Id, IsActive = true }
        );
        context.SaveChanges();
    }

    // Extra seed accounts for testing
    if (!context.Users.Any(u => u.Email == "doctor2@midspace.com"))
    {
        // Second doctor
        var doc2 = new User { Name = "Dr. Omar Mahmoud", Email = "doctor2@midspace.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor123"), Role = UserRole.Doctor };
        context.Users.Add(doc2);
        context.SaveChanges();
        context.DoctorProfiles.Add(new DoctorProfile { UserId = doc2.Id, Specialty = "Pediatrics", Hospital = "Alexandria Children's Hospital", Bio = "Experienced pediatrician specialized in child health.", IsVerified = true, YearsOfExperience = 8, Location = "Alexandria, Egypt", Phone = "+201234567891", Degree = "MBBS", University = "Alexandria University" });

        // Third doctor
        var doc3 = new User { Name = "Dr. Layla Ibrahim", Email = "doctor3@midspace.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor123"), Role = UserRole.Doctor };
        context.Users.Add(doc3);
        context.SaveChanges();
        context.DoctorProfiles.Add(new DoctorProfile { UserId = doc3.Id, Specialty = "Dermatology", Hospital = "Cairo Skin Institute", Bio = "Consultant dermatologist with expertise in medical and cosmetic dermatology.", IsVerified = true, YearsOfExperience = 12, Location = "Cairo, Egypt", Phone = "+201234567892", Degree = "MD", University = "Cairo University", ConsultationFee = 500 });

        // Fourth doctor
        var doc4 = new User { Name = "Dr. Ahmed Nasser", Email = "doctor4@midspace.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Doctor123"), Role = UserRole.Doctor };
        context.Users.Add(doc4);
        context.SaveChanges();
        context.DoctorProfiles.Add(new DoctorProfile { UserId = doc4.Id, Specialty = "Neurology", Hospital = "Cairo Medical Center", Bio = "Specialist in neurological disorders and stroke management.", IsVerified = false, YearsOfExperience = 15, Location = "Cairo, Egypt", Phone = "+201234567893", Degree = "MD", University = "Ain Shams University", ConsultationFee = 800 });

        // Second hospital
        var hosp2 = new User { Name = "Alexandria Children's Hospital", Email = "hospital2@midspace.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Hospital123"), Role = UserRole.Hospital };
        context.Users.Add(hosp2);
        context.SaveChanges();
        var hosp2Profile = new HospitalProfile { UserId = hosp2.Id, HospitalName = "Alexandria Children's Hospital", Location = "Alexandria, Egypt", Phone = "+20345678901", Description = "Specialized pediatric care hospital" };
        context.HospitalProfiles.Add(hosp2Profile);
        context.SaveChanges();

        context.JobPostings.AddRange(
            new JobPosting { Title = "Pediatric Surgeon", Description = "Seeking a skilled pediatric surgeon.", Specialty = "Pediatric Surgery", Location = "Alexandria, Egypt", EmploymentType = "Full-time", Salary = "250,000-350,000 EGP", HospitalId = hosp2Profile.Id, IsActive = true },
            new JobPosting { Title = "Child Psychologist", Description = "Join our mental health team.", Specialty = "Child Psychology", Location = "Alexandria, Egypt", EmploymentType = "Part-time", Salary = "100,000-180,000 EGP", HospitalId = hosp2Profile.Id, IsActive = true }
        );
        context.SaveChanges();

        // Second patient
        var pat2 = new User { Name = "Mariam Youssef", Email = "patient2@midspace.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Patient123"), Role = UserRole.Patient };
        context.Users.Add(pat2);
        context.SaveChanges();
        context.PatientProfiles.Add(new PatientProfile { UserId = pat2.Id, Phone = "+201234567894", DateOfBirth = new DateTime(1992, 8, 22), BloodType = "B+", MedicalHistory = "Asthma" });
    }
}
