using Microsoft.EntityFrameworkCore;
using Travel_Odoo.Data;
using Travel_Odoo.Models;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Services.Interfaces;

namespace Travel_Odoo.Services;

public class BudgetService(ApplicationDbContext db) : IBudgetService {
    public async Task<ApiResponseDto<BudgetSummaryDto>> GetBudgetSummaryAsync(Guid userId, Guid tripId)
        {
            var trip = await db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null)
                return ApiResponseDto<BudgetSummaryDto>.Fail("Trip not found.");

            var expenses = await db.BudgetExpenses.Where(b => b.TripId == tripId).ToListAsync();

            return ApiResponseDto<BudgetSummaryDto>.Ok(BuildSummary(trip, expenses));
        }

        public async Task<ApiResponseDto<BudgetExpenseDto>> AddExpenseAsync(
            Guid userId, Guid tripId, CreateExpenseRequestDto dto)
        {
            var trip = await db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null)
                return ApiResponseDto<BudgetExpenseDto>.Fail("Trip not found.");

            if (dto.TripStopId.HasValue)
            {
                var stopExists = await db.TripStops
                    .AnyAsync(s => s.Id == dto.TripStopId && s.TripId == tripId);
                if (!stopExists)
                    return ApiResponseDto<BudgetExpenseDto>.Fail("Trip stop not found.");
            }

            var expense = new BudgetExpense
            {
                TripId       = tripId,
                TripStopId   = dto.TripStopId,
                Label        = dto.Label,
                Category     = dto.Category,
                Amount       = dto.Amount,
                CurrencyCode = dto.CurrencyCode,
                ExpenseDate  = dto.ExpenseDate,
                IsEstimate   = dto.IsEstimate
            };

            db.BudgetExpenses.Add(expense);
            await db.SaveChangesAsync();

            return ApiResponseDto<BudgetExpenseDto>.Ok(MapExpense(expense));
        }

        public async Task<ApiResponseDto<BudgetExpenseDto>> UpdateExpenseAsync(
            Guid userId, Guid tripId, Guid expenseId, UpdateExpenseRequestDto dto)
        {
            var expense = await LoadExpenseAsync(userId, tripId, expenseId);
            if (expense == null)
                return ApiResponseDto<BudgetExpenseDto>.Fail("Expense not found.");

            expense.TripStopId   = dto.TripStopId;
            expense.Label        = dto.Label;
            expense.Category     = dto.Category;
            expense.Amount       = dto.Amount;
            expense.CurrencyCode = dto.CurrencyCode;
            expense.ExpenseDate  = dto.ExpenseDate;
            expense.IsEstimate   = dto.IsEstimate;

            await db.SaveChangesAsync();

            return ApiResponseDto<BudgetExpenseDto>.Ok(MapExpense(expense));
        }

        public async Task<ApiResponseDto<string>> DeleteExpenseAsync(Guid userId, Guid tripId, Guid expenseId)
        {
            var expense = await LoadExpenseAsync(userId, tripId, expenseId);
            if (expense == null)
                return ApiResponseDto<string>.Fail("Expense not found.");

            db.BudgetExpenses.Remove(expense);
            await db.SaveChangesAsync();

            return ApiResponseDto<string>.Ok("Expense deleted.");
        }

        public async Task<ApiResponseDto<ICollection<BudgetExpenseDto>>> GetExpensesAsync(
            Guid userId, Guid tripId)
        {
            var trip = await db.Trips.FirstOrDefaultAsync(t => t.Id == tripId && t.UserId == userId);
            if (trip == null)
                return ApiResponseDto<ICollection<BudgetExpenseDto>>.Fail("Trip not found.");

            var expenses = await db.BudgetExpenses
                .Where(b => b.TripId == tripId)
                .OrderBy(b => b.ExpenseDate)
                .ToListAsync();

            return ApiResponseDto<ICollection<BudgetExpenseDto>>.Ok(
                expenses.Select(MapExpense).ToList());
        }

        // ── Helpers ──────────────────────────────────────────────────────────

        private async Task<BudgetExpense?> LoadExpenseAsync(Guid userId, Guid tripId, Guid expenseId) =>
            await db.BudgetExpenses
                .Include(b => b.Trip)
                .FirstOrDefaultAsync(b => b.Id == expenseId
                                       && b.TripId == tripId
                                       && b.Trip.UserId == userId);

        private static BudgetSummaryDto BuildSummary(Trip trip, List<BudgetExpense> expenses)
        {
            var totalEstimated = expenses.Where(e => e.IsEstimate).Sum(e => e.Amount);
            var totalActual    = expenses.Where(e => !e.IsEstimate).Sum(e => e.Amount);
            var totalSpend     = totalActual > 0 ? totalActual : totalEstimated;
            var days           = (trip.EndDate.DayNumber - trip.StartDate.DayNumber) + 1;

            var breakdown = expenses
                .GroupBy(e => e.Category)
                .Select(g => new BudgetCategoryBreakdownDto
                {
                    Category   = g.Key.ToString(),
                    Total      = g.Sum(e => e.Amount),
                    Percentage = totalSpend > 0
                        ? Math.Round(g.Sum(e => e.Amount) / totalSpend * 100, 2)
                        : 0
                }).ToList();

            return new BudgetSummaryDto
            {
                TotalBudget       = trip.TotalBudget,
                TotalEstimated    = totalEstimated,
                TotalActual       = totalActual,
                Remaining         = (trip.TotalBudget ?? 0) - totalSpend,
                AverageCostPerDay = days > 0 ? Math.Round(totalSpend / days, 2) : 0,
                CurrencyCode      = trip.CurrencyCode,
                IsOverBudget      = trip.TotalBudget.HasValue && totalSpend > trip.TotalBudget.Value,
                Breakdown         = breakdown
            };
        }

        private static BudgetExpenseDto MapExpense(BudgetExpense e) => new()
        {
            Id           = e.Id,
            TripId       = e.TripId,
            TripStopId   = e.TripStopId,
            Label        = e.Label,
            Category     = e.Category.ToString(),
            Amount       = e.Amount,
            CurrencyCode = e.CurrencyCode,
            ExpenseDate  = e.ExpenseDate,
            IsEstimate   = e.IsEstimate
        };
    }
