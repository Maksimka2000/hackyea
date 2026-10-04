using HubMi.Domain.Innovations;
using HubMi.Domain.Submissions;
using HubMi.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubMi.Infrastructure.Persistence.Configurations;

internal sealed class SubmissionConfiguration : IEntityTypeConfiguration<Submission>
{
    /// <summary>Feeds the human submission number (HM-2026-0042).</summary>
    public const string NumberSequence = "submission_number_seq";

    public void Configure(EntityTypeBuilder<Submission> builder)
    {
        builder.ToTable("submission");
        builder.HasKey(s => s.Id);

        builder.Property(s => s.Number).HasMaxLength(30).IsRequired();
        builder.HasIndex(s => s.Number).IsUnique();
        builder.Property(s => s.AuthorRole).HasMaxLength(20).IsRequired();
        builder.Property(s => s.Type).HasConversion<string>().HasMaxLength(20);
        builder.Property(s => s.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(s => s.Stage).HasConversion<string>().HasMaxLength(20);
        builder.Property(s => s.Title).HasMaxLength(Submission.MaxTitleLength).IsRequired();
        builder.Property(s => s.Description).HasMaxLength(Submission.MaxDescriptionLength).IsRequired();
        builder.Property(s => s.CategoryId).HasMaxLength(100);
        builder.Property(s => s.Place).HasMaxLength(300);
        builder.Property(s => s.TargetGroup).HasMaxLength(300);
        builder.Property(s => s.PilotScale).HasMaxLength(300);
        builder.Property(s => s.Results).HasMaxLength(Submission.MaxDescriptionLength);
        builder.Property(s => s.RejectionReason).HasMaxLength(1000);

        builder.HasOne<ApplicationUser>().WithMany().HasForeignKey(s => s.AuthorId).OnDelete(DeleteBehavior.Restrict);
        builder.HasOne<InnovationCategory>().WithMany().HasForeignKey(s => s.CategoryId).OnDelete(DeleteBehavior.SetNull);

        builder.HasMany(s => s.Messages).WithOne().HasForeignKey(m => m.SubmissionId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(s => s.StatusChanges).WithOne().HasForeignKey(c => c.SubmissionId).OnDelete(DeleteBehavior.Cascade);
        builder.HasMany(s => s.Links).WithOne().HasForeignKey(l => l.SubmissionId).OnDelete(DeleteBehavior.Cascade);
        builder.Navigation(s => s.Messages).UsePropertyAccessMode(PropertyAccessMode.Field);
        builder.Navigation(s => s.StatusChanges).UsePropertyAccessMode(PropertyAccessMode.Field);
        builder.Navigation(s => s.Links).UsePropertyAccessMode(PropertyAccessMode.Field);

        builder.HasIndex(s => new { s.AuthorId, s.CreatedAt });
        builder.HasIndex(s => s.CreatedAt);
        builder.HasIndex(s => s.Status);
        builder.HasIndex(s => s.CategoryId);
    }
}

internal sealed class SubmissionMessageConfiguration : IEntityTypeConfiguration<SubmissionMessage>
{
    public void Configure(EntityTypeBuilder<SubmissionMessage> builder)
    {
        builder.ToTable("submission_message");
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).ValueGeneratedNever();
        builder.Property(m => m.AuthorRole).HasMaxLength(20).IsRequired();
        builder.Property(m => m.Body).HasMaxLength(Submission.MaxMessageLength).IsRequired();
        builder.HasOne<ApplicationUser>().WithMany().HasForeignKey(m => m.AuthorId).OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(m => new { m.SubmissionId, m.CreatedAt });
    }
}

internal sealed class SubmissionStatusChangeConfiguration : IEntityTypeConfiguration<SubmissionStatusChange>
{
    public void Configure(EntityTypeBuilder<SubmissionStatusChange> builder)
    {
        builder.ToTable("submission_status_change");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).ValueGeneratedNever();
        builder.Property(c => c.From).HasConversion<string>().HasMaxLength(20);
        builder.Property(c => c.To).HasConversion<string>().HasMaxLength(20);
        builder.Property(c => c.Note).HasMaxLength(1000);
        builder.HasIndex(c => new { c.SubmissionId, c.ChangedAt });
    }
}

internal sealed class SubmissionInnovationLinkConfiguration : IEntityTypeConfiguration<SubmissionInnovationLink>
{
    public void Configure(EntityTypeBuilder<SubmissionInnovationLink> builder)
    {
        builder.ToTable("submission_innovation_link");
        builder.HasKey(l => new { l.SubmissionId, l.InnovationId });
        builder.Property(l => l.Source).HasConversion<string>().HasMaxLength(20);
        builder.HasOne<Innovation>().WithMany().HasForeignKey(l => l.InnovationId).OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(l => l.InnovationId);
    }
}
