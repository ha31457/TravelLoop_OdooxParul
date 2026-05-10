using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ActivityController(ActivityService activityService) : ControllerBase
{
    [HttpGet("search")]
    public async Task<IActionResult> SearchActivities([FromQuery] ActivitySearchRequestDto dto)
    {
        var result = await activityService.SearchActivitiesAsync(dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet("{activityId:guid}")]
    public async Task<IActionResult> GetActivityById(Guid activityId)
    {
        var result = await activityService.GetActivityByIdAsync(activityId);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
