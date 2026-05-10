using Microsoft.EntityFrameworkCore;
using Travel_Odoo.Data;
using Travel_Odoo.Models;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Services;

public class TripStopService(ApplicationDbContext db) : ITripStopService {
    public async Task<ApiResponseDto<TripStopDto>> AddStopAsync(
            Guid userId, Guid tripId, CreateTripStopRequestDto dto)
        {
            var trip = await db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null)
                return ApiResponseDto<TripStopDto>.Fail("Trip not found.");

            if (dto.DepartureDate < dto.ArrivalDate)
                return ApiResponseDto<TripStopDto>.Fail("Departure date must be on or after arrival date.");

            var city = await db.Cities.Include(c => c.Country)
                                       .FirstOrDefaultAsync(c => c.Id == dto.CityId);
            if (city == null)
                return ApiResponseDto<TripStopDto>.Fail("City not found.");

            var maxOrder = await db.TripStops
                .Where(s => s.TripId == tripId)
                .Select(s => (int?)s.OrderIndex)
                .MaxAsync() ?? -1;

            var stop = new TripStop
            {
                TripId        = tripId,
                CityId        = dto.CityId,
                ArrivalDate   = dto.ArrivalDate,
                DepartureDate = dto.DepartureDate,
                OrderIndex    = maxOrder + 1,
                Notes         = dto.Notes
            };

            db.TripStops.Add(stop);
            await db.SaveChangesAsync();

            stop.City = city;
            stop.StopActivities = new List<StopActivity>();

