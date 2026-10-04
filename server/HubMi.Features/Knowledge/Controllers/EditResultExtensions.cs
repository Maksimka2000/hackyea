using HubMi.Features.Knowledge.Services;
using Microsoft.AspNetCore.Mvc;

namespace HubMi.Features.Knowledge.Controllers;

internal static class EditResultExtensions
{
    public static IActionResult ToActionResult(this ControllerBase controller, EditResult result) =>
        !result.Found ? controller.NotFound()
        : result.Errors.Count > 0 ? controller.ValidationProblem(new ValidationProblemDetails(result.Errors))
        : controller.NoContent();

    public static bool TryParseAction(string action, out PublicationAction parsed) =>
        Enum.TryParse(action, ignoreCase: true, out parsed) && Enum.IsDefined(parsed);
}
