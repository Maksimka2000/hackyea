using Microsoft.EntityFrameworkCore.Migrations;
using Pgvector;

#nullable disable

namespace HubMi.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class PgvectorEmbeddings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:vector", ",,");

            // Vectors are derived data: the old rows (including the removed synthetic ones) are re-created by the indexer.
            migrationBuilder.Sql("DELETE FROM innovation_embedding;");

            migrationBuilder.AlterColumn<Vector>(
                name: "vector",
                table: "innovation_embedding",
                type: "vector(1024)",
                nullable: false,
                oldClrType: typeof(float[]),
                oldType: "real[]");

            migrationBuilder.CreateIndex(
                name: "ix_innovation_embedding_vector",
                table: "innovation_embedding",
                column: "vector")
                .Annotation("Npgsql:IndexMethod", "hnsw")
                .Annotation("Npgsql:IndexOperators", new[] { "vector_cosine_ops" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "ix_innovation_embedding_vector",
                table: "innovation_embedding");

            migrationBuilder.Sql("DELETE FROM innovation_embedding;");

            migrationBuilder.AlterColumn<float[]>(
                name: "vector",
                table: "innovation_embedding",
                type: "real[]",
                nullable: false,
                oldClrType: typeof(Vector),
                oldType: "vector(1024)");

            // After the column: the extension cannot be dropped while a column still uses its type.
            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:vector", ",,");
        }
    }
}
