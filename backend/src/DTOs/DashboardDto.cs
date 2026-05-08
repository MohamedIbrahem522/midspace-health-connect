namespace backend.DTOs;

public class DashboardStatsDto
{
    public List<StatItemDto> Stats { get; set; } = new();
    public List<ActivityItemDto> RecentActivity { get; set; } = new();
    public int ProfileCompletion { get; set; }
}

public class StatItemDto
{
    public string Title { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
    public string? Trend { get; set; }
    public bool? TrendUp { get; set; }
}

public class ActivityItemDto
{
    public string Text { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public string Color { get; set; } = "bg-primary";
}
