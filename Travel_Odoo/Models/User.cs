using Microsoft.AspNetCore.Identity;

namespace Travel_Odoo.Backend.Models;


public class User : IdentityUser<Guid>
{
    public required string FullName { get; set; }
    public string? DesiredRole { get; set; }
    public string? AvatarUrl { get; set; }
}
