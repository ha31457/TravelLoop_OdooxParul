using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/stops")]
[Authorize]
public class TripStopController(TripStopService tripStopService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> AddStop(Guid tripId, [FromBody] CreateTripStopRequestDto dto)
    {
        var result = await tripStopService.AddStopAsync(UserId, tripId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{stopId:guid}")]
    public async Task<IActionResult> UpdateStop(Guid tripId, Guid stopId, [FromBody] UpdateTripStopRequestDto dto)
    {
        var result = await tripStopService.UpdateStopAsync(UserId, tripId, stopId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{stopId:guid}")]
    public async Task<IActionResult> DeleteStop(Guid tripId, Guid stopId)
    {
        var result = await tripStopService.DeleteStopAsync(UserId, tripId, stopId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("reorder")]
    public async Task<IActionResult> ReorderStops(Guid tripId, [FromBody] ReorderStopsRequestDto dto)
    {
        var result = await tripStopService.ReorderStopsAsync(UserId, tripId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{stopId:guid}/activities")]
    public async Task<IActionResult> AddActivityToStop(Guid tripId, Guid stopId, [FromBody] AddStopActivityRequestDto dto)
    {
        var result = await tripStopService.AddActivityToStopAsync(UserId, tripId, stopId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{stopId:guid}/activities/{stopActivityId:guid}")]
    public async Task<IActionResult> UpdateStopActivity(Guid tripId, Guid stopId, Guid stopActivityId, [FromBody] UpdateStopActivityRequestDto dto)
    {
        var result = await tripStopService.UpdateStopActivityAsync(UserId, tripId, stopId, stopActivityId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{stopId:guid}/activities/{stopActivityId:guid}")]
    public async Task<IActionResult> RemoveActivityFromStop(Guid tripId, Guid stopId, Guid stopActivityId)
    {
        var result = await tripStopService.RemoveActivityFromStopAsync(UserId, tripId, stopId, stopActivityId);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
