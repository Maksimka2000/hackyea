using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HubMi.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "innovation_category",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    name = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    display_order = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_innovation_category", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "innovation",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    category_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    title = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    tagline = table.Column<string>(type: "text", nullable: true),
                    solution = table.Column<string>(type: "text", nullable: true),
                    problems = table.Column<string>(type: "text", nullable: true),
                    target_group = table.Column<string>(type: "text", nullable: true),
                    beneficiaries = table.Column<string>(type: "text", nullable: true),
                    evidence = table.Column<string>(type: "text", nullable: true),
                    source_url = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    video_url = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    materials_url = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    details_pdf_url = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: true),
                    license_url = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    dissemination_badge = table.Column<string>(type: "character varying(300)", maxLength: 300, nullable: true),
                    is_published = table.Column<bool>(type: "boolean", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_innovation", x => x.id);
                    table.ForeignKey(
                        name: "fk_innovation_innovation_category_category_id",
                        column: x => x.category_id,
                        principalTable: "innovation_category",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "match_request",
                columns: table => new
                {
                    id = table.Column<Guid>(type: "uuid", nullable: false),
                    text = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    dictated = table.Column<bool>(type: "boolean", nullable: false),
                    received_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    resolved_category_id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    top_percent = table.Column<int>(type: "integer", nullable: false),
                    confidence = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    client_key = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_match_request", x => x.id);
                    table.ForeignKey(
                        name: "fk_match_request_innovation_category_resolved_category_id",
                        column: x => x.resolved_category_id,
                        principalTable: "innovation_category",
                        principalColumn: "id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "match_request_result",
                columns: table => new
                {
                    match_request_id = table.Column<Guid>(type: "uuid", nullable: false),
                    innovation_id = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    rank = table.Column<int>(type: "integer", nullable: false),
                    percent = table.Column<int>(type: "integer", nullable: false),
                    level = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_match_request_result", x => new { x.match_request_id, x.innovation_id });
                    table.ForeignKey(
                        name: "fk_match_request_result_innovation_innovation_id",
                        column: x => x.innovation_id,
                        principalTable: "innovation",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_match_request_result_match_request_match_request_id",
                        column: x => x.match_request_id,
                        principalTable: "match_request",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_innovation_category_id",
                table: "innovation",
                column: "category_id");

            migrationBuilder.CreateIndex(
                name: "ix_match_request_received_at",
                table: "match_request",
                column: "received_at");

            migrationBuilder.CreateIndex(
                name: "ix_match_request_resolved_category_id",
                table: "match_request",
                column: "resolved_category_id");

            migrationBuilder.CreateIndex(
                name: "ix_match_request_result_innovation_id",
                table: "match_request_result",
                column: "innovation_id");

            // Full-text search: not part of the EF model, queried with raw SQL by PostgresInnovationSearch.
            // hubmi_fold must stay in sync with TextNormalizer.Fold (HubMi.Features), which folds query prefixes the same way.
            migrationBuilder.Sql("CREATE EXTENSION IF NOT EXISTS pg_trgm;");

            migrationBuilder.Sql("""
                CREATE FUNCTION hubmi_fold(input text) RETURNS text
                LANGUAGE sql IMMUTABLE PARALLEL SAFE
                AS $$ SELECT lower(translate(input, 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ', 'acelnoszzACELNOSZZ')) $$;
                """);

            migrationBuilder.Sql("""
                ALTER TABLE innovation ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
                    setweight(to_tsvector('simple', hubmi_fold(coalesce(title, '') || ' ' || coalesce(tagline, ''))), 'A') ||
                    setweight(to_tsvector('simple', hubmi_fold(coalesce(problems, '') || ' ' || coalesce(target_group, ''))), 'B') ||
                    setweight(to_tsvector('simple', hubmi_fold(coalesce(solution, '') || ' ' || coalesce(beneficiaries, ''))), 'C')
                ) STORED;
                """);

            migrationBuilder.Sql("CREATE INDEX ix_innovation_search_vector ON innovation USING gin (search_vector);");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DROP INDEX IF EXISTS ix_innovation_search_vector;");
            migrationBuilder.Sql("ALTER TABLE innovation DROP COLUMN IF EXISTS search_vector;");
            migrationBuilder.Sql("DROP FUNCTION IF EXISTS hubmi_fold(text);");

            migrationBuilder.DropTable(
                name: "match_request_result");

            migrationBuilder.DropTable(
                name: "innovation");

            migrationBuilder.DropTable(
                name: "match_request");

            migrationBuilder.DropTable(
                name: "innovation_category");
        }
    }
}
