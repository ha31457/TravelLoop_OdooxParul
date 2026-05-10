using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Travel_Odoo.Models
{
    // ─────────────────────────────────────────────
    // 2. PASSWORD RESET TOKEN
    // ─────────────────────────────────────────────
    public class PasswordResetToken
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required, MaxLength(512)]
        public string Token { get; set; } = null!;

        public DateTime ExpiresAt { get; set; }
        public bool IsUsed { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;
    }

    // ─────────────────────────────────────────────
    // 3. TRIP
    // ─────────────────────────────────────────────
    public class Trip
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

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

        public TripStatus Status { get; set; } = TripStatus.Draft;
        public bool IsPublic { get; set; } = false;

        [MaxLength(128)]
        public string? PublicSlug { get; set; }   // used for public/shared URL

        [Column(TypeName = "decimal(18,2)")]
        public decimal? TotalBudget { get; set; }

        [MaxLength(3)]
        public string CurrencyCode { get; set; } = "INR";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation
        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        public ICollection<TripStop> Stops { get; set; } = new List<TripStop>();
        public ICollection<PackingItem> PackingItems { get; set; } = new List<PackingItem>();
        public ICollection<TripNote> Notes { get; set; } = new List<TripNote>();
    }

    public enum TripStatus
    {
        Draft,
        Planned,
        Ongoing,
        Completed,
        Cancelled
    }

    // ─────────────────────────────────────────────
    // 4. CITY  (lookup / reference table)
    // ─────────────────────────────────────────────
    public class City
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required]
        public Guid CountryId { get; set; }

        [MaxLength(100)]
        public string? Region { get; set; }

        [Column(TypeName = "decimal(9,6)")]
        public decimal? Latitude { get; set; }

        [Column(TypeName = "decimal(9,6)")]
        public decimal? Longitude { get; set; }

        /// <summary>Relative cost index: 1 (cheap) – 5 (expensive)</summary>
        public int? CostIndex { get; set; }

        public int PopularityScore { get; set; } = 0;

        [MaxLength(500)]
        public string? ThumbnailUrl { get; set; }

        // Navigation
        [ForeignKey(nameof(CountryId))]
        public Country Country { get; set; } = null!;

        public ICollection<TripStop> TripStops { get; set; } = new List<TripStop>();
        public ICollection<CityActivity> Activities { get; set; } = new List<CityActivity>();
        public ICollection<SavedDestination> SavedByUsers { get; set; } = new List<SavedDestination>();
    }

    // ─────────────────────────────────────────────
    // 5. COUNTRY (reference table)
    // ─────────────────────────────────────────────
    public class Country
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, MaxLength(100)]
        public string Name { get; set; } = null!;

        [Required, MaxLength(3)]
        public string IsoCode { get; set; } = null!;   // ISO 3166-1 alpha-2 / alpha-3

        [MaxLength(100)]
        public string? Region { get; set; }            // continent / sub-region

        // Navigation
        public ICollection<City> Cities { get; set; } = new List<City>();
    }

    // ─────────────────────────────────────────────
    // 6. TRIP STOP  (many cities per trip, ordered)
    // ─────────────────────────────────────────────
    public class TripStop
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TripId { get; set; }

        [Required]
        public Guid CityId { get; set; }

        public int OrderIndex { get; set; }            // for reordering stops

        [Required]
        public DateOnly ArrivalDate { get; set; }

        [Required]
        public DateOnly DepartureDate { get; set; }

        [MaxLength(500)]
        public string? Notes { get; set; }

        // Navigation
        [ForeignKey(nameof(TripId))]
        public Trip Trip { get; set; } = null!;

        [ForeignKey(nameof(CityId))]
        public City City { get; set; } = null!;

        public ICollection<StopActivity> StopActivities { get; set; } = new List<StopActivity>();
        public ICollection<TripNote> Notes_ { get; set; } = new List<TripNote>();
    }

    // ─────────────────────────────────────────────
    // 7. CITY ACTIVITY  (master catalogue of activities per city)
    // ─────────────────────────────────────────────
    public class CityActivity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid CityId { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; } = null!;

        [MaxLength(1000)]
        public string? Description { get; set; }

        public ActivityCategory Category { get; set; } = ActivityCategory.Sightseeing;

        [Column(TypeName = "decimal(18,2)")]
        public decimal? EstimatedCost { get; set; }

        /// <summary>Estimated duration in minutes</summary>
        public int? DurationMinutes { get; set; }

        [MaxLength(500)]
        public string? ThumbnailUrl { get; set; }

        public int PopularityScore { get; set; } = 0;

        // Navigation
        [ForeignKey(nameof(CityId))]
        public City City { get; set; } = null!;

        public ICollection<StopActivity> StopActivities { get; set; } = new List<StopActivity>();
        public ICollection<ActivityImage> Images { get; set; } = new List<ActivityImage>();
    }

    public enum ActivityCategory
    {
        Sightseeing,
        FoodAndDrink,
        Adventure,
        Culture,
        Shopping,
        Wellness,
        Nightlife,
        Nature,
        Transportation,
        Accommodation,
        Other
    }

    // ─────────────────────────────────────────────
    // 8. ACTIVITY IMAGE
    // ─────────────────────────────────────────────
    public class ActivityImage
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid CityActivityId { get; set; }

        [Required, MaxLength(500)]
        public string ImageUrl { get; set; } = null!;

        public bool IsPrimary { get; set; } = false;
        public int SortOrder { get; set; } = 0;

        [ForeignKey(nameof(CityActivityId))]
        public CityActivity CityActivity { get; set; } = null!;
    }

    // ─────────────────────────────────────────────
    // 9. STOP ACTIVITY  (activities chosen for a trip stop — join table with extras)
    // ─────────────────────────────────────────────
    public class StopActivity
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TripStopId { get; set; }

        [Required]
        public Guid CityActivityId { get; set; }

        public DateOnly? PlannedDate { get; set; }
        public TimeOnly? PlannedTime { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ActualCost { get; set; }    // overrides catalogue estimate

        public bool IsCompleted { get; set; } = false;

        [MaxLength(500)]
        public string? Notes { get; set; }

        // Navigation
        [ForeignKey(nameof(TripStopId))]
        public TripStop TripStop { get; set; } = null!;

        [ForeignKey(nameof(CityActivityId))]
        public CityActivity CityActivity { get; set; } = null!;
    }

    // ─────────────────────────────────────────────
    // 10. BUDGET EXPENSE  (granular cost tracking per trip stop)
    // ─────────────────────────────────────────────
    public class BudgetExpense
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TripId { get; set; }

        public Guid? TripStopId { get; set; }         // null = trip-level expense

        [Required, MaxLength(150)]
        public string Label { get; set; } = null!;

        public ExpenseCategory Category { get; set; } = ExpenseCategory.Other;

        [Required, Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [MaxLength(3)]
        public string CurrencyCode { get; set; } = "INR";

        public DateOnly? ExpenseDate { get; set; }

        public bool IsEstimate { get; set; } = true;  // false = actual spend

        // Navigation
        [ForeignKey(nameof(TripId))]
        public Trip Trip { get; set; } = null!;

        [ForeignKey(nameof(TripStopId))]
        public TripStop? TripStop { get; set; }
    }

    public enum ExpenseCategory
    {
        Transport,
        Accommodation,
        Activities,
        Meals,
        Shopping,
        Visa,
        Insurance,
        Other
    }

    // ─────────────────────────────────────────────
    // 11. PACKING ITEM
    // ─────────────────────────────────────────────
    public class PackingItem
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TripId { get; set; }

        [Required, MaxLength(150)]
        public string Name { get; set; } = null!;

        public PackingCategory Category { get; set; } = PackingCategory.Other;

        public bool IsPacked { get; set; } = false;

        public int SortOrder { get; set; } = 0;

        // Navigation
        [ForeignKey(nameof(TripId))]
        public Trip Trip { get; set; } = null!;
    }

    public enum PackingCategory
    {
        Clothing,
        Documents,
        Electronics,
        Toiletries,
        Medicines,
        Other
    }

    // ─────────────────────────────────────────────
    // 12. TRIP NOTE / JOURNAL
    // ─────────────────────────────────────────────
    public class TripNote
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TripId { get; set; }

        public Guid? TripStopId { get; set; }        // null = trip-level note

        [Required, MaxLength(200)]
        public string Title { get; set; } = null!;

        [Required]
        public string Content { get; set; } = null!;

        public DateOnly? NoteDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        // Navigation
        [ForeignKey(nameof(TripId))]
        public Trip Trip { get; set; } = null!;

        [ForeignKey(nameof(TripStopId))]
        public TripStop? TripStop { get; set; }
    }

    // ─────────────────────────────────────────────
    // 13. SAVED DESTINATION  (user bookmarks a city)
    // ─────────────────────────────────────────────
    public class SavedDestination
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public Guid CityId { get; set; }

        public DateTime SavedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey(nameof(UserId))]
        public User User { get; set; } = null!;

        [ForeignKey(nameof(CityId))]
        public City City { get; set; } = null!;
    }

    // ─────────────────────────────────────────────
    // 14. TRIP SHARE  (track who a trip is shared with)
    // ─────────────────────────────────────────────
    public class TripShare
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid TripId { get; set; }

        [Required, MaxLength(255)]
        [EmailAddress]
        public string SharedWithEmail { get; set; } = null!;

        public SharePermission Permission { get; set; } = SharePermission.ReadOnly;

        public DateTime SharedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        [ForeignKey(nameof(TripId))]
        public Trip Trip { get; set; } = null!;
    }

    public enum SharePermission
    {
        ReadOnly,
        CanCopy
    }
}
