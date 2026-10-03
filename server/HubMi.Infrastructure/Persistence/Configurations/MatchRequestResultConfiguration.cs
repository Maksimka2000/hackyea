using HubMi.Domain.Innovations;
using HubMi.Domain.Matching;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubMi.Infrastructure.Persistence.Configurations;

internal sealed class MatchRequestResultConfiguration : IEntityTypeConfiguration<MatchRequestResult>
{
    public void Configure(EntityTypeBuilder<MatchRequestResult> builder)
    {
        builder.ToTable("match_request_result");
        builder.HasKey(r => new { r.MatchRequestId, r.InnovationId });

        builder.Property(r => r.Level).HasConversion<string>().HasMaxLength(20);

        builder.HasOne<Innovation>()
            .WithMany()
            .HasForeignKey(r => r.InnovationId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(r => r.InnovationId);
    }
}
