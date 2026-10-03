using HubMi.Domain.Innovations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubMi.Infrastructure.Persistence.Configurations;

internal sealed class InnovationCategoryConfiguration : IEntityTypeConfiguration<InnovationCategory>
{
    public void Configure(EntityTypeBuilder<InnovationCategory> builder)
    {
        builder.ToTable("innovation_category");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasMaxLength(100);
        builder.Property(c => c.Name).HasMaxLength(200).IsRequired();
    }
}
