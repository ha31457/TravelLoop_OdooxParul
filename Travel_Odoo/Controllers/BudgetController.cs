using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Controllers;

[ApiController]
[Route("api/trips/{tripId:guid}/budget")]
[Authorize]
public class BudgetController(BudgetService budgetService) : ControllerBase
{
    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet("summary")]
    public async Task<IActionResult> GetBudgetSummary(Guid tripId)
    {
        var result = await budgetService.GetBudgetSummaryAsync(UserId, tripId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPost("expenses")]
    public async Task<IActionResult> AddExpense(Guid tripId, [FromBody] CreateExpenseRequestDto dto)
    {
        var result = await budgetService.AddExpenseAsync(UserId, tripId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("expenses/{expenseId:guid}")]
    public async Task<IActionResult> UpdateExpense(Guid tripId, Guid expenseId, [FromBody] UpdateExpenseRequestDto dto)
    {
        var result = await budgetService.UpdateExpenseAsync(UserId, tripId, expenseId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("expenses/{expenseId:guid}")]
    public async Task<IActionResult> DeleteExpense(Guid tripId, Guid expenseId)
    {
        var result = await budgetService.DeleteExpenseAsync(UserId, tripId, expenseId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpGet("expenses")]
    public async Task<IActionResult> GetExpenses(Guid tripId)
    {
        var result = await budgetService.GetExpensesAsync(UserId, tripId);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}
