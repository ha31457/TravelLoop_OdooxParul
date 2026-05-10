using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Travel_Odoo.Models;


public class User : IdentityUser<Guid>
{
    public string? DesiredRole { get; set; }
    public string? AvatarUrl { get; set; }
    
    [Required, MaxLength(100)]
    public string FullName { get; set; } = null!;

    [MaxLength(500)]
    public string? ProfilePhotoUrl { get; set; }

    [MaxLength(10)]
    public string LanguagePreference { get; set; } = "en";

    public bool IsActive { get; set; } = true;

    public bool IsAdmin { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // ── Navigation properties ────────────────────────────────────────────

    public ICollection<Trip> Trips { get; set; } = new List<Trip>();

    public ICollection<SavedDestination> SavedDestinations { get; set; } = new List<SavedDestination>();
}
