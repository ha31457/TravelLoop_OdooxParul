using Microsoft.EntityFrameworkCore;
using Travel_Odoo.Data;
using Travel_Odoo.Models;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Services;

public class NoteService(ApplicationDbContext db) : INoteService {
    public async Task<ApiResponseDto<ICollection<TripNoteDto>>> GetNotesAsync(
            Guid userId, Guid tripId, Guid? stopId)
        {
            if (!await TripBelongsToUserAsync(tripId, userId))
                return ApiResponseDto<ICollection<TripNoteDto>>.Fail("Trip not found.");

            var query = db.TripNotes.Where(n => n.TripId == tripId);

            if (stopId.HasValue)
                query = query.Where(n => n.TripStopId == stopId);

            var notes = await query
                .OrderByDescending(n => n.CreatedAt)
                .ToListAsync();

            return ApiResponseDto<ICollection<TripNoteDto>>.Ok(notes.Select(MapNote).ToList());
        }

        public async Task<ApiResponseDto<TripNoteDto>> AddNoteAsync(
            Guid userId, Guid tripId, CreateNoteRequestDto dto)
        {
            if (!await TripBelongsToUserAsync(tripId, userId))
                return ApiResponseDto<TripNoteDto>.Fail("Trip not found.");

            if (dto.TripStopId.HasValue)
            {
                var stopExists = await db.TripStops
                    .AnyAsync(s => s.Id == dto.TripStopId && s.TripId == tripId);
                if (!stopExists)
                    return ApiResponseDto<TripNoteDto>.Fail("Trip stop not found.");
            }

            var note = new TripNote
            {
                TripId     = tripId,
                TripStopId = dto.TripStopId,
                Title      = dto.Title,
                Content    = dto.Content,
                NoteDate   = dto.NoteDate,
                CreatedAt  = DateTime.UtcNow
            };

            db.TripNotes.Add(note);
            await db.SaveChangesAsync();

            return ApiResponseDto<TripNoteDto>.Ok(MapNote(note));
        }

        public async Task<ApiResponseDto<TripNoteDto>> UpdateNoteAsync(
            Guid userId, Guid tripId, Guid noteId, UpdateNoteRequestDto dto)
        {
            var note = await LoadNoteAsync(userId, tripId, noteId);
            if (note == null)
                return ApiResponseDto<TripNoteDto>.Fail("Note not found.");

            note.Title     = dto.Title;
            note.Content   = dto.Content;
            note.NoteDate  = dto.NoteDate;
            note.UpdatedAt = DateTime.UtcNow;

            await db.SaveChangesAsync();
            return ApiResponseDto<TripNoteDto>.Ok(MapNote(note));
        }

        public async Task<ApiResponseDto<string>> DeleteNoteAsync(Guid userId, Guid tripId, Guid noteId)
        {
            var note = await LoadNoteAsync(userId, tripId, noteId);
            if (note == null)
                return ApiResponseDto<string>.Fail("Note not found.");

            db.TripNotes.Remove(note);
            await db.SaveChangesAsync();

            return ApiResponseDto<string>.Ok("Note deleted.");
        }

        // ── Helpers ──────────────────────────────────────────────────────────

        private async Task<bool> TripBelongsToUserAsync(Guid tripId, Guid userId) =>
            await db.Trips.AnyAsync(t => t.Id == tripId && t.UserId == userId);

        private async Task<TripNote?> LoadNoteAsync(Guid userId, Guid tripId, Guid noteId) =>
            await db.TripNotes
                .Include(n => n.Trip)
                .FirstOrDefaultAsync(n => n.Id == noteId
                                       && n.TripId == tripId
                                       && n.Trip.UserId == userId);

        private static TripNoteDto MapNote(TripNote n) => new()
        {
            Id         = n.Id,
            TripId     = n.TripId,
            TripStopId = n.TripStopId,
            Title      = n.Title,
            Content    = n.Content,
            NoteDate   = n.NoteDate,
            CreatedAt  = n.CreatedAt,
            UpdatedAt  = n.UpdatedAt
        };
    }
