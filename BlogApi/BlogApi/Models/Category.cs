

using System.ComponentModel.DataAnnotations;

namespace BlogApi.Models
{
    public class Category
    {
        [Key]
        public int CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;



    }
}