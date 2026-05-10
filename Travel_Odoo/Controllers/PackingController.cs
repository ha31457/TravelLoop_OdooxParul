using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/packing")]
[Authorize]
public class PackingController(PackingService packingService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetChecklist(Guid tripId)
    {
        var result = await packingService.GetChecklistAsync(UserId, tripId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("items")]
    public async Task<IActionResult> AddItem(Guid tripId, [FromBody] CreatePackingItemRequestDto dto)
    {
        var result = await packingService.AddItemAsync(UserId, tripId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("items/{itemId:guid}")]
    public async Task<IActionResult> UpdateItem(Guid tripId, Guid itemId, [FromBody] UpdatePackingItemRequestDto dto)
    {
        var result = await packingService.UpdateItemAsync(UserId, tripId, itemId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("items/{itemId:guid}")]
    public async Task<IActionResult> DeleteItem(Guid tripId, Guid itemId)
    {
        var result = await packingService.DeleteItemAsync(UserId, tripId, itemId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("reset")]
    public async Task<IActionResult> ResetChecklist(Guid tripId)
    {
        var result = await packingService.ResetChecklistAsync(UserId, tripId);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
