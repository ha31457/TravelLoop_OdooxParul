using Microsoft.EntityFrameworkCore;
using Travel_Odoo.Data;
using Travel_Odoo.Models;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Services;

public class PackingService(ApplicationDbContext db) : IPackingService {
    public async Task<ApiResponseDto<PackingChecklistDto>> GetChecklistAsync(Guid userId, Guid tripId)
        {
            if (!await TripBelongsToUserAsync(tripId, userId))
                return ApiResponseDto<PackingChecklistDto>.Fail("Trip not found.");

            var items = await db.PackingItems
                .Where(p => p.TripId == tripId)
                .OrderBy(p => p.Category).ThenBy(p => p.SortOrder)
                .ToListAsync();

            var grouped = items
                .GroupBy(p => p.Category)
                .Select(g => new PackingItemsByCategoryDto
                {
                    Category = g.Key.ToString(),
                    Items    = g.Select(MapItem).ToList()
                }).ToList();

            return ApiResponseDto<PackingChecklistDto>.Ok(new PackingChecklistDto
            {
                TotalItems  = items.Count,
                PackedItems = items.Count(p => p.IsPacked),
                Categories  = grouped
            });
        }

        public async Task<ApiResponseDto<PackingItemDto>> AddItemAsync(
            Guid userId, Guid tripId, CreatePackingItemRequestDto dto)
        {
            if (!await TripBelongsToUserAsync(tripId, userId))
                return ApiResponseDto<PackingItemDto>.Fail("Trip not found.");

            var item = new PackingItem
            {
                TripId    = tripId,
                Name      = dto.Name,
                Category  = dto.Category,
                SortOrder = dto.SortOrder
            };

            db.PackingItems.Add(item);
            await db.SaveChangesAsync();

            return ApiResponseDto<PackingItemDto>.Ok(MapItem(item));
        }
            
        public async Task<ApiResponseDto<PackingChecklistDto>> SaveAiPackingListAsync(
            Guid userId, Guid tripId, SavePackingListRequestDto dto)
        {
            if (!await TripBelongsToUserAsync(tripId, userId))
                return ApiResponseDto<PackingChecklistDto>.Fail("Trip not found.");

            foreach (var item in dto.Items)
            {
                if (!Enum.TryParse<PackingCategory>(item.Category, true, out var category))
                    category = PackingCategory.Other;

                db.PackingItems.Add(new PackingItem
                {
                    TripId   = tripId,
                    Name     = item.Name,
                    Category = category
                });
            }

            await db.SaveChangesAsync();
            return await GetChecklistAsync(userId, tripId);
        }
        
        public async Task<ApiResponseDto<PackingItemDto>> UpdateItemAsync(
            Guid userId, Guid tripId, Guid itemId, UpdatePackingItemRequestDto dto)
        {
            var item = await LoadItemAsync(userId, tripId, itemId);
            if (item == null)
                return ApiResponseDto<PackingItemDto>.Fail("Item not found.");

            item.Name      = dto.Name;
            item.Category  = dto.Category;
            item.SortOrder = dto.SortOrder;
            item.IsPacked  = dto.IsPacked;

            await db.SaveChangesAsync();
            return ApiResponseDto<PackingItemDto>.Ok(MapItem(item));
        }

        public async Task<ApiResponseDto<string>> DeleteItemAsync(Guid userId, Guid tripId, Guid itemId)
        {
            var item = await LoadItemAsync(userId, tripId, itemId);
            if (item == null)
                return ApiResponseDto<string>.Fail("Item not found.");

            db.PackingItems.Remove(item);
            await db.SaveChangesAsync();

            return ApiResponseDto<string>.Ok("Item removed.");
        }

        public async Task<ApiResponseDto<string>> ResetChecklistAsync(Guid userId, Guid tripId)
        {
            if (!await TripBelongsToUserAsync(tripId, userId))
                return ApiResponseDto<string>.Fail("Trip not found.");

            var items = await db.PackingItems.Where(p => p.TripId == tripId).ToListAsync();
            items.ForEach(i => i.IsPacked = false);

            await db.SaveChangesAsync();
            return ApiResponseDto<string>.Ok("Checklist reset.");
        }

        // ── Helpers ──────────────────────────────────────────────────────────

        private async Task<bool> TripBelongsToUserAsync(Guid tripId, Guid userId) =>
            await db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);

        private async Task<PackingItem?> LoadItemAsync(Guid userId, Guid tripId, Guid itemId) =>
            await db.PackingItems
                .Include(p => p.Trip)
                .FirstOrDefaultAsync(p => p.Id == itemId
                                       && p.TripId == tripId
                                       && p.Trip.UserId == userId);

        private static PackingItemDto MapItem(PackingItem p) => new()
        {
            Id        = p.Id,
            Name      = p.Name,
            Category  = p.Category.ToString(),
            IsPacked  = p.IsPacked,
            SortOrder = p.SortOrder
        };
    }
