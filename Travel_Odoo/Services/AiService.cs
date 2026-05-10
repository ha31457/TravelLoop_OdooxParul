using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Travel_Odoo.Data;
using Travel_Odoo.Models;
using Travel_Odoo.Models.DTOs;
using Travel_Odoo.Settings;

namespace Travel_Odoo.Services;

public class AiService(
    ApplicationDbContext db,
    HttpClient httpClient,
    IOptions<GeminiSettings> geminiOptions)
{
    private readonly GeminiSettings _gemini = geminiOptions.Value;

    // ── Core Gemini Call ─────────────────────────────────────────────────────

    private async Task<string?> GenerateAsync(string prompt)
    {
        var url = $"{_gemini.BaseUrl}/{_gemini.Model}:generateContent?key={_gemini.ApiKey}";

        var payload = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            }
        };

        var json    = JsonSerializer.Serialize(payload);
        var content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await httpClient.PostAsync(url, content);
        if (!response.IsSuccessStatusCode) return null;

        var raw  = await response.Content.ReadAsStringAsync();
        var doc  = JsonDocument.Parse(raw);

        return doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts")[0]
            .GetProperty("text")
            .GetString();
    }

    private static string? ExtractJson(string? raw)
    {
        if (raw == null) return null;
        var start = raw.IndexOf('[');
        var end   = raw.LastIndexOf(']');
        if (start == -1 || end == -1)
        {
            start = raw.IndexOf('{');
            end   = raw.LastIndexOf('}');
        }
        return start == -1 || end == -1 ? null : raw[start..(end + 1)];
    }

    // ── 1. Itinerary Suggestion (called after trip creation) ─────────────────

    public async Task SuggestItineraryAsync(Trip trip)
    {
        var prompt = $$"""
            You are a travel planner. Suggest a detailed day-by-day itinerary for a trip named "{{trip.Name}}".
            Trip dates: {{trip.StartDate}} to {{trip.EndDate}}.
            Budget: {{trip.TotalBudget}} {{trip.CurrencyCode}}.
            Description: {{trip.Description ?? "Not provided"}}.

            Return a JSON array of stops. Each stop:
            {
              "cityName": "string",
              "countryName": "string",
              "arrivalDate": "YYYY-MM-DD",
              "departureDate": "YYYY-MM-DD",
              "notes": "string"
            }
            Return only the JSON array, no explanation.
            """;

        var raw  = await GenerateAsync(prompt);
        var json = ExtractJson(raw);
        if (json == null) return;

        List<AiItineraryCityDto>? suggestions;
        try { suggestions = JsonSerializer.Deserialize<List<AiItineraryCityDto>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }); }
        catch { return; }

        if (suggestions == null) return;

        for (int i = 0; i < suggestions.Count; i++)
        {
            var s = suggestions[i];

            var country = await db.Countries
                .FirstOrDefaultAsync(c => c.Name.ToLower() == s.CountryName.ToLower());

            if (country == null)
            {
                country = new Country { Name = s.CountryName, IsoCode = "AI", Region = "AI-Generated" };
                db.Countries.Add(country);
                await db.SaveChangesAsync();
            }

            var city = await db.Cities
                .FirstOrDefaultAsync(c => c.Name.ToLower() == s.CityName.ToLower()
                                       && c.CountryId == country.Id);
            if (city == null)
            {
                city = new City
                {
                    Name        = s.CityName,
                    CountryId   = country.Id,
                    IsAiGenerated = true
                };
                db.Cities.Add(city);
                await db.SaveChangesAsync();
            }

            var stop = new TripStop
            {
                TripId        = trip.Id,
                CityId        = city.Id,
                ArrivalDate   = s.ArrivalDate,
                DepartureDate = s.DepartureDate,
                OrderIndex    = i,
                Notes         = s.Notes,
                IsAiGenerated = true
            };

            db.TripStops.Add(stop);
        }

        await db.SaveChangesAsync();
    }

    // ── 2. Activity Recommendation (called after stop is added) ──────────────

    public async Task SuggestActivitiesAsync(TripStop stop, City city)
    {
        var prompt = $$"""
            You are a travel guide. Suggest 3 to 5 activities for a traveler visiting {{city.Name}}.
            Return a JSON array. Each item:
            {
              "name": "string",
              "description": "string",
              "category": "one of: Sightseeing, Food, Adventure, Culture, Shopping, Relaxation, Nightlife, Other",
              "estimatedCost": number or null,
              "durationMinutes": number or null
            }
            Return only the JSON array, no explanation.
            """;

        var raw  = await GenerateAsync(prompt);
        var json = ExtractJson(raw);
        if (json == null) return;

        List<AiActivityDto>? suggestions;
        try { suggestions = JsonSerializer.Deserialize<List<AiActivityDto>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }); }
        catch { return; }

        if (suggestions == null) return;

        foreach (var s in suggestions)
        {
            if (!Enum.TryParse<ActivityCategory>(s.Category, true, out var category))
                category = ActivityCategory.Other;

            var existing = await db.CityActivities
                .FirstOrDefaultAsync(a => a.CityId == city.Id &&
                                          a.Name.ToLower() == s.Name.ToLower());

            CityActivity activity;
            if (existing != null)
            {
                activity = existing;
            }
            else
            {
                activity = new CityActivity
                {
                    CityId          = city.Id,
                    Name            = s.Name,
                    Description     = s.Description,
                    Category        = category,
                    EstimatedCost   = s.EstimatedCost,
                    DurationMinutes = s.DurationMinutes,
                    IsAiGenerated   = true
                };
                db.CityActivities.Add(activity);
                await db.SaveChangesAsync();
            }

            var alreadyAdded = await db.StopActivities
                .AnyAsync(sa => sa.TripStopId == stop.Id && sa.CityActivityId == activity.Id);
            if (alreadyAdded) continue;

            db.StopActivities.Add(new StopActivity
            {
                TripStopId     = stop.Id,
                CityActivityId = activity.Id,
                IsAiGenerated  = true
            });
        }

        await db.SaveChangesAsync();
    }

    // ── 3. Budget Estimation (called before publish) ─────────────────────────

    public async Task EstimateBudgetAsync(Trip trip)
    {
        var stops = await db.TripStops
            .Include(s => s.City)
            .Where(s => s.TripId == trip.Id)
            .ToListAsync();

        var cityNames = stops.Select(s => s.City.Name).Distinct();

        var prompt = $$"""
            You are a travel budget expert. Estimate expenses for a trip to: {{string.Join(", ", cityNames)}}.
            Trip duration: {{trip.StartDate}} to {{trip.EndDate}}.
            Total budget: {{trip.TotalBudget}} {{trip.CurrencyCode}}.

            Return a JSON array of expense estimates:
            {
              "label": "string",
              "category": "one of: Accommodation, Food, Transport, Activities, Shopping, Health, Visa, Miscellaneous",
              "amount": number,
              "currencyCode": "{trip.CurrencyCode}",
              "expenseDate": "YYYY-MM-DD"
            }
            Return only the JSON array, no explanation.
            """;

        var raw  = await GenerateAsync(prompt);
        var json = ExtractJson(raw);
        if (json == null) return;

        List<AiBudgetExpenseDto>? suggestions;
        try { suggestions = JsonSerializer.Deserialize<List<AiBudgetExpenseDto>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }); }
        catch { return; }

        if (suggestions == null) return;

        foreach (var s in suggestions)
        {
            if (!Enum.TryParse<ExpenseCategory>(s.Category, true, out var category))
                category = ExpenseCategory.Other;

            db.BudgetExpenses.Add(new BudgetExpense
            {
                TripId       = trip.Id,
                Label        = s.Label,
                Category     = category,
                Amount       = s.Amount,
                CurrencyCode = s.CurrencyCode,
                ExpenseDate  = DateOnly.Parse(s.ExpenseDate),
                IsEstimate   = true,
                IsAiGenerated = true
            });
        }

        await db.SaveChangesAsync();
    }

    // ── 4. Packing List Suggestion (called before publish) ───────────────────

    public async Task<AiPackingListDto?> SuggestPackingListAsync(Trip trip)
    {
        var stops = await db.TripStops
            .Include(s => s.City)
            .Where(s => s.TripId == trip.Id)
            .ToListAsync();

        var cityNames = stops.Select(s => s.City.Name).Distinct();

        var prompt = $$"""
            You are a travel packing assistant. Suggest a packing list for a trip to: {{string.Join(", ", cityNames)}}.
            Trip duration: {{trip.StartDate}} to {{trip.EndDate}}.

            Return a JSON array:
            {
              "name": "string",
              "category": "one of: Clothing, Toiletries, Electronics, Documents, Medications, Accessories, Miscellaneous"
            }
            Return only the JSON array, no explanation.
            """;

        var raw  = await GenerateAsync(prompt);
        var json = ExtractJson(raw);
        if (json == null) return null;

        List<AiPackingItemDto>? items;
        try { items = JsonSerializer.Deserialize<List<AiPackingItemDto>>(json, new JsonSerializerOptions { PropertyNameCaseInsensitive = true }); }
        catch { return null; }

        return items == null ? null : new AiPackingListDto { Items = items };
    }

    // ── 5. Note Summary (called on GetTripById when notes >= 5) ─────────────

    public async Task SummarizeNotesAsync(Trip trip)
    {
        var notes = await db.TripNotes
            .Where(n => n.TripId == trip.Id && n.Tag != "Summary")
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();

        if (notes.Count < 5) return;

        if (trip.HasAiSummary) return;

        trip.HasAiSummary = true;
        await db.SaveChangesAsync();

        var noteTexts = notes.Select(n => $"- {n.Title}: {n.Content}");

        var prompt = $"""
            You are a travel assistant. Summarize the following trip notes into a concise paragraph:
            {string.Join("\n", noteTexts)}
            Return only the summary text, no explanation.
            """;

        var summary = await GenerateAsync(prompt);
        if (string.IsNullOrWhiteSpace(summary)) return;

        db.TripNotes.Add(new TripNote
        {
            TripId    = trip.Id,
            Title     = "AI Trip Summary",
            Content   = summary.Trim(),
            Tag       = "Summary",
            NoteDate  = DateOnly.FromDateTime(DateTime.UtcNow),
            CreatedAt = DateTime.UtcNow
        });

        await db.SaveChangesAsync();
    }
}