using System.ComponentModel.DataAnnotations;

namespace Travel_Odoo.Models.DTOs;

public class TripNoteDto
{
    public Guid Id { get; set; }
    public Guid TripId { get; set; }
    public Guid? TripStopId { get; set; }
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public DateOnly? NoteDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

public class CreateNoteRequestDto
{
    public Guid? TripStopId { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = null!;

    [Required]
    public string Content { get; set; } = null!;

    public DateOnly? NoteDate { get; set; }
}

public class UpdateNoteRequestDto : CreateNoteRequestDto { }
