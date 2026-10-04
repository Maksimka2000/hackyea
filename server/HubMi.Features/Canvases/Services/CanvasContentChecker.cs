using System.Globalization;
using System.Text.Json;
using HubMi.Features.Canvases.Contracts;
using HubMi.Features.Canvases.Ports;

namespace HubMi.Features.Canvases.Services;

/// <summary>
/// Reads canvas content against its template. Errors reject a save (wrong shapes, too long text); warnings only inform
/// (a plan period longer than the call allows, costs that do not add up to the requested grant).
/// </summary>
public sealed class CanvasContentChecker
{
    public const string PlanType = "plan";
    public const string AmountType = "amount";
    public const int MaxPlanRowsPerPhase = 20;
    public const int MaxActionLength = 500;

    public Dictionary<string, string[]> Validate(CanvasTemplate template, JsonElement content)
    {
        var errors = new Dictionary<string, string[]>();
        if (content.ValueKind != JsonValueKind.Object)
        {
            errors["content"] = ["Treść kanwy musi być obiektem."];
            return errors;
        }

        var boards = template.Boards.ToDictionary(b => b.Key, StringComparer.Ordinal);
        foreach (var property in content.EnumerateObject())
        {
            if (!boards.TryGetValue(property.Name, out var board))
            {
                errors[property.Name] = ["Nieznana tablica."];
                continue;
            }

            var value = property.Value;
            if (value.ValueKind == JsonValueKind.Null)
                continue;

            switch (board.Type)
            {
                case AmountType when value.ValueKind != JsonValueKind.Number || value.GetDecimal() < 0:
                    errors[board.Key] = ["Podaj kwotę jako liczbę nieujemną."];
                    break;
                case PlanType:
                    ValidatePlan(board, value, errors);
                    break;
                case not (AmountType or PlanType) when value.ValueKind != JsonValueKind.String:
                    errors[board.Key] = ["Odpowiedź musi być tekstem."];
                    break;
                case not (AmountType or PlanType) when board.MaxLength is { } max && value.GetString()!.Length > max:
                    errors[board.Key] = [$"Najwyżej {max} znaków."];
                    break;
            }
        }

        return errors;
    }

    public IReadOnlyList<CanvasWarning> Warn(CanvasTemplate template, JsonElement content)
    {
        var warnings = new List<CanvasWarning>();
        if (content.ValueKind != JsonValueKind.Object)
            return warnings;

        decimal? planTotal = null;
        foreach (var board in template.Boards.Where(b => b.Type == PlanType))
        {
            if (!content.TryGetProperty(board.Key, out var plan) || plan.ValueKind != JsonValueKind.Object)
                continue;

            var rows = board.Phases!
                .Select(phase => (phase, rows: plan.TryGetProperty(phase.Key, out var r) && r.ValueKind == JsonValueKind.Array
                    ? r.EnumerateArray().ToList()
                    : []))
                .ToList();

            planTotal = rows.SelectMany(p => p.rows).Sum(Cost);

            foreach (var period in board.Periods ?? [])
            {
                var months = rows.Where(p => p.phase.Period == period.Key).SelectMany(p => p.rows).Select(Months).Where(m => m is not null).ToList();
                if (months.Count == 0)
                    continue;

                var first = months.Min(m => m!.Value.From);
                var last = months.Max(m => m!.Value.To);
                var span = (last.Year - first.Year) * 12 + last.Month - first.Month + 1;
                if (span > period.MaxMonths)
                    warnings.Add(new CanvasWarning(
                        "periodTooLong",
                        $"{period.Title} trwa {span} mies., a może najwyżej {period.MaxMonths}.",
                        board.Key));
            }
        }

        var amountBoard = template.Boards.FirstOrDefault(b => b.Type == AmountType);
        if (planTotal is > 0 && amountBoard is not null
            && content.TryGetProperty(amountBoard.Key, out var amount) && amount.ValueKind == JsonValueKind.Number
            && amount.GetDecimal() != planTotal)
        {
            warnings.Add(new CanvasWarning(
                "amountMismatch",
                string.Create(CultureInfo.GetCultureInfo("pl-PL"),
                    $"Wnioskowana kwota ({amount.GetDecimal():N2} zł) różni się od sumy kosztów w planie ({planTotal:N2} zł)."),
                amountBoard.Key));
        }

        return warnings;
    }

