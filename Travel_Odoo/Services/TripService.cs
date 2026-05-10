using Microsoft.EntityFrameworkCore;
using Travel_Odoo.Data;
using Travel_Odoo.Models;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Services;

public class TripService(ApplicationDbContext db, AiService aiService) : ITripService {
    public async Task<ApiResponseDto<TripDetailDto>> CreateTripAsync(Guid userId, CreateTripRequestDto dto)
        {
            if (dto.EndDate < dto.StartDate)
                return ApiResponseDto<TripDetailDto>.Fail("End date must be on or after start date.");

            var trip = new Trip
            {
                UserId       = userId,
                Name         = dto.Name,
                Description  = dto.Description,
                CoverPhotoUrl = dto.CoverPhotoUrl,
                StartDate    = dto.StartDate,
                EndDate      = dto.EndDate,
                TotalBudget  = dto.TotalBudget,
                CurrencyCode = dto.CurrencyCode,
                Status       = TripStatus.Draft,
                CreatedAt    = DateTime.UtcNow
            };

            db.Trips.Add(trip);
            await db.SaveChangesAsync();
            _ = Task.Run(() => aiService.SuggestItineraryAsync(trip));
            return ApiResponseDto<TripDetailDto>.Ok(MapToDetail(trip));
        }

        public async Task<ApiResponseDto<TripDetailDto>> GetTripByIdAsync(Guid userId, Guid tripId)
        {
            var trip = await LoadFullTripAsync(tripId);
            if (trip == null || trip.UserId != userId)
                return ApiResponseDto<TripDetailDto>.Fail("Trip not found.");
            await aiService.SummarizeNotesAsync(trip);

            var budget = await BuildBudgetSummaryAsync(trip);
            var detail = MapToDetail(trip);
            detail.BudgetSummary = budget;

            return ApiResponseDto<TripDetailDto>.Ok(detail);
        }

        public async Task<ApiResponseDto<PagedResultDto<TripSummaryDto>>> GetUserTripsAsync(
            Guid userId, int page, int pageSize)
        {
            var query = db.Trips.Where(t => t.UserId == userId);

            var totalCount = await query.CountAsync();

            var trips = await query
                .OrderByDescending(t => t.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Include(t => t.Stops)
                .ToListAsync();

            return ApiResponseDto<PagedResultDto<TripSummaryDto>>.Ok(new PagedResultDto<TripSummaryDto>
            {
                Items      = trips.Select(MapToSummary).ToList(),
                TotalCount = totalCount,
                Page       = page,
                PageSize   = pageSize
            });
        }

        public async Task<ApiResponseDto<TripDetailDto>> UpdateTripAsync(
            Guid userId, Guid tripId, UpdateTripRequestDto dto)
        {
            if (dto.EndDate < dto.StartDate)
                return ApiResponseDto<TripDetailDto>.Fail("End date must be on or after start date.");

            var trip = await db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null)
                return ApiResponseDto<TripDetailDto>.Fail("Trip not found.");

            trip.Name         = dto.Name;
            trip.Description  = dto.Description;
            trip.CoverPhotoUrl = dto.CoverPhotoUrl;
            trip.StartDate    = dto.StartDate;
            trip.EndDate      = dto.EndDate;
            trip.TotalBudget  = dto.TotalBudget;
            trip.CurrencyCode = dto.CurrencyCode;
            trip.Status       = dto.Status;
            trip.IsPublic     = dto.IsPublic;
            trip.UpdatedAt    = DateTime.UtcNow;

            await db.SaveChangesAsync();

            return await GetTripByIdAsync(userId, tripId);
        }

        public async Task<ApiResponseDto<string>> DeleteTripAsync(Guid userId, Guid tripId)
        {
            var trip = await db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null)
                return ApiResponseDto<string>.Fail("Trip not found.");

            db.Trips.Remove(trip);
            await db.SaveChangesAsync();