            return ApiResponseDto<TripStopDto>.Ok(TripService.MapStop(stop));
        }

        public async Task<ApiResponseDto<TripStopDto>> UpdateStopAsync(
            Guid userId, Guid tripId, Guid stopId, UpdateTripStopRequestDto dto)
        {
            var stop = await LoadStopAsync(userId, tripId, stopId);
            if (stop == null)
                return ApiResponseDto<TripStopDto>.Fail("Stop not found.");

            if (dto.DepartureDate < dto.ArrivalDate)
                return ApiResponseDto<TripStopDto>.Fail("Departure date must be on or after arrival date.");

            var city = await db.Cities.Include(c => c.Country)
                                       .FirstOrDefaultAsync(c => c.Id == dto.CityId);
            if (city == null)
                return ApiResponseDto<TripStopDto>.Fail("City not found.");

            stop.CityId        = dto.CityId;
            stop.ArrivalDate   = dto.ArrivalDate;
            stop.DepartureDate = dto.DepartureDate;
            stop.Notes         = dto.Notes;
            stop.City          = city;

            await db.SaveChangesAsync();

            return ApiResponseDto<TripStopDto>.Ok(TripService.MapStop(stop));
        }

        public async Task<ApiResponseDto<string>> DeleteStopAsync(Guid userId, Guid tripId, Guid stopId)
        {
            var stop = await LoadStopAsync(userId, tripId, stopId);
            if (stop == null)
                return ApiResponseDto<string>.Fail("Stop not found.");

            db.TripStops.Remove(stop);
            await db.SaveChangesAsync();

            // Re-sequence remaining stops
            var remaining = await db.TripStops
                .Where(s => s.TripId == tripId)
                .OrderBy(s => s.OrderIndex)
                .ToListAsync();

            for (int i = 0; i < remaining.Count; i++)
                remaining[i].OrderIndex = i;

            await db.SaveChangesAsync();

            return ApiResponseDto<string>.Ok("Stop deleted.");
        }

        public async Task<ApiResponseDto<string>> ReorderStopsAsync(
            Guid userId, Guid tripId, ReorderStopsRequestDto dto)
        {
            var trip = await db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null)
                return ApiResponseDto<string>.Fail("Trip not found.");

            var stops = await db.TripStops.Where(s => s.TripId == tripId).ToListAsync();

            if (stops.Count != dto.OrderedStopIds.Count)
                return ApiResponseDto<string>.Fail("Stop ID list does not match the trip's stops.");

            for (int i = 0; i < dto.OrderedStopIds.Count; i++)
            {
                var stop = stops.FirstOrDefault(s => s.Id == dto.OrderedStopIds[i]);
                if (stop == null)
                    return ApiResponseDto<string>.Fail($"Stop {dto.OrderedStopIds[i]} not found.");
                stop.OrderIndex = i;
            }

            await db.SaveChangesAsync();
            return ApiResponseDto<string>.Ok("Stops reordered.");
        }

        public async Task<ApiResponseDto<StopActivityDto>> AddActivityToStopAsync(
            Guid userId, Guid tripId, Guid stopId, AddStopActivityRequestDto dto)
        {
            var stop = await LoadStopAsync(userId, tripId, stopId);
            if (stop == null)
                return ApiResponseDto<StopActivityDto>.Fail("Stop not found.");

            var activity = await db.CityActivities.Include(a => a.Images)
                                                    .FirstOrDefaultAsync(a => a.Id == dto.CityActivityId);
            if (activity == null)
                return ApiResponseDto<StopActivityDto>.Fail("Activity not found.");

            if (activity.CityId != stop.CityId)
                return ApiResponseDto<StopActivityDto>.Fail("Activity does not belong to this stop's city.");

            var alreadyAdded = await db.StopActivities
                .AnyAsync(sa => sa.TripStopId == stopId && sa.CityActivityId == dto.CityActivityId);
            if (alreadyAdded)
                return ApiResponseDto<StopActivityDto>.Fail("Activity already added to this stop.");

            var stopActivity = new StopActivity
            {
                TripStopId     = stopId,
                CityActivityId = dto.CityActivityId,
                PlannedDate    = dto.PlannedDate,
                PlannedTime    = dto.PlannedTime,
                ActualCost     = dto.ActualCost,
                Notes          = dto.Notes
            };

            db.StopActivities.Add(stopActivity);
            await db.SaveChangesAsync();

            stopActivity.CityActivity = activity;

            return ApiResponseDto<StopActivityDto>.Ok(new StopActivityDto
            {
                Id          = stopActivity.Id,
                PlannedDate = stopActivity.PlannedDate,
                PlannedTime = stopActivity.PlannedTime,
                ActualCost  = stopActivity.ActualCost,
                IsCompleted = stopActivity.IsCompleted,
                Notes       = stopActivity.Notes,
                Activity    = ActivityService.MapActivity(activity)
            });
        }

        public async Task<ApiResponseDto<StopActivityDto>> UpdateStopActivityAsync(
            Guid userId, Guid tripId, Guid stopId, Guid stopActivityId, UpdateStopActivityRequestDto dto)
        {
            var stop = await LoadStopAsync(userId, tripId, stopId);
            if (stop == null)
                return ApiResponseDto<StopActivityDto>.Fail("Stop not found.");

            var sa = await db.StopActivities
                .Include(x => x.CityActivity).ThenInclude(a => a.Images)
                .FirstOrDefaultAsync(x => x.Id == stopActivityId && x.TripStopId == stopId);

            if (sa == null)
                return ApiResponseDto<StopActivityDto>.Fail("Stop activity not found.");

            sa.PlannedDate = dto.PlannedDate;
            sa.PlannedTime = dto.PlannedTime;
            sa.ActualCost  = dto.ActualCost;
            sa.Notes       = dto.Notes;
            sa.IsCompleted = dto.IsCompleted;

            await db.SaveChangesAsync();

            return ApiResponseDto<StopActivityDto>.Ok(new StopActivityDto
            {
                Id          = sa.Id,
                PlannedDate = sa.PlannedDate,
                PlannedTime = sa.PlannedTime,
                ActualCost  = sa.ActualCost,
                IsCompleted = sa.IsCompleted,
                Notes       = sa.Notes,
                Activity    = ActivityService.MapActivity(sa.CityActivity)
            });
        }

        public async Task<ApiResponseDto<string>> RemoveActivityFromStopAsync(
            Guid userId, Guid tripId, Guid stopId, Guid stopActivityId)
        {
            var stop = await LoadStopAsync(userId, tripId, stopId);
            if (stop == null)
                return ApiResponseDto<string>.Fail("Stop not found.");

            var sa = await db.StopActivities
                .FirstOrDefaultAsync(x => x.Id == stopActivityId && x.TripStopId == stopId);

            if (sa == null)
                return ApiResponseDto<string>.Fail("Stop activity not found.");

            db.StopActivities.Remove(sa);
            await db.SaveChangesAsync();

            return ApiResponseDto<string>.Ok("Activity removed from stop.");
        }

        // ── Helper ───────────────────────────────────────────────────────────

        private async Task<TripStop?> LoadStopAsync(Guid userId, Guid tripId, Guid stopId) =>
            await db.TripStops
                .Include(s => s.Trip)
                .Include(s => s.City).ThenInclude(c => c.Country)
                .Include(s => s.StopActivities)
                    .ThenInclude(sa => sa.CityActivity).ThenInclude(a => a.Images)
                .FirstOrDefaultAsync(s => s.Id == stopId
                                       && s.TripId == tripId
                                       && s.Trip.UserId == userId);
    }
