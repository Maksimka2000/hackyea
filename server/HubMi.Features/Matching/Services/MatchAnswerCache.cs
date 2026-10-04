using Microsoft.Extensions.Caching.Memory;

namespace HubMi.Features.Matching.Services;

/// <summary>
/// Answers to identical questions, kept in memory for a while. It owns a private, size-limited cache so that it neither
/// grows without bound nor imposes a size limit on the application's shared cache.
/// </summary>
public sealed class MatchAnswerCache : IDisposable
{
    private const int MaxEntries = 1000;

    private readonly MemoryCache _cache = new(new MemoryCacheOptions { SizeLimit = MaxEntries });

    public bool TryGet<T>(string key, out T? value) => _cache.TryGetValue(key, out value);

    public void Set<T>(string key, T value, TimeSpan lifetime) =>
        _cache.Set(key, value, new MemoryCacheEntryOptions { Size = 1, AbsoluteExpirationRelativeToNow = lifetime });

    public void Dispose() => _cache.Dispose();
}
