namespace Travel_Odoo.Models.DTOs;

public class SavedDestinationDto
{
    public Guid Id { get; set; }
    public LocationDtos.CityDto City { get; set; } = null!;
    public DateTime SavedAt { get; set; }
}
