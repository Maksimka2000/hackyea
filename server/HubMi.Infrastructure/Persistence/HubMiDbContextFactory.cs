using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace HubMi.Infrastructure.Persistence;

/// <summary>Design-time only: lets <c>dotnet ef</c> build the model without starting the API. No connection is opened.</summary>
public sealed class HubMiDbContextFactory : IDesignTimeDbContextFactory<HubMiDbContext>
{
    public HubMiDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__HubMi")
                               ?? "Host=localhost;Database=hubmi";

        var options = new DbContextOptionsBuilder<HubMiDbContext>()
            .UseNpgsql(connectionString)
            .UseSnakeCaseNamingConvention()
            .Options;

        return new HubMiDbContext(options);
    }
}
