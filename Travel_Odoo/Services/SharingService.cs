using Microsoft.EntityFrameworkCore;
using Travel_Odoo.Data;
using Travel_Odoo.Models;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Services;

public class SharingService(ApplicationDbContext db) : ISharingService {
    public async Task<ApiResponseDto<TripShareDto>> ShareTripAsync(
            Guid userId, Guid tripId, CreateTripShareRequestDto dto)
        {
            var trip = await db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null)
                return ApiResponseDto<TripShareDto>.Fail("Trip not found.");

            var exists = await db.TripShares
                .AnyAsync(ts => ts.TripId == tripId && ts.SharedWithEmail == dto.SharedWithEmail);
            if (exists)
                return ApiResponseDto<TripShareDto>.Fail("Trip already shared with this email.");

            var share = new TripShare
            {
                TripId          = tripId,
                SharedWithEmail = dto.SharedWithEmail,
                Permission      = dto.Permission,
                SharedAt        = DateTime.UtcNow
            };

            db.TripShares.Add(share);
            await db.SaveChangesAsync();

            return ApiResponseDto<TripShareDto>.Ok(MapShare(share));
        }

        public async Task<ApiResponseDto<string>> RevokeShareAsync(Guid userId, Guid tripId, Guid shareId)
        {
            var share = await db.TripShares
                .Include(ts => ts.Trip)
                .FirstOrDefaultAsync(ts => ts.Id == shareId
                                        && ts.TripId == tripId
                                        && ts.Trip.UserId == userId);

            if (share == null)
                return ApiResponseDto<string>.Fail("Share not found.");

            db.TripShares.Remove(share);
            await db.SaveChangesAsync();

            return ApiResponseDto<string>.Ok("Share revoked.");
        }

        public async Task<ApiResponseDto<ICollection<TripShareDto>>> GetSharesAsync(Guid userId, Guid tripId)
        {
            var tripExists = await db.Trips
                .AnyAsync(t => t.Id == tripId && t.UserId == userId);

            if (!tripExists)
                return ApiResponseDto<ICollection<TripShareDto>>.Fail("Trip not found.");

            var shares = await db.TripShares
                .Where(ts => ts.TripId == tripId)
                .OrderByDescending(ts => ts.SharedAt)
                .ToListAsync();

            return ApiResponseDto<ICollection<TripShareDto>>.Ok(shares.Select(MapShare).ToList());
        }

        // ── Mapper ───────────────────────────────────────────────────────────

        private static TripShareDto MapShare(TripShare ts) => new()
        {
            Id              = ts.Id,
            SharedWithEmail = ts.SharedWithEmail,
            Permission      = ts.Permission.ToString(),
            SharedAt        = ts.SharedAt
        };
    }
