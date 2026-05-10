using System.ComponentModel.DataAnnotations;

namespace Travel_Odoo.Models.DTOs;

public class PackingItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Category { get; set; } = null!;
    public bool IsPacked { get; set; }
    public int SortOrder { get; set; }
}

public class CreatePackingItemRequestDto
{
    [Required, MaxLength(150)]
    public string Name { get; set; } = null!;

    public PackingCategory Category { get; set; } = PackingCategory.Other;

    public int SortOrder { get; set; } = 0;
}

public class UpdatePackingItemRequestDto : CreatePackingItemRequestDto
{
    public bool IsPacked { get; set; } = false;
}

public class PackingChecklistDto
{
    public int TotalItems { get; set; }
    public int PackedItems { get; set; }
    public ICollection<PackingItemsByCategoryDto> Categories { get; set; } = new List<PackingItemsByCategoryDto>();
}

public class PackingItemsByCategoryDto
{
    public string Category { get; set; } = null!;
    public ICollection<PackingItemDto> Items { get; set; } = new List<PackingItemDto>();
}
