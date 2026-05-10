using System.ComponentModel.DataAnnotations;

namespace Travel_Odoo.Models.DTOs;

public class LocationDtos {
    public class CountryDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string IsoCode { get; set; } = null!;
        public string? Region { get; set; }
    }

    public class CityDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Region { get; set; }
        public CountryDto Country { get; set; } = null!;
        public int? CostIndex { get; set; }
        public int PopularityScore { get; set; }
        public string? ThumbnailUrl { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }

    public class CitySearchRequestDto
    {
        [MaxLength(100)]
        public string? SearchTerm { get; set; }

        public Guid? CountryId { get; set; }

        public string? Region { get; set; }

        /// <summary>1 (cheapest) to 5 (most expensive)</summary>
        public int? MaxCostIndex { get; set; }

        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

}