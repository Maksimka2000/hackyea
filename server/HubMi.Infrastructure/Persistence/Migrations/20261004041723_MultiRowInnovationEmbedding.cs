using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HubMi.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class MultiRowInnovationEmbedding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Vectors are derived data; the old rows (one per card, another model) are re-created by the indexer.
            migrationBuilder.Sql("DELETE FROM innovation_embedding;");

            migrationBuilder.DropPrimaryKey(
                name: "pk_innovation_embedding",
                table: "innovation_embedding");

            migrationBuilder.AddColumn<string>(
                name: "kind",
                table: "innovation_embedding",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ordinal",
                table: "innovation_embedding",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "text",
                table: "innovation_embedding",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "pk_innovation_embedding",
                table: "innovation_embedding",
                columns: new[] { "innovation_id", "kind", "ordinal" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM innovation_embedding;");

            migrationBuilder.DropPrimaryKey(
                name: "pk_innovation_embedding",
                table: "innovation_embedding");

            migrationBuilder.DropColumn(
                name: "kind",
                table: "innovation_embedding");

            migrationBuilder.DropColumn(
                name: "ordinal",
                table: "innovation_embedding");

            migrationBuilder.DropColumn(
                name: "text",
                table: "innovation_embedding");

            migrationBuilder.AddPrimaryKey(
                name: "pk_innovation_embedding",
                table: "innovation_embedding",
                column: "innovation_id");
        }
    }
}
