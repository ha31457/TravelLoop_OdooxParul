using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Travel_Odoo.Models.DTOs;

public class StopActivityDto
{
    public Guid Id { get; set; }
    public CityActivityDto Activity { get; set; } = null!;
    public DateOnly? PlannedDate { get; set; }
    public TimeOnly? PlannedTime { get; set; }
    public decimal? ActualCost { get; set; }
    public bool IsCompleted { get; set; }
    public string? Notes { get; set; }
}

public class AddStopActivityRequestDto
{
    [Required]
    public Guid CityActivityId { get; set; }

    public DateOnly? PlannedDate { get; set; }
    public TimeOnly? PlannedTime { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal? ActualCost { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdateStopActivityRequestDto : AddStopActivityRequestDto
{
    public bool IsCompleted { get; set; } = false;
}
