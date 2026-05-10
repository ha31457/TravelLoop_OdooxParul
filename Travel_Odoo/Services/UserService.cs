using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Travel_Odoo.Data;
using Travel_Odoo.Models;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Services;

public class UserService(UserManager<User> userManager, ApplicationDbContext db) : IUserService {
    public async Task<ApiResponseDto<UserProfileDto>> GetProfileAsync(Guid userId)
        {
            var user = await db.Users
                .Include(u => u.SavedDestinations)
                    .ThenInclude(sd => sd.City)
                        .ThenInclude(c => c.Country)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
                return ApiResponseDto<UserProfileDto>.Fail("User not found.");

            return ApiResponseDto<UserProfileDto>.Ok(MapToProfile(user));
        }

        public async Task<ApiResponseDto<UserProfileDto>> UpdateProfileAsync(Guid userId, UpdateProfileRequestDto dto)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return ApiResponseDto<UserProfileDto>.Fail("User not found.");

            user.FullName           = dto.FullName;
            user.PhoneNumber        = dto.PhoneNumber;
            user.ProfilePhotoUrl    = dto.ProfilePhotoUrl;
            user.LanguagePreference = dto.LanguagePreference;
            user.UpdatedAt          = DateTime.UtcNow;

            var result = await userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return ApiResponseDto<UserProfileDto>.Fail(
                    result.Errors.Select(e => e.Description).ToList());

            return await GetProfileAsync(userId);
        }

        public async Task<ApiResponseDto<string>> DeleteAccountAsync(Guid userId)
        {
            var user = await userManager.FindByIdAsync(userId.ToString());
            if (user == null)
                return ApiResponseDto<string>.Fail("User not found.");

            user.IsActive  = false;
            user.UpdatedAt = DateTime.UtcNow;

            await userManager.UpdateAsync(user);
            return ApiResponseDto<string>.Ok("Account deactivated successfully.");
        }

        public async Task<ApiResponseDto<SavedDestinationDto>> SaveDestinationAsync(Guid userId, Guid cityId)
        {
            var city = await db.Cities.Include(c => c.Country)
                                       .FirstOrDefaultAsync(c => c.Id == cityId);
            if (city == null)
                return ApiResponseDto<SavedDestinationDto>.Fail("City not found.");

            var exists = await db.SavedDestinations
                .AnyAsync(sd => sd.UserId == userId && sd.CityId == cityId);
            if (exists)
                return ApiResponseDto<SavedDestinationDto>.Fail("Destination already saved.");

            var saved = new SavedDestination
            {
                UserId  = userId,
                CityId  = cityId,
                SavedAt = DateTime.UtcNow
            };

            db.SavedDestinations.Add(saved);
            await db.SaveChangesAsync();

            return ApiResponseDto<SavedDestinationDto>.Ok(new SavedDestinationDto
            {
                Id      = saved.Id,
                City    = MapCity(city),
                SavedAt = saved.SavedAt
            });
        }

        public async Task<ApiResponseDto<string>> RemoveSavedDestinationAsync(Guid userId, Guid cityId)
        {
            var saved = await db.SavedDestinations
                .FirstOrDefaultAsync(sd => sd.UserId == userId && sd.CityId == cityId);

            if (saved == null)
                return ApiResponseDto<string>.Fail("Saved destination not found.");

            db.SavedDestinations.Remove(saved);
            await db.SaveChangesAsync();

            return ApiResponseDto<string>.Ok("Destination removed.");
        }

        public async Task<ApiResponseDto<ICollection<SavedDestinationDto>>> GetSavedDestinationsAsync(Guid userId)
        {
            var list = await db.SavedDestinations
                .Where(sd => sd.UserId == userId)
                .Include(sd => sd.City).ThenInclude(c => c.Country)
                .OrderByDescending(sd => sd.SavedAt)
                .ToListAsync();

            var result = list.Select(sd => new SavedDestinationDto
            {
                Id      = sd.Id,
                City    = MapCity(sd.City),
                SavedAt = sd.SavedAt
            }).ToList();

            return ApiResponseDto<ICollection<SavedDestinationDto>>.Ok(result);
        }

        // ── Mappers ──────────────────────────────────────────────────────────

        private static UserProfileDto MapToProfile(User user) => new()
        {
            Id                 = user.Id,
            FullName           = user.FullName,
            Email              = user.Email!,
            ProfilePhotoUrl    = user.ProfilePhotoUrl,
            LanguagePreference = user.LanguagePreference,
            IsAdmin            = user.IsAdmin,
            PhoneNumber        = user.PhoneNumber,
            EmailConfirmed     = user.EmailConfirmed,
            CreatedAt          = user.CreatedAt,
            SavedDestinations  = user.SavedDestinations
                .Select(sd => MapCity(sd.City))
                .ToList()
        };

        private static LocationDtos.CityDto MapCity(City city) => new()
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
