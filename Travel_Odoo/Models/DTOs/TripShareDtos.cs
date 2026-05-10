using System.ComponentModel.DataAnnotations;

namespace Travel_Odoo.Models.DTOs;

public class TripShareDto
{
    public Guid Id { get; set; }
    public string SharedWithEmail { get; set; } = null!;
    public string Permission { get; set; } = null!;
    public DateTime SharedAt { get; set; }
}

public class CreateTripShareRequestDto
{
    [Required, EmailAddress, MaxLength(255)]
    public string SharedWithEmail { get; set; } = null!;

    public SharePermission Permission { get; set; } = SharePermission.ReadOnly;
}