    /// <summary>The text answer of a board, or null when it is empty or not text.</summary>
    public static string? TextOf(JsonElement content, string key) =>
        content.ValueKind == JsonValueKind.Object && content.TryGetProperty(key, out var value) && value.ValueKind == JsonValueKind.String
            ? value.GetString()?.Trim() is { Length: > 0 } text ? text : null
            : null;

    private static void ValidatePlan(CanvasBoard board, JsonElement value, Dictionary<string, string[]> errors)
    {
        if (value.ValueKind != JsonValueKind.Object)
        {
            errors[board.Key] = ["Plan musi być obiektem z etapami."];
            return;
        }

        var phases = board.Phases!.Select(p => p.Key).ToHashSet(StringComparer.Ordinal);
        foreach (var phase in value.EnumerateObject())
        {
            if (!phases.Contains(phase.Name) || phase.Value.ValueKind != JsonValueKind.Array)
            {
                errors[$"{board.Key}.{phase.Name}"] = ["Nieznany etap planu."];
                continue;
            }

            if (phase.Value.GetArrayLength() > MaxPlanRowsPerPhase)
                errors[$"{board.Key}.{phase.Name}"] = [$"Najwyżej {MaxPlanRowsPerPhase} działań w etapie."];

            foreach (var row in phase.Value.EnumerateArray())
            {
                var valid = row.ValueKind == JsonValueKind.Object
                            && (!row.TryGetProperty("action", out var action) || action.ValueKind is JsonValueKind.String or JsonValueKind.Null
                                && (action.GetString()?.Length ?? 0) <= MaxActionLength)
                            && (!row.TryGetProperty("cost", out var cost) || cost.ValueKind is JsonValueKind.Null
                                || cost.ValueKind == JsonValueKind.Number && cost.GetDecimal() >= 0)
                            && ValidMonth(row, "from") && ValidMonth(row, "to");
                if (!valid)
                {
                    errors[$"{board.Key}.{phase.Name}"] = ["Każde działanie ma opis, miesiące (rrrr-mm) i koszt nieujemny."];
                    break;
                }
            }
        }
    }

    private static bool ValidMonth(JsonElement row, string name) =>
        !row.TryGetProperty(name, out var value) || value.ValueKind == JsonValueKind.Null
        || value.ValueKind == JsonValueKind.String && (value.GetString() is "" || ParseMonth(value.GetString()) is not null);

    private static decimal Cost(JsonElement row) =>
        row.ValueKind == JsonValueKind.Object && row.TryGetProperty("cost", out var cost) && cost.ValueKind == JsonValueKind.Number
            ? cost.GetDecimal()
            : 0;

    private static (DateOnly From, DateOnly To)? Months(JsonElement row)
    {
        if (row.ValueKind != JsonValueKind.Object)
            return null;
        var from = row.TryGetProperty("from", out var f) && f.ValueKind == JsonValueKind.String ? ParseMonth(f.GetString()) : null;
        var to = row.TryGetProperty("to", out var t) && t.ValueKind == JsonValueKind.String ? ParseMonth(t.GetString()) : null;
        from ??= to;
        to ??= from;
        if (from is null || to is null)
            return null;
        return from <= to ? (from.Value, to.Value) : (to.Value, from.Value);
    }

    private static DateOnly? ParseMonth(string? value) =>
        DateOnly.TryParseExact(value + "-01", "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var month) ? month : null;
}
