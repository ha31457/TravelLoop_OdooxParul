using System.ComponentModel.DataAnnotations;

namespace Travel_Odoo.Models.DTOs;

public class BudgetExpenseDto
{
    public Guid Id { get; set; }
    public Guid TripId { get; set; }
    public Guid? TripStopId { get; set; }
    public string Label { get; set; } = null!;
    public string Category { get; set; } = null!;
    public decimal Amount { get; set; }
    public string CurrencyCode { get; set; } = null!;
    public DateOnly? ExpenseDate { get; set; }
    public bool IsEstimate { get; set; }
}

public class CreateExpenseRequestDto
{
    public Guid? TripStopId { get; set; }

    [Required, MaxLength(150)]
    public string Label { get; set; } = null!;

    [Required]
    public ExpenseCategory Category { get; set; }

    [Required, Range(0, double.MaxValue)]
    public decimal Amount { get; set; }

    [MaxLength(3), MinLength(3)]
    public string CurrencyCode { get; set; } = "USD";

    public DateOnly? ExpenseDate { get; set; }

    public bool IsEstimate { get; set; } = true;
}

public class UpdateExpenseRequestDto : CreateExpenseRequestDto { }

public class BudgetCategoryBreakdownDto
{
    public string Category { get; set; } = null!;
    public decimal Total { get; set; }
    public decimal Percentage { get; set; }
}

public class BudgetSummaryDto
{
    public decimal? TotalBudget { get; set; }
    public decimal TotalEstimated { get; set; }
    public decimal TotalActual { get; set; }
    public decimal Remaining { get; set; }
    public decimal AverageCostPerDay { get; set; }
    public string CurrencyCode { get; set; } = null!;
    public bool IsOverBudget { get; set; }
    public ICollection<BudgetCategoryBreakdownDto> Breakdown { get; set; } = new List<BudgetCategoryBreakdownDto>();
}
