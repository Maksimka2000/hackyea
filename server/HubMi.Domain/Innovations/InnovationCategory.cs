namespace HubMi.Domain.Innovations;

public sealed class InnovationCategory
{
    private InnovationCategory()
    {
    }

    public string Id { get; private set; } = null!;
    public string Name { get; private set; } = null!;
    public int DisplayOrder { get; private set; }

    public static InnovationCategory Create(string id, string name, int displayOrder)
    {
        if (string.IsNullOrWhiteSpace(id))
            throw new ArgumentException("Category id is required.", nameof(id));
        if (string.IsNullOrWhiteSpace(name))
            throw new ArgumentException("Category name is required.", nameof(name));

        return new InnovationCategory { Id = id.Trim(), Name = name.Trim(), DisplayOrder = displayOrder };
    }
}
