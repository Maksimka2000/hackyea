using HubMi.Domain.Innovations;
using HubMi.Domain.Matching;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubMi.Infrastructure.Persistence.Configurations;

internal sealed class MatchRequestConfiguration : IEntityTypeConfiguration<MatchRequest>
{
    public void Configure(EntityTypeBuilder<MatchRequest> builder)
    {
        builder.ToTable("match_request");
        builder.HasKey(r => r.Id);

        builder.Property(r => r.Text).HasMaxLength(1000).IsRequired();
        builder.Property(r => r.ResolvedCategoryId).HasMaxLength(100);
        builder.Property(r => r.Confidence).HasConversion<string>().HasMaxLength(20);
        builder.Property(r => r.ClientKey).HasMaxLength(64);

        builder.HasOne<InnovationCategory>()
            .WithMany()
            .HasForeignKey(r => r.ResolvedCategoryId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(r => r.Results)
            .WithOne()
            .HasForeignKey(r => r.MatchRequestId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(r => r.Results).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasIndex(r => r.ReceivedAt);
        builder.HasIndex(r => r.ResolvedCategoryId);
    }
}
