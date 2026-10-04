using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace HubMi.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddInnovationEmbedding : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "innovation_embedding",
                columns: table => new
                {
                    innovation_id = table.Column<Guid>(type: "uuid", nullable: false),
                    model = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    text_hash = table.Column<string>(type: "character varying(64)", maxLength: 64, nullable: false),
                    vector = table.Column<float[]>(type: "real[]", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_innovation_embedding", x => x.innovation_id);
                    table.ForeignKey(
                        name: "fk_innovation_embedding_innovation_innovation_id",
                        column: x => x.innovation_id,
                        principalTable: "innovation",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "innovation_embedding");
        }
    }
}
