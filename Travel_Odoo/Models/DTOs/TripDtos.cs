using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Travel_Odoo.Models.DTOs;

public class TripSummaryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? CoverPhotoUrl { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string Status { get; set; } = null!;
        public bool IsPublic { get; set; }
        public int StopCount { get; set; }
        public decimal? TotalBudget { get; set; }
        public string CurrencyCode { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
    }

    public class TripDetailDto : TripSummaryDto
    {
        public string? PublicSlug { get; set; }
        public ICollection<TripStopDto> Stops { get; set; } = new List<TripStopDto>();
        public ICollection<TripNoteDto> Notes { get; set; } = new List<TripNoteDto>();
        public BudgetSummaryDto? BudgetSummary { get; set; }
    }

    public class CreateTripRequestDto
    {
        [Required, MaxLength(150)]
        public string Name { get; set; } = null!;

        [MaxLength(1000)]
        public string? Description { get; set; }

        [MaxLength(500)]
        public string? CoverPhotoUrl { get; set; }

        [Required]
        public DateOnly StartDate { get; set; }

        [Required]
        public DateOnly EndDate { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalBudget { get; set; }

        [MaxLength(3), MinLength(3)]
        public string CurrencyCode { get; set; } = "USD";
    }

    public class UpdateTripRequestDto : CreateTripRequestDto
    {
        public TripStatus Status { get; set; } = TripStatus.Draft;
        public bool IsPublic { get; set; } = false;
    }

    public class PublicTripDto
    {
        public string PublicSlug { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string? CoverPhotoUrl { get; set; }
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public string OwnerName { get; set; } = null!;
        public ICollection<TripStopDto> Stops { get; set; } = new List<TripStopDto>();
    }
