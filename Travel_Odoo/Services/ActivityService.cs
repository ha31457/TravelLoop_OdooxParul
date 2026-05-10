using Microsoft.EntityFrameworkCore;
using Travel_Odoo.Data;
using Travel_Odoo.Models;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Services;

 public class ActivityService(ApplicationDbContext db) : IActivityService {
     public async Task<ApiResponseDto<PagedResultDto<CityActivityDto>>> SearchActivitiesAsync(ActivitySearchRequestDto dto)
        {
            var query = db.CityActivities
                .Include(a => a.Images)
                .Where(a => a.CityId == dto.CityId)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(dto.SearchTerm))
                query = query.Where(a => a.Name.Contains(dto.SearchTerm) ||
                                         (a.Description != null && a.Description.Contains(dto.SearchTerm)));

            if (dto.Category.HasValue)
                query = query.Where(a => a.Category == dto.Category.Value);

            if (dto.MaxCost.HasValue)
                query = query.Where(a => a.EstimatedCost == null || a.EstimatedCost <= dto.MaxCost);

            if (dto.MaxDurationMinutes.HasValue)
                query = query.Where(a => a.DurationMinutes == null || a.DurationMinutes <= dto.MaxDurationMinutes);

            var totalCount = await query.CountAsync();

            var activities = await query
                .OrderByDescending(a => a.PopularityScore)
                .Skip((dto.Page - 1) * dto.PageSize)
                .Take(dto.PageSize)
                .ToListAsync();

            return ApiResponseDto<PagedResultDto<CityActivityDto>>.Ok(new PagedResultDto<CityActivityDto>
            {
                Items      = activities.Select(MapActivity).ToList(),
                TotalCount = totalCount,
                Page       = dto.Page,
                PageSize   = dto.PageSize
            });
        }

        public async Task<ApiResponseDto<CityActivityDto>> GetActivityByIdAsync(Guid activityId)
        {
            var activity = await db.CityActivities
                .Include(a => a.Images)
                .FirstOrDefaultAsync(a => a.Id == activityId);

            if (activity == null)
                return ApiResponseDto<CityActivityDto>.Fail("Activity not found.");

            return ApiResponseDto<CityActivityDto>.Ok(MapActivity(activity));
        }

        // ── Mapper ───────────────────────────────────────────────────────────

        internal static CityActivityDto MapActivity(CityActivity a) => new()
        {
            Id              = a.Id,
            CityId          = a.CityId,
            Name            = a.Name,
            Description     = a.Description,
            Category        = a.Category.ToString(),
            EstimatedCost   = a.EstimatedCost,
            DurationMinutes = a.DurationMinutes,
            ThumbnailUrl    = a.ThumbnailUrl,
            PopularityScore = a.PopularityScore,
            Images          = a.Images
                .OrderBy(i => i.SortOrder)
                .Select(i => new ActivityImageDto
                {
                    Id        = i.Id,
                    ImageUrl  = i.ImageUrl,
                    IsPrimary = i.IsPrimary,
                    SortOrder = i.SortOrder
                }).ToList()
        };
    }
