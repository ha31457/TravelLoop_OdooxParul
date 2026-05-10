using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TripController(TripService tripService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpPost]
    public async Task<IActionResult> CreateTrip([FromBody] CreateTripRequestDto dto)
    {
        var result = await tripService.CreateTripAsync(UserId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{tripId:guid}")]
    public async Task<IActionResult> GetTripById(Guid tripId)
    {
        var result = await tripService.GetTripByIdAsync(UserId, tripId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserTrips([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var result = await tripService.GetUserTripsAsync(UserId, page, pageSize);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("{tripId:guid}")]
    public async Task<IActionResult> UpdateTrip(Guid tripId, [FromBody] UpdateTripRequestDto dto)
    {
        var result = await tripService.UpdateTripAsync(UserId, tripId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("{tripId:guid}")]
    public async Task<IActionResult> DeleteTrip(Guid tripId)
    {
        var result = await tripService.DeleteTripAsync(UserId, tripId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("{tripId:guid}/publish")]
    public async Task<IActionResult> PublishTrip(Guid tripId)
    {
        var result = await tripService.PublishTripAsync(UserId, tripId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [AllowAnonymous]
    [HttpGet("public/{slug}")]
    public async Task<IActionResult> GetPublicTrip(string slug)
    {
        var result = await tripService.GetPublicTripAsync(slug);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("copy/{slug}")]
    public async Task<IActionResult> CopyTrip(string slug)
    {
        var result = await tripService.CopyTripAsync(UserId, slug);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
