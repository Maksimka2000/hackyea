using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace HubMi.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddAccountsAndEngagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateSequence(
                name: "submission_number_seq");

            // Cards that exist already were published (is_published = true), so they keep that status.
            migrationBuilder.AddColumn<string>(
                name: "status",
                table: "innovation",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "Published");

            migrationBuilder.AddColumn<DateTime>(
                name: "verified_at",
                table: "innovation",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "verified_by",
                table: "innovation",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "AspNetRoles",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_roles", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUsers",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    display_name = table.Column<string>(type: "text", nullable: false),
                    organization_name = table.Column<string>(type: "text", nullable: true),
                    municipality = table.Column<string>(type: "text", nullable: true),
                    user_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_user_name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    normalized_email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                    email_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: true),
                    security_stamp = table.Column<string>(type: "text", nullable: true),
                    concurrency_stamp = table.Column<string>(type: "text", nullable: true),
                    phone_number = table.Column<string>(type: "text", nullable: true),
                    phone_number_confirmed = table.Column<bool>(type: "boolean", nullable: false),
                    two_factor_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    lockout_end = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    lockout_enabled = table.Column<bool>(type: "boolean", nullable: false),
                    access_failed_count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_users", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "challenge",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    description = table.Column<string>(type: "character varying(8000)", maxLength: 8000, nullable: false),
                    category_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    source = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_challenge", x => x.id);
                    table.ForeignKey(
                        name: "fk_challenge_innovation_categories_category_id",
                        column: x => x.category_id,
                        principalTable: "innovation_category",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "material",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    title = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: false),
                    summary = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    url = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    body = table.Column<string>(type: "character varying(20000)", maxLength: 20000, nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_material", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "AspNetRoleClaims",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    role_id = table.Column<Guid>(type: "uuid", nullable: false),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_role_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_asp_net_role_claims_asp_net_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "AspNetRoles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserClaims",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    claim_type = table.Column<string>(type: "text", nullable: true),
                    claim_value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_claims", x => x.id);
                    table.ForeignKey(
                        name: "fk_asp_net_user_claims_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserLogins",
                columns: table => new
                {
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    provider_key = table.Column<string>(type: "text", nullable: false),
                    provider_display_name = table.Column<string>(type: "text", nullable: true),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_logins", x => new { x.login_provider, x.provider_key });
                    table.ForeignKey(
                        name: "fk_asp_net_user_logins_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserRoles",
                columns: table => new
                {
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    role_id = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_roles", x => new { x.user_id, x.role_id });
                    table.ForeignKey(
                        name: "fk_asp_net_user_roles_asp_net_roles_role_id",
                        column: x => x.role_id,
                        principalTable: "AspNetRoles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_asp_net_user_roles_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AspNetUserTokens",
                columns: table => new
                {
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    login_provider = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_asp_net_user_tokens", x => new { x.user_id, x.login_provider, x.name });
                    table.ForeignKey(
                        name: "fk_asp_net_user_tokens_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "innovation_feedback",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    innovation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    kind = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    body = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    staff_note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    reviewed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_innovation_feedback", x => x.id);
                    table.ForeignKey(
                        name: "fk_innovation_feedback_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_innovation_feedback_innovation_innovation_id",
                        column: x => x.innovation_id,
                        principalTable: "innovation",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "innovation_rating",
                columns: table => new
                {
                    innovation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    stars = table.Column<int>(type: "integer", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_innovation_rating", x => new { x.innovation_id, x.user_id });
                    table.CheckConstraint("ck_innovation_rating_stars", "stars BETWEEN 1 AND 5");
                    table.ForeignKey(
                        name: "fk_innovation_rating_asp_net_users_user_id",
                        column: x => x.user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_innovation_rating_innovation_innovation_id",
                        column: x => x.innovation_id,
                        principalTable: "innovation",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "submission",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    number = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    author_id = table.Column<Guid>(type: "uuid", nullable: false),
                    author_role = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    type = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    category_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    place = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    target_group = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    stage = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    pilot_scale = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    results = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: true),
                    canvas_id = table.Column<Guid>(type: "uuid", nullable: true),
                    status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    rejection_reason = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    seen_by_admin_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    first_response_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_submission", x => x.id);
                    table.ForeignKey(
                        name: "fk_submission_asp_net_users_author_id",
                        column: x => x.author_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_submission_innovation_category_category_id",
                        column: x => x.category_id,
                        principalTable: "innovation_category",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "innovation_canvas",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    owner_id = table.Column<Guid>(type: "uuid", nullable: false),
                    template_key = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    title = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    content = table.Column<string>(type: "jsonb", nullable: false),
                    submission_id = table.Column<Guid>(type: "uuid", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_innovation_canvas", x => x.id);
                    table.ForeignKey(
                        name: "fk_innovation_canvas_asp_net_users_owner_id",
                        column: x => x.owner_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_innovation_canvas_submissions_submission_id",
                        column: x => x.submission_id,
                        principalTable: "submission",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "notification",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    recipient_user_id = table.Column<Guid>(type: "uuid", nullable: true),
                    for_staff = table.Column<bool>(type: "boolean", nullable: false),
                    kind = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    submission_id = table.Column<Guid>(type: "uuid", nullable: true),
                    innovation_id = table.Column<Guid>(type: "uuid", nullable: true),
                    summary = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    read_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_notification", x => x.id);
                    table.ForeignKey(
                        name: "fk_notification_asp_net_users_recipient_user_id",
                        column: x => x.recipient_user_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_notification_innovation_innovation_id",
                        column: x => x.innovation_id,
                        principalTable: "innovation",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_notification_submissions_submission_id",
                        column: x => x.submission_id,
                        principalTable: "submission",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "submission_innovation_link",
                columns: table => new
                {
                    submission_id = table.Column<Guid>(type: "uuid", nullable: false),
                    innovation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    score = table.Column<int>(type: "integer", nullable: true),
                    source = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_submission_innovation_link", x => new { x.submission_id, x.innovation_id });
                    table.ForeignKey(
                        name: "fk_submission_innovation_link_innovation_innovation_id",
                        column: x => x.innovation_id,
                        principalTable: "innovation",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_submission_innovation_link_submissions_submission_id",
                        column: x => x.submission_id,
                        principalTable: "submission",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "submission_message",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    submission_id = table.Column<Guid>(type: "uuid", nullable: false),
                    author_id = table.Column<Guid>(type: "uuid", nullable: false),
                    author_role = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    body = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_submission_message", x => x.id);
                    table.ForeignKey(
                        name: "fk_submission_message_asp_net_users_author_id",
                        column: x => x.author_id,
                        principalTable: "AspNetUsers",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_submission_message_submissions_submission_id",
                        column: x => x.submission_id,
                        principalTable: "submission",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "submission_status_change",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    submission_id = table.Column<Guid>(type: "uuid", nullable: false),
                    from = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    to = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    changed_by = table.Column<Guid>(type: "uuid", nullable: false),
                    note = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: true),
                    changed_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_submission_status_change", x => x.id);
                    table.ForeignKey(
                        name: "fk_submission_status_change_submissions_submission_id",
                        column: x => x.submission_id,
                        principalTable: "submission",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_innovation_status",
                table: "innovation",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_role_claims_role_id",
                table: "AspNetRoleClaims",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "RoleNameIndex",
                table: "AspNetRoles",
                column: "normalized_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_claims_user_id",
                table: "AspNetUserClaims",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_logins_user_id",
                table: "AspNetUserLogins",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_asp_net_user_roles_role_id",
                table: "AspNetUserRoles",
                column: "role_id");

            migrationBuilder.CreateIndex(
                name: "EmailIndex",
                table: "AspNetUsers",
                column: "normalized_email");

            migrationBuilder.CreateIndex(
                name: "UserNameIndex",
                table: "AspNetUsers",
                column: "normalized_user_name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_challenge_category_id",
                table: "challenge",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_innovation_canvas_owner_id_updated_at",
                table: "innovation_canvas",
                columns: new[] { "owner_id", "updated_at" });

            migrationBuilder.CreateIndex(
                name: "ix_innovation_canvas_submission_id",
                table: "innovation_canvas",
                column: "submission_id");

            migrationBuilder.CreateIndex(
                name: "ix_innovation_feedback_innovation_id",
                table: "innovation_feedback",
                column: "innovation_id");

            migrationBuilder.CreateIndex(
                name: "ix_innovation_feedback_status_created_at",
                table: "innovation_feedback",
                columns: new[] { "status", "created_at" });

            migrationBuilder.CreateIndex(
                name: "ix_innovation_feedback_user_id",
                table: "innovation_feedback",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_innovation_rating_user_id",
                table: "innovation_rating",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_notification_for_staff_read_at",
                table: "notification",
                columns: new[] { "for_staff", "read_at" });

            migrationBuilder.CreateIndex(
                name: "ix_notification_innovation_id",
                table: "notification",
                column: "innovation_id");

            migrationBuilder.CreateIndex(
                name: "ix_notification_recipient_user_id_read_at",
                table: "notification",
                columns: new[] { "recipient_user_id", "read_at" });

            migrationBuilder.CreateIndex(
                name: "ix_notification_submission_id",
                table: "notification",
                column: "submission_id");

            migrationBuilder.CreateIndex(
                name: "ix_submission_author_id_created_at",
                table: "submission",
                columns: new[] { "author_id", "created_at" });

            migrationBuilder.CreateIndex(
                name: "ix_submission_category_id",
                table: "submission",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_submission_created_at",
                table: "submission",
                column: "created_at");

            migrationBuilder.CreateIndex(
                name: "ix_submission_number",
                table: "submission",
                column: "number",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_submission_status",
                table: "submission",
                column: "status");

            migrationBuilder.CreateIndex(
                name: "ix_submission_innovation_link_innovation_id",
                table: "submission_innovation_link",
                column: "innovation_id");

            migrationBuilder.CreateIndex(
                name: "ix_submission_message_author_id",
                table: "submission_message",
                column: "author_id");

            migrationBuilder.CreateIndex(
                name: "ix_submission_message_submission_id_created_at",
                table: "submission_message",
                columns: new[] { "submission_id", "created_at" });

            migrationBuilder.CreateIndex(
                name: "ix_submission_status_change_submission_id_changed_at",
                table: "submission_status_change",
                columns: new[] { "submission_id", "changed_at" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AspNetRoleClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserClaims");

            migrationBuilder.DropTable(
                name: "AspNetUserLogins");

            migrationBuilder.DropTable(
                name: "AspNetUserRoles");

            migrationBuilder.DropTable(
                name: "AspNetUserTokens");

            migrationBuilder.DropTable(
                name: "challenge");

            migrationBuilder.DropTable(
                name: "innovation_canvas");

            migrationBuilder.DropTable(
                name: "innovation_feedback");

            migrationBuilder.DropTable(
                name: "innovation_rating");

            migrationBuilder.DropTable(
                name: "material");

            migrationBuilder.DropTable(
                name: "notification");

            migrationBuilder.DropTable(
                name: "submission_innovation_link");

            migrationBuilder.DropTable(
                name: "submission_message");

            migrationBuilder.DropTable(
                name: "submission_status_change");

            migrationBuilder.DropTable(
                name: "AspNetRoles");

            migrationBuilder.DropTable(
                name: "submission");

            migrationBuilder.DropTable(
                name: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "ix_innovation_status",
                table: "innovation");

            migrationBuilder.DropColumn(
                name: "status",
                table: "innovation");

            migrationBuilder.DropColumn(
                name: "verified_at",
                table: "innovation");

            migrationBuilder.DropColumn(
                name: "verified_by",
                table: "innovation");

            migrationBuilder.DropSequence(
                name: "submission_number_seq");
        }
    }
}
