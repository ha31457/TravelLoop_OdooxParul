using System.ComponentModel.DataAnnotations;

namespace Travel_Odoo.Models.DTOs;

    public class UserSummaryDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? ProfilePhotoUrl { get; set; }
        public string LanguagePreference { get; set; } = null!;
        public bool IsAdmin { get; set; }
    }

    public class UserProfileDto : UserSummaryDto
    {
        public string? PhoneNumber { get; set; }
        public bool EmailConfirmed { get; set; }
        public DateTime CreatedAt { get; set; }
        public ICollection<LocationDtos.CityDto> SavedDestinations { get; set; } = new List<LocationDtos.CityDto>();
    }

    public class UpdateProfileRequestDto
    {
        [Required, MaxLength(100)]
        public string FullName { get; set; } = null!;

        [Phone, MaxLength(20)]
        public string? PhoneNumber { get; set; }

        [MaxLength(500)]
        public string? ProfilePhotoUrl { get; set; }

        [MaxLength(10)]
        public string LanguagePreference { get; set; } = "en";
    }
