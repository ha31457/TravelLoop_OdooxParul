using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Travel_Odoo.Models;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services;
using LoginRequest = Travel_Odoo.Models.DTOs.LoginRequest;
using RegisterRequest = Travel_Odoo.Models.DTOs.RegisterRequest;

namespace Travel_Odoo.Controllers;

[ApiController]
[Route("api/{controller}")]
public class AuthController(UserManager<User> userManager, SignInManager<User> signInManager, JwtService jwtService) : ControllerBase {
    [HttpPost]
    [Route("register")]
    public async Task<IActionResult> RegisterHandler([FromBody] RegisterRequest request) {
        var existingUser = await userManager.FindByEmailAsync(request.Email);
        if (existingUser is not null)
            return Conflict(new { message = "Email already registered." });

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = request.FullName,
        };

        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = result.Errors.Select(e => e.Description);
            return BadRequest(new { errors });
        }

        // Generate and return token immediately — user is logged in after register
        var token = await jwtService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email!,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60)
        });
    }
    
    [HttpPost]
    [Route("login")]
    public async Task<IActionResult> LoginHandler([FromBody] LoginRequest request) {
        var user = await userManager.FindByEmailAsync(request.Email);
        if (user is null)
            return Unauthorized(new { message = "Invalid email or password." });

        // CheckPasswordSignInAsync handles lockout automatically
        var result = await signInManager.CheckPasswordSignInAsync(
            user, request.Password, lockoutOnFailure: true);

        if (result.IsLockedOut)
            return Unauthorized(new
            {
                message = "Account locked after too many failed attempts. Try again in 5 minutes."
            });

        if (!result.Succeeded)
            return Unauthorized(new { message = "Invalid email or password." });

        var token = await jwtService.GenerateToken(user);

        return Ok(new AuthResponse
        {
            Token = token,
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email!,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60)
        });
    }
    
    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (userId is null) return Unauthorized();

        var user = await userManager.FindByIdAsync(userId);
        if (user is null) return Unauthorized();

        return Ok(new AuthResponse
        {
            Token = "",   // not re-issued here — client already has it
            UserId = user.Id,
            FullName = user.FullName,
            Email = user.Email!,
            ExpiresAt = DateTime.UtcNow.AddMinutes(60)
        });
    }
}