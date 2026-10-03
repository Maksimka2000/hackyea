using HubMi.Domain.Innovations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubMi.Infrastructure.Persistence.Configurations;

/// <summary>
/// The full-text <c>search_vector</c> column, its index and the <c>hubmi_fold</c> function are created in SQL by the
/// initial migration. They are deliberately not part of the EF model: the search port queries them with raw SQL.
/// </summary>
internal sealed class InnovationConfiguration : IEntityTypeConfiguration<Innovation>
{
    public void Configure(EntityTypeBuilder<Innovation> builder)
    {
        builder.ToTable("innovation");
        builder.HasKey(i => i.Id);

        builder.Property(i => i.Id).HasMaxLength(200);
        builder.Property(i => i.CategoryId).HasMaxLength(100).IsRequired();
        builder.Property(i => i.Title).HasMaxLength(500).IsRequired();
        builder.Property(i => i.SourceUrl).HasMaxLength(2000).IsRequired();
        builder.Property(i => i.LicenseUrl).HasMaxLength(2000).IsRequired();
        builder.Property(i => i.VideoUrl).HasMaxLength(2000);
        builder.Property(i => i.MaterialsUrl).HasMaxLength(2000);
        builder.Property(i => i.DetailsPdfUrl).HasMaxLength(2000);
        builder.Property(i => i.DisseminationBadge).HasMaxLength(300);

        builder.HasOne<InnovationCategory>()
            .WithMany()
            .HasForeignKey(i => i.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(i => i.CategoryId);
    }
}
