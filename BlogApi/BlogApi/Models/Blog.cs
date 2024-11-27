using System.ComponentModel.DataAnnotations;

namespace BlogApi.Models
{
    public class Blog
    {
        [Key]
        public int BlogId { get; set; }

        [Required]
        public string Title { get; set; } = string.Empty;


        public string Description { get; set; } = string.Empty;

        [Required]
        public string Content { get; set; } = string.Empty;

        public required string Image { get; set; }

        public bool IsFeatured { get; set; }

        public int CategoryId { get; set; }
        public Category? Category { get; set; }

    }
}