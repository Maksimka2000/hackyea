using HubMi.Domain.Innovations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubMi.Infrastructure.Persistence.Configurations;

internal sealed class InnovationEmbeddingConfiguration : IEntityTypeConfiguration<InnovationEmbedding>
{
    public void Configure(EntityTypeBuilder<InnovationEmbedding> builder)
    {
        builder.ToTable("innovation_embedding");
        builder.HasKey(e => new { e.InnovationId, e.Kind, e.Ordinal });

        builder.Property(e => e.Kind).HasMaxLength(20).IsRequired();
        builder.Property(e => e.Model).HasMaxLength(100).IsRequired();
        builder.Property(e => e.Text).IsRequired();
        builder.Property(e => e.TextHash).HasMaxLength(64).IsRequired();
        builder.Property(e => e.Vector).HasColumnType("real[]").IsRequired();

        builder.HasOne<Innovation>()
            .WithMany()
            .HasForeignKey(e => e.InnovationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
