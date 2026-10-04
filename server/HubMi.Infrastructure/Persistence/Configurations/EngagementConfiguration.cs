using HubMi.Domain.Canvases;
using HubMi.Domain.Innovations;
using HubMi.Domain.Knowledge;
using HubMi.Domain.Notifications;
using HubMi.Domain.Submissions;
using HubMi.Domain.Testing;
using HubMi.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace HubMi.Infrastructure.Persistence.Configurations;

internal sealed class NotificationConfiguration : IEntityTypeConfiguration<Notification>
{
    public void Configure(EntityTypeBuilder<Notification> builder)
    {
        builder.ToTable("notification");
        builder.HasKey(n => n.Id);
        builder.Property(n => n.Kind).HasConversion<string>().HasMaxLength(30);
        builder.Property(n => n.Summary).HasMaxLength(Notification.MaxSummaryLength).IsRequired();
        builder.HasOne<ApplicationUser>().WithMany().HasForeignKey(n => n.RecipientUserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<Submission>().WithMany().HasForeignKey(n => n.SubmissionId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<Innovation>().WithMany().HasForeignKey(n => n.InnovationId).OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(n => new { n.RecipientUserId, n.ReadAt });
        builder.HasIndex(n => new { n.ForStaff, n.ReadAt });
    }
}

internal sealed class InnovationRatingConfiguration : IEntityTypeConfiguration<InnovationRating>
{
    public void Configure(EntityTypeBuilder<InnovationRating> builder)
    {
        builder.ToTable("innovation_rating", t => t.HasCheckConstraint("ck_innovation_rating_stars", "stars BETWEEN 1 AND 5"));
        builder.HasKey(r => new { r.InnovationId, r.UserId });
        builder.HasOne<Innovation>().WithMany().HasForeignKey(r => r.InnovationId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<ApplicationUser>().WithMany().HasForeignKey(r => r.UserId).OnDelete(DeleteBehavior.Cascade);
    }
}

internal sealed class InnovationFeedbackConfiguration : IEntityTypeConfiguration<InnovationFeedback>
{
    public void Configure(EntityTypeBuilder<InnovationFeedback> builder)
    {
        builder.ToTable("innovation_feedback");
        builder.HasKey(f => f.Id);
        builder.Property(f => f.Kind).HasConversion<string>().HasMaxLength(20);
        builder.Property(f => f.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(f => f.Body).HasMaxLength(InnovationFeedback.MaxBodyLength).IsRequired();
        builder.Property(f => f.StaffNote).HasMaxLength(1000);
        builder.HasOne<Innovation>().WithMany().HasForeignKey(f => f.InnovationId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<ApplicationUser>().WithMany().HasForeignKey(f => f.UserId).OnDelete(DeleteBehavior.Cascade);
        builder.HasIndex(f => new { f.Status, f.CreatedAt });
        builder.HasIndex(f => f.UserId);
    }
}

internal sealed class InnovationCanvasConfiguration : IEntityTypeConfiguration<InnovationCanvas>
{
    public void Configure(EntityTypeBuilder<InnovationCanvas> builder)
    {
        builder.ToTable("innovation_canvas");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.TemplateKey).HasMaxLength(100).IsRequired();
        builder.Property(c => c.Title).HasMaxLength(InnovationCanvas.MaxTitleLength).IsRequired();
        builder.Property(c => c.ContentJson).HasColumnName("content").HasColumnType("jsonb").IsRequired();
        builder.HasOne<ApplicationUser>().WithMany().HasForeignKey(c => c.OwnerId).OnDelete(DeleteBehavior.Cascade);
        builder.HasOne<Submission>().WithMany().HasForeignKey(c => c.SubmissionId).OnDelete(DeleteBehavior.SetNull);
        builder.HasIndex(c => new { c.OwnerId, c.UpdatedAt });
    }
}

internal sealed class ChallengeConfiguration : IEntityTypeConfiguration<Challenge>
{
    public void Configure(EntityTypeBuilder<Challenge> builder)
    {
        builder.ToTable("challenge");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Title).HasMaxLength(300).IsRequired();
        builder.Property(c => c.Description).HasMaxLength(8000).IsRequired();
        builder.Property(c => c.CategoryId).HasMaxLength(100);
        builder.Property(c => c.Source).HasMaxLength(500);
        builder.Property(c => c.Status).HasConversion<string>().HasMaxLength(20);
        builder.HasOne<InnovationCategory>().WithMany().HasForeignKey(c => c.CategoryId).OnDelete(DeleteBehavior.SetNull);
    }
}

internal sealed class MaterialConfiguration : IEntityTypeConfiguration<Material>
{
    public void Configure(EntityTypeBuilder<Material> builder)
    {
        builder.ToTable("material");
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Title).HasMaxLength(300).IsRequired();
        builder.Property(m => m.Summary).HasMaxLength(1000).IsRequired();
        builder.Property(m => m.Url).HasMaxLength(2000);
        builder.Property(m => m.Body).HasMaxLength(20000);
        builder.Property(m => m.Type).HasConversion<string>().HasMaxLength(20);
        builder.Property(m => m.Status).HasConversion<string>().HasMaxLength(20);
    }
}
