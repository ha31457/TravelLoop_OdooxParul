using System.ComponentModel.DataAnnotations;

namespace Travel_Odoo.Models.DTOs;
public class ActivityImageDto
{
    public Guid Id { get; set; }
    public string ImageUrl { get; set; } = null!;
    public bool IsPrimary { get; set; }
    public int SortOrder { get; set; }
}

public class CityActivityDto
{
    public Guid Id { get; set; }
    public Guid CityId { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public string Category { get; set; } = null!;
    public decimal? EstimatedCost { get; set; }
    public int? DurationMinutes { get; set; }
    public string? ThumbnailUrl { get; set; }
    public int PopularityScore { get; set; }
    public ICollection<ActivityImageDto> Images { get; set; } = new List<ActivityImageDto>();
}

public class ActivitySearchRequestDto
{
    [Required]
    public Guid CityId { get; set; }

    [MaxLength(100)]
    public string? SearchTerm { get; set; }

    public ActivityCategory? Category { get; set; }

    public decimal? MaxCost { get; set; }

    /// <summary>Maximum duration in minutes</summary>
    public int? MaxDurationMinutes { get; set; }

    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
