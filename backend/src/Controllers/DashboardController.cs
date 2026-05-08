using System.Security.Claims;
using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly DashboardService _dashboardService;

    public DashboardController(DashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboard()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var roleStr = User.FindFirstValue(ClaimTypes.Role);

        if (!Enum.TryParse<UserRole>(roleStr, true, out var role))
        {
            return BadRequest("Invalid user role");
        }

        var dashboard = await _dashboardService.GetDashboardAsync(userId, role);
        return Ok(dashboard);
    }
}
