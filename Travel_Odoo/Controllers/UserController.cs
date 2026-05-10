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
public class UserController(UserService userService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("profile")]
    public async Task<IActionResult> GetProfile()
    {
        var result = await userService.GetProfileAsync(UserId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("profile")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequestDto dto)
    {
        var result = await userService.UpdateProfileAsync(UserId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("account")]
    public async Task<IActionResult> DeleteAccount()
    {
        var result = await userService.DeleteAccountAsync(UserId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("destinations/{cityId:guid}")]
    public async Task<IActionResult> SaveDestination(Guid cityId)
    {
        var result = await userService.SaveDestinationAsync(UserId, cityId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("destinations/{cityId:guid}")]
    public async Task<IActionResult> RemoveSavedDestination(Guid cityId)
    {
        var result = await userService.RemoveSavedDestinationAsync(UserId, cityId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet("destinations")]
    public async Task<IActionResult> GetSavedDestinations()
    {
        var result = await userService.GetSavedDestinationsAsync(UserId);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