            return ApiResponseDto<string>.Ok("Trip deleted successfully.");
        }

        public async Task<ApiResponseDto<TripPublishResultDto>> PublishTripAsync(Guid userId, Guid tripId)
        {
            var trip = await db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null)
                return ApiResponseDto<TripPublishResultDto>.Fail("Trip not found.");

            trip.IsPublic   = true;
            trip.PublicSlug = trip.PublicSlug ?? GenerateSlug(trip.Name);
            trip.UpdatedAt  = DateTime.UtcNow;

            await db.SaveChangesAsync();
            await aiService.EstimateBudgetAsync(trip);
            var packingList = await aiService.SuggestPackingListAsync(trip);
            return ApiResponseDto<TripPublishResultDto>.Ok(new TripPublishResultDto
            {
                PublicSlug  = trip.PublicSlug,
                PackingList = packingList
            });
        }

        public async Task<ApiResponseDto<PublicTripDto>> GetPublicTripAsync(string slug)
        {
            var trip = await db.Trips
                .Where(t => t.PublicSlug == slug && t.IsPublic)
                .Include(t => t.User)
                .Include(t => t.Stops.OrderBy(s => s.OrderIndex))
                    .ThenInclude(s => s.City).ThenInclude(c => c.Country)
                .Include(t => t.Stops)
                    .ThenInclude(s => s.StopActivities)
                        .ThenInclude(sa => sa.CityActivity).ThenInclude(a => a.Images)
                .AsSplitQuery()
                .FirstOrDefaultAsync();

            if (trip == null)
                return ApiResponseDto<PublicTripDto>.Fail("Trip not found.");

            return ApiResponseDto<PublicTripDto>.Ok(new PublicTripDto
            {
                PublicSlug  = trip.PublicSlug!,
                Name        = trip.Name,
                Description = trip.Description,
                CoverPhotoUrl = trip.CoverPhotoUrl,
                StartDate   = trip.StartDate,
                EndDate     = trip.EndDate,
                OwnerName   = trip.User.FullName,
                Stops       = trip.Stops.Select(MapStop).ToList()
            });
        }

        public async Task<ApiResponseDto<TripDetailDto>> CopyTripAsync(Guid userId, string slug)
        {
            var original = await db.Trips
                .Where(t => t.PublicSlug == slug && t.IsPublic)
                .Include(t => t.Stops.OrderBy(s => s.OrderIndex))
                    .ThenInclude(s => s.StopActivities)
                .AsSplitQuery()
                .FirstOrDefaultAsync();

            if (original == null)
                return ApiResponseDto<TripDetailDto>.Fail("Trip not found.");

            var copy = new Trip
            {
                UserId        = userId,
                Name          = $"{original.Name} (Copy)",
                Description   = original.Description,
                CoverPhotoUrl = original.CoverPhotoUrl,
                StartDate     = original.StartDate,
                EndDate       = original.EndDate,
                TotalBudget   = original.TotalBudget,
                CurrencyCode  = original.CurrencyCode,
                Status        = TripStatus.Draft,
                CreatedAt     = DateTime.UtcNow,
                Stops         = original.Stops.Select(s => new TripStop
                {
                    CityId        = s.CityId,
                    OrderIndex    = s.OrderIndex,
                    ArrivalDate   = s.ArrivalDate,
                    DepartureDate = s.DepartureDate,
                    Notes         = s.Notes,
                    StopActivities = s.StopActivities.Select(sa => new StopActivity
                    {
                        CityActivityId = sa.CityActivityId,
                        PlannedDate    = sa.PlannedDate,
                        PlannedTime    = sa.PlannedTime,
                        Notes          = sa.Notes
                    }).ToList()
                }).ToList()
            };

            db.Trips.Add(copy);
            await db.SaveChangesAsync();

            return ApiResponseDto<TripDetailDto>.Ok(MapToDetail(copy));
        }

        // ── Helpers ──────────────────────────────────────────────────────────

        private async Task<Trip?> LoadFullTripAsync(Guid tripId) =>
            await db.Trips
                .Include(t => t.Stops.OrderBy(s => s.OrderIndex))
                    .ThenInclude(s => s.City).ThenInclude(c => c.Country)
                .Include(t => t.Stops)
                    .ThenInclude(s => s.StopActivities)
                        .ThenInclude(sa => sa.CityActivity).ThenInclude(a => a.Images)
                .Include(t => t.Notes.OrderByDescending(n => n.CreatedAt))
                .AsSplitQuery()
                .FirstOrDefaultAsync(t => t.Id == tripId);

        private async Task<BudgetSummaryDto> BuildBudgetSummaryAsync(Trip trip)
        {
            var expenses = await db.BudgetExpenses.Where(b => b.TripId == trip.Id).ToListAsync();

            var totalEstimated = expenses.Where(e => e.IsEstimate).Sum(e => e.Amount);
            var totalActual    = expenses.Where(e => !e.IsEstimate).Sum(e => e.Amount);
            var days           = (trip.EndDate.DayNumber - trip.StartDate.DayNumber) + 1;
            var totalSpend     = totalActual > 0 ? totalActual : totalEstimated;

            var breakdown = expenses
                .GroupBy(e => e.Category)
                .Select(g => new BudgetCategoryBreakdownDto
                {
                    Category   = g.Key.ToString(),
                    Total      = g.Sum(e => e.Amount),
                    Percentage = totalSpend > 0
                        ? Math.Round(g.Sum(e => e.Amount) / totalSpend * 100, 2)
                        : 0
                }).ToList();

            return new BudgetSummaryDto
            {
                TotalBudget       = trip.TotalBudget,
                TotalEstimated    = totalEstimated,
                TotalActual       = totalActual,
                Remaining         = (trip.TotalBudget ?? 0) - totalSpend,
                AverageCostPerDay = days > 0 ? Math.Round(totalSpend / days, 2) : 0,
                CurrencyCode      = trip.CurrencyCode,
                IsOverBudget      = trip.TotalBudget.HasValue && totalSpend > trip.TotalBudget.Value,
                Breakdown         = breakdown
            };
        }

        private static string GenerateSlug(string name)
        {
            var slug = name.ToLower()
                .Replace(" ", "-")
                .Where(c => char.IsLetterOrDigit(c) || c == '-')
                .Aggregate(string.Empty, (s, c) => s + c);
            return $"{slug}-{Guid.NewGuid().ToString()[..8]}";
        }

        // ── Mappers ──────────────────────────────────────────────────────────

        private static TripSummaryDto MapToSummary(Trip t) => new()
        {
            Id            = t.Id,
            Name          = t.Name,
            Description   = t.Description,
            CoverPhotoUrl = t.CoverPhotoUrl,
            StartDate     = t.StartDate,
            EndDate       = t.EndDate,
            Status        = t.Status.ToString(),
            IsPublic      = t.IsPublic,
            StopCount     = t.Stops.Count,
            TotalBudget   = t.TotalBudget,
            CurrencyCode  = t.CurrencyCode,
            CreatedAt     = t.CreatedAt
        };

        private static TripDetailDto MapToDetail(Trip t) => new()
        {
            Id            = t.Id,
            Name          = t.Name,
            Description   = t.Description,
            CoverPhotoUrl = t.CoverPhotoUrl,
            StartDate     = t.StartDate,
            EndDate       = t.EndDate,
            Status        = t.Status.ToString(),
            IsPublic      = t.IsPublic,
            PublicSlug    = t.PublicSlug,
            StopCount     = t.Stops.Count,
            TotalBudget   = t.TotalBudget,
            CurrencyCode  = t.CurrencyCode,
            CreatedAt     = t.CreatedAt,
            Stops         = t.Stops.Select(MapStop).ToList(),
            Notes         = t.Notes.Select(MapNote).ToList()
        };

        internal static TripStopDto MapStop(TripStop s) => new()
        {
            Id            = s.Id,
            OrderIndex    = s.OrderIndex,
            ArrivalDate   = s.ArrivalDate,
            DepartureDate = s.DepartureDate,
            Notes         = s.Notes,
            City          = s.City != null ? LocationService.MapCity(s.City) : new LocationDtos.CityDto(),
            Activities    = s.StopActivities.Select(sa => new StopActivityDto
            {
                Id          = sa.Id,
                PlannedDate = sa.PlannedDate,
                PlannedTime = sa.PlannedTime,
                ActualCost  = sa.ActualCost,
                IsCompleted = sa.IsCompleted,
                Notes       = sa.Notes,
                Activity    = sa.CityActivity != null
                    ? ActivityService.MapActivity(sa.CityActivity)
                    : new CityActivityDto()
            }).ToList()
        };

        private static TripNoteDto MapNote(TripNote n) => new()
        {
            Id         = n.Id,
            TripId     = n.TripId,
            TripStopId = n.TripStopId,
            Title      = n.Title,
            Content    = n.Content,
            NoteDate   = n.NoteDate,
            CreatedAt  = n.CreatedAt,
            UpdatedAt  = n.UpdatedAt,
            Tag = n.Tag
        };
    }
