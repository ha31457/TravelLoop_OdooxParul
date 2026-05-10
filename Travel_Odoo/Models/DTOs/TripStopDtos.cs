using System.ComponentModel.DataAnnotations;

namespace Travel_Odoo.Models.DTOs;

public class TripStopDto
{
    public Guid Id { get; set; }
    public int OrderIndex { get; set; }
    public LocationDtos.CityDto City { get; set; } = null!;
    public DateOnly ArrivalDate { get; set; }
    public DateOnly DepartureDate { get; set; }
    public string? Notes { get; set; }
    public ICollection<StopActivityDto> Activities { get; set; } = new List<StopActivityDto>();
}

public class CreateTripStopRequestDto
{
    [Required]
    public Guid CityId { get; set; }

    [Required]
    public DateOnly ArrivalDate { get; set; }

    [Required]
    public DateOnly DepartureDate { get; set; }

    public int OrderIndex { get; set; } = 0;

    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdateTripStopRequestDto : CreateTripStopRequestDto { }

public class ReorderStopsRequestDto
{
    /// <summary>Ordered list of TripStop IDs reflecting the new sequence</summary>
    [Required, MinLength(1)]
    public IList<Guid> OrderedStopIds { get; set; } = new List<Guid>();
}
