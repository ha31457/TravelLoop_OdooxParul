namespace Travel_Odoo.Models.DTOs;

public class AiPackingItemDto
{
    public string Name     { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

public class AiPackingListDto
{
    public List<AiPackingItemDto> Items { get; set; } = [];
}

public class SavePackingListRequestDto
{
    public List<AiPackingItemDto> Items { get; set; } = [];
}
public class AiBudgetExpenseDto
{
    public string Label        { get; set; } = string.Empty;
    public string Category     { get; set; } = string.Empty;
    public decimal Amount      { get; set; }
    public string CurrencyCode { get; set; } = string.Empty;
    public string ExpenseDate  { get; set; } = string.Empty;
}
public class AiItineraryCityDto
{
    public string CityName   { get; set; } = string.Empty;
    public string CountryName { get; set; } = string.Empty;
    public DateOnly ArrivalDate   { get; set; }
    public DateOnly DepartureDate { get; set; }
    public string? Notes { get; set; }
}

public class TripPublishResultDto
{
    public string PublicSlug             { get; set; } = string.Empty;
    public AiPackingListDto? PackingList { get; set; }
}

public class AiActivityDto
{
    public string Name            { get; set; } = string.Empty;
    public string Description     { get; set; } = string.Empty;
    public string Category        { get; set; } = string.Empty;
    public decimal? EstimatedCost { get; set; }
    public int? DurationMinutes   { get; set; }
}