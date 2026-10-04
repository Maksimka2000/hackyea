using HubMi.Features.Matching.Ports;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace HubMi.Infrastructure.Embeddings;

public static class EmbeddingRegistration
{
    /// <summary>
    /// Registers the local embedding model, the reranker, the in-memory vector index and the background refresher.
    /// Call after <c>AddPersistence</c>: the refresher must start after the initializer has migrated and seeded the database.
    /// </summary>
    public static IServiceCollection AddEmbeddings(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<EmbeddingOptions>()
            .Bind(configuration.GetSection(EmbeddingOptions.SectionName))
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton<XlmRobertaTokenizer>();
        services.AddSingleton<OnnxTextEmbedder>();
        services.AddSingleton<ITextEmbedder>(sp => sp.GetRequiredService<OnnxTextEmbedder>());
        services.AddSingleton<OnnxReranker>();
        services.AddSingleton<IReranker>(sp => sp.GetRequiredService<OnnxReranker>());
        services.AddSingleton<ISyntheticSentenceSource, JsonSyntheticSentenceSource>();
        services.AddSingleton<InnovationVectorIndex>();
        services.AddSingleton<IInnovationVectorIndex>(sp => sp.GetRequiredService<InnovationVectorIndex>());
        services.AddScoped<IInnovationIndexer, InnovationIndexer>();
        services.AddHostedService<VectorIndexRefresher>();

        return services;
    }
}
