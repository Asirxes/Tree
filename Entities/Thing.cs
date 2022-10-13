namespace Tree.Entities;

public class Thing
{
    public int Id { get; set; }

    public bool IsFolder { get; set; }

    public string? Name { get; set; }

    public string[]? Childrens { get; set; }

    public string? ParentName { get; set; }

    public byte[]? File { get; set; }
}