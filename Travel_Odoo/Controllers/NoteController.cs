using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/notes")]
[Authorize]
public class NoteController(NoteService noteService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetNotes(Guid tripId, [FromQuery] Guid? stopId)
    {
        var result = await noteService.GetNotesAsync(UserId, tripId, stopId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddNote(Guid tripId, [FromBody] CreateNoteRequestDto dto)
    {
        var result = await noteService.AddNoteAsync(UserId, tripId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{noteId:guid}")]
    public async Task<IActionResult> UpdateNote(Guid tripId, Guid noteId, [FromBody] UpdateNoteRequestDto dto)
    {
        var result = await noteService.UpdateNoteAsync(UserId, tripId, noteId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{noteId:guid}")]
    public async Task<IActionResult> DeleteNote(Guid tripId, Guid noteId)
    {
        var result = await noteService.DeleteNoteAsync(UserId, tripId, noteId);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
