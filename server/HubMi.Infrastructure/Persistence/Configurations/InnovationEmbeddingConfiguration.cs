using HubMi.Domain.Innovations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubMi.Infrastructure.Persistence.Configurations;

internal sealed class InnovationEmbeddingConfiguration : IEntityTypeConfiguration<InnovationEmbedding>
{
    /// <summary>BGE-M3 dense vectors have 1024 numbers; a model with another size needs a migration.</summary>
    public const int Dimensions = 1024;

    public void Configure(EntityTypeBuilder<InnovationEmbedding> builder)
    {
        builder.ToTable("innovation_embedding");
        builder.HasKey(e => new { e.InnovationId, e.Kind, e.Ordinal });

        builder.Property(e => e.Kind).HasMaxLength(20).IsRequired();
        builder.Property(e => e.Model).HasMaxLength(100).IsRequired();
        builder.Property(e => e.Text).IsRequired();
        builder.Property(e => e.TextHash).HasMaxLength(64).IsRequired();
        builder.Property(e => e.Vector).HasColumnType($"vector({Dimensions})").IsRequired();

        // Cosine distance (<=>) must match the operator class, otherwise Postgres ignores the index.
        builder.HasIndex(e => e.Vector)
            .HasMethod("hnsw")
            .HasOperators("vector_cosine_ops");

        builder.HasOne<Innovation>()
            .WithMany()
            .HasForeignKey(e => e.InnovationId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
