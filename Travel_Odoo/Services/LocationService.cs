using Microsoft.EntityFrameworkCore;
using Travel_Odoo.Data;
using Travel_Odoo.Models;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Services;

public class LocationService(ApplicationDbContext db) : ILocationService {
    public async Task<ApiResponseDto<PagedResultDto<LocationDtos.CityDto>>> SearchCitiesAsync(LocationDtos.CitySearchRequestDto dto)
        {
            var query = db.Cities.Include(c => c.Country).AsQueryable();

            if (!string.IsNullOrWhiteSpace(dto.SearchTerm))
                query = query.Where(c => c.Name.Contains(dto.SearchTerm));

            if (dto.CountryId.HasValue)
                query = query.Where(c => c.CountryId == dto.CountryId);

            if (!string.IsNullOrWhiteSpace(dto.Region))
                query = query.Where(c => c.Region == dto.Region || c.Country.Region == dto.Region);

            if (dto.MaxCostIndex.HasValue)
                query = query.Where(c => c.CostIndex == null || c.CostIndex <= dto.MaxCostIndex);

            var totalCount = await query.CountAsync();

            var cities = await query
                .OrderByDescending(c => c.PopularityScore)
                .Skip((dto.Page - 1) * dto.PageSize)
                .Take(dto.PageSize)
                .ToListAsync();

            return ApiResponseDto<PagedResultDto<LocationDtos.CityDto>>.Ok(new PagedResultDto<LocationDtos.CityDto>
            {
                Items      = cities.Select(MapCity).ToList(),
                TotalCount = totalCount,
                Page       = dto.Page,
                PageSize   = dto.PageSize
            });
        }

        public async Task<ApiResponseDto<LocationDtos.CityDto>> GetCityByIdAsync(Guid cityId)
        {
            var city = await db.Cities.Include(c => c.Country)
                                       .FirstOrDefaultAsync(c => c.Id == cityId);

            if (city == null)
                return ApiResponseDto<LocationDtos.CityDto>.Fail("City not found.");

            return ApiResponseDto<LocationDtos.CityDto>.Ok(MapCity(city));
        }

        public async Task<ApiResponseDto<ICollection<LocationDtos.CountryDto>>> GetAllCountriesAsync()
        {
            var countries = await db.Countries
                .OrderBy(c => c.Name)
                .Select(c => new LocationDtos.CountryDto
                {
                    Id      = c.Id,
                    Name    = c.Name,
                    IsoCode = c.IsoCode,
                    Region  = c.Region
                })
                .ToListAsync();

            return ApiResponseDto<ICollection<LocationDtos.CountryDto>>.Ok(countries);
        }

        // ── Mapper ───────────────────────────────────────────────────────────

        internal static LocationDtos.CityDto MapCity(City city) => new()
        {
            Id              = city.Id,
            Name            = city.Name,
            Region          = city.Region,
            CostIndex       = city.CostIndex,
            PopularityScore = city.PopularityScore,
            ThumbnailUrl    = city.ThumbnailUrl,
            Latitude        = city.Latitude,
            Longitude       = city.Longitude,
            Country         = new LocationDtos.CountryDto
            {
                Id      = city.Country.Id,
                Name    = city.Country.Name,
                IsoCode = city.Country.IsoCode,
                Region  = city.Country.Region
            }
        };
    }
