using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/sharing")]
[Authorize]
public class SharingController(SharingService sharingService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> ShareTrip(Guid tripId, [FromBody] CreateTripShareRequestDto dto)
    {
        var result = await sharingService.ShareTripAsync(UserId, tripId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{shareId:guid}")]
    public async Task<IActionResult> RevokeShare(Guid tripId, Guid shareId)
    {
        var result = await sharingService.RevokeShareAsync(UserId, tripId, shareId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetShares(Guid tripId)
    {
        var result = await sharingService.GetSharesAsync(UserId, tripId);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
